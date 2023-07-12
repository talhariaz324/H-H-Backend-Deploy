import { Request, Response } from 'express';
const notFoundMiddleware = (_: Request, res: Response) =>
  res.send("Route doesn't exist ");

export default notFoundMiddleware;
