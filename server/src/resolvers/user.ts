import argon2 from "argon2";
import { nanoid } from "nanoid";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { sendEmail, validateRegisterInput } from "../utils/";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "./../constants";
import { User } from "./../entities";
import { MyContext } from "./../types";

/**
 * @todo create generic type ApiResponse<T>. Make not boolean response for forgotPassword
 * @todo git rid of this verbose error's handling
 * @todo: register: make orm validate unique fields (username, email)
 */

@InputType()
export class RegisterInput {
  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
export class FieldError {
  @Field()
  field!: string;

  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("data") data: RegisterInput, //
    @Ctx() { req }: MyContext
  ) {
    const { username, password, email } = data;
    const errors = validateRegisterInput(data);

    if (errors) return { errors };
    const sameUser = await User.findOne({ where: { username } });
    const sameEmail = await User.findOne({ where: { email } });

    if (sameUser) {
      return {
        errors: [
          {
            field: "username",
            message: `Username already taken`,
          },
        ],
      };
    }

    if (sameEmail) {
      return {
        errors: [
          {
            field: "email",
            message: `Email already taken`,
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    }).save();

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ) {
    const searchingField = usernameOrEmail.includes("@") ? "email" : "username";
    const user = await User.findOne({
      where: {
        [searchingField]: usernameOrEmail,
      },
    });

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: `User ${usernameOrEmail} doesn't exist`,
          },
        ],
      };
    }

    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      return {
        errors: [
          {
            field: "password",
            message: `Password is incorrect`,
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async logout(
    @Ctx() { req, res }: MyContext //
  ) {
    return new Promise((resolve) => {
      res.clearCookie(COOKIE_NAME);

      req.session.destroy((err) => {
        if (err) {
          console.log(err);

          resolve(false);
        }

        resolve(true);
      });
    });
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Ctx() { redis }: MyContext, //
    @Arg("email") email: string
  ) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return false;
    }

    const token = nanoid();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3 // 3 days
    );

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password?token=${token}">Reset password</a>`
    );

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Ctx() { redis, req }: MyContext,
    @Arg("token") token: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    if (password.length < 8) {
      return {
        errors: [
          {
            field: "password",
            message: `Password should be at least 8 characters`,
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: `Token expired`,
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: `User no longer exist`,
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);
    await User.update({ id: userIdNum }, { password: hashedPassword });
    await redis.del(key);

    req.session.userId = user.id;

    return { user };
  }
}
