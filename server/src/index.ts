import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { buildSchema } from "type-graphql";
import { HelloResolver, PostResolver } from "./resolvers";

async function main() {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });
}

if (!module.parent) {
  main().catch((e) => {
    console.error(e.message);
  });
}
