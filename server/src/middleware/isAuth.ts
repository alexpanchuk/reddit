import { MiddlewareFn } from "type-graphql";
import { MyContext } from "src/types";

export const isAuth: MiddlewareFn<MyContext> = (data, next) => {
  if (!data.context.req.session.userId) {
    throw new Error("Not authenticated");
  }

  return next();
};
