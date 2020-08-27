import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";

async function main() {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  // const post = orm.em.create(Post, { title: "My first post" });
  // await orm.em.persistAndFlush(post);
  // const posts = await orm.em.find(Post, {});
}

if (!module.parent) {
  main().catch((e) => {
    console.error(e.message);
  });
}
