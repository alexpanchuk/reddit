import { IS_PROD } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { Post, User } from "./entities";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "lireddit",
  type: "postgresql",
  debug: !IS_PROD,
} as Parameters<typeof MikroORM.init>[0];
