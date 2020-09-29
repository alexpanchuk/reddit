import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "./../entities";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts() {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id") id: number //
  ) {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string //
  ) {
    return Post.create({ title }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ) {
    const post = await Post.findOne(id);

    if (!post) return null;
    if (typeof title !== "undefined") {
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
