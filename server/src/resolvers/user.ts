import argon2 from "argon2";
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
import { validateRegisterInput } from "../utils/";
import { COOKIE_NAME } from "./../constants";
import { User } from "./../entities";
import { MyContext } from "./../types";

/**
 * @todo create generic type ApiResponse<T>
 * @todo git rid off this verbose error's handling
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
  async me(@Ctx() { em, req }: MyContext) {
    if (!req.session!.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session!.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("data") data: RegisterInput,
    @Ctx() { em, req }: MyContext
  ) {
    const { username, password, email } = data;
    const errors = validateRegisterInput(data);

    if (errors) return { errors };

    const sameUser = await em.findOne(User, { username });
    const sameEmail = await em.findOne(User, { email });

    if (sameUser) {
      return {
        errors: [
          {
            field: "email",
            message: `Email already taken`,
          },
        ],
      };
    }

    if (sameEmail) {
      return {
        errors: [
          {
            field: "username",
            message: `Username already taken`,
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);

    const user = em.create(User, {
      username,
      email,
      password: hashedPassword,
    });

    await em.persistAndFlush(user);
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ) {
    const user = await em.findOne(User, {
      [usernameOrEmail.includes("@") ? "username" : "email"]: usernameOrEmail,
    });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: `User ${usernameOrEmail} doesn't exist`,
          },
        ],
      };
    }

    const isValid = await argon2.verify(user?.password, password);

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
  async logout(@Ctx() { req, res }: MyContext) {
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
  async forgotPassword() {
    // @Ctx() { em, res }: MyContext // @Arg("email") email: string,
    // const user = await em.findOne(User, { email });

    return true;
  }
}
