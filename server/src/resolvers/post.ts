import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Post } from "./../entities";
import { isAuth } from "./../middleware";
import { MyContext } from "./../types";

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("cursor", () => Date, { nullable: true }) cursor?: String
  ) {
    const realLimit = Math.max(0, Math.min(50, limit || 50));

    return Post.createQueryBuilder()
      .where(cursor ? '"createdAt" > :cursor' : "", { cursor })
      .orderBy('"createdAt"', "DESC")
      .take(realLimit)
      .getMany();
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id") id: number //
  ) {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  createPost(
    @Ctx() { req }: MyContext, //
    @Arg("data") data: PostInput
  ) {
    return Post.create({
      ...data,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title?: string
  ) {
    const post = await Post.findOne(id);

    if (!post) return null;
    if (title) {
      await Post.update({ id }, { title });
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number //
  ) {
    await Post.delete(id);
    return true;
  }
}
