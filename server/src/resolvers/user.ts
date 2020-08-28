import { MyContext } from "./../types";
import { Resolver, Mutation, InputType, Field, Arg, Ctx } from "type-graphql";
import argon2 from "argon2";
import { User } from "./../entities";

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("data") data: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const { username, password } = data;
    const hashedPassword = await argon2.hash(password);

    const user = em.create(User, { username, password: hashedPassword });
    await em.persistAndFlush(user);

    return user;
  }
}
