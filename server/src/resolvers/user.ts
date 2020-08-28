import { MyContext } from "./../types";
import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  ObjectType,
} from "type-graphql";
import argon2 from "argon2";
import { User } from "./../entities";

/**
 * @todo
 * - create generic type ApiResponse<T>
 * - git rid off this verbose error's handling
 */

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

@ObjectType()
class FieldError {
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
  @Mutation(() => UserResponse)
  async register(
    @Arg("data") data: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const { username, password } = data;

    if (username.length < 4) {
      return {
        errors: [
          {
            field: "username",
            message: `Username should be at least 4 characters`,
          },
        ],
      };
    }

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

    const sameUser = await em.findOne(User, { username });

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

    const hashedPassword = await argon2.hash(password);

    const user = em.create(User, { username, password: hashedPassword });
    await em.persistAndFlush(user);

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("data") data: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const { username, password } = data;
    const user = await em.findOne(User, { username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: `User ${username} doesn't exist`,
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

    return { user };
  }
}
