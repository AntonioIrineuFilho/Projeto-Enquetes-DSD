import URLS from "@/urls";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const validateAuthHeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).send();
  }

  const [_, token] = authorization.split("Bearer ");

  const validateRes = await axios.get(`${URLS.AUTH_REST_API}/validate-token`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (validateRes.status !== StatusCodes.OK) {
    return res.status(StatusCodes.UNAUTHORIZED).send();
  }

  const newTokens = validateRes.data;
  res.locals.tokens = newTokens;

  return next();
};

export default validateAuthHeader;
