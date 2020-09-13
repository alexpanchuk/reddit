import { MyContext } from "./types";
import { IS_PROD, COOKIE_NAME } from "./constants";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { buildSchema } from "type-graphql";
import { HelloResolver, PostResolver, UserResolver } from "./resolvers";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

async function main() {
  const app = express();

  // Setting up orm
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  // CORS
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // Use sessions with Redis
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        secure: IS_PROD,
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: "smthfunny",
      resave: false,
    })
  );

  // Apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res } as MyContext),
  });
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  // Start listening
  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });
}

if (!module.parent) {
  main().catch((e) => {
    console.error(e.message);
  });
}
