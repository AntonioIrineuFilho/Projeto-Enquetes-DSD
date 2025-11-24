import jwtService from "@/services/JwtService";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const handle = async (req: Request, res: Response) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).send();
  }

  const payload = await jwtService.validateToken(token);

  if (!payload) {
    return res.status(StatusCodes.UNAUTHORIZED).send();
  }

  const newTokens = await jwtService.generateTokens();

  return res.json(newTokens);
};
