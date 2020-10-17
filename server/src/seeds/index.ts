import { createConnection } from "typeorm";
import typeormConfig from "../typeorm.config";
import { Post } from "./../entities";
import { createPosts } from "./post";

async function initSeeds() {
  const connection = await createConnection(typeormConfig);

  try {
    await Post.delete({});
    await Promise.all(createPosts(50));

    console.log("Seeds have been created");
  } catch (error) {
    console.log(error);
  } finally {
    await connection.close();
  }
}

if (!module.parent) {
  initSeeds();
}

export { initSeeds };
