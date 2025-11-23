import jwtService from "@/services/JwtService";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const handle = async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(StatusCodes.BAD_REQUEST).send();
  }

  const [_, token] = authorization.split("Bearer ");

  const payload = await jwtService.validateToken(token);

  if (!payload) {
    return res.status(StatusCodes.UNAUTHORIZED).send();
  }

  const newTokens = await jwtService.generateTokens();

  return res.json(newTokens);
};
