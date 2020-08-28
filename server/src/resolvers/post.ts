import { MyContext } from "./../types";
import { Post } from "./../entities";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { em }: MyContext) {
    const posts = await em.find(Post, {});
    return posts;
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id") id: number, //
    @Ctx() { em }: MyContext
  ) {
    return await em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string, //
    @Ctx() { em }: MyContext
  ) {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ) {
    const post = await em.findOne(Post, { id });

    if (!post) return null;
    if (typeof title !== "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number, //
    @Ctx() { em }: MyContext
  ) {
    await em.nativeDelete(Post, { id });
    return true;
  }
}
