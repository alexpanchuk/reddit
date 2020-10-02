import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = (data, next) => {
  if (!data.context.req.session.userId) {
    throw new Error("Not authenticated");
  }

  return next();
};
