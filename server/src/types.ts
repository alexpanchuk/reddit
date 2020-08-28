import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";

/**
 * @todo
 * - add not null session definition to req object
 *   to getting rid of "!" in req.session!.userId
 *
 * - add userId definotion of type User.id to session
 */

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
};
