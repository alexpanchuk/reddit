import { createConnection } from "typeorm";
import { Post, User } from "./entities";

export default {
  type: "postgres",
  database: "lireddit2",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [Post, User],
} as Parameters<typeof createConnection>[0];
