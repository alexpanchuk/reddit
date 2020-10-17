import faker from "faker";
import { Post } from "../entities";
import { getRandomInt } from "../utils";

export const createPosts = (amount: number): Promise<Post>[] =>
  Array.from(new Array(amount)).map(() =>
    Post.create({
      title: faker.lorem.sentence(),
      text: faker.lorem.paragraphs(getRandomInt(2, 5)),
      creatorId: 4,
    }).save()
  );
