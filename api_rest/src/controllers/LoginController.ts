import InvalidPasswordError from "@/errors/InvalidPasswordError";
import UserNotFoundError from "@/errors/UserNotFoundError";
import { validation } from "@/middlewares/validation";
import authService from "@/services/AuthService";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";

const reqBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

type TReqBody = z.infer<typeof reqBodySchema>;

export const validate = validation("body", reqBodySchema);

export const handle = async (
  req: Request<any, any, TReqBody>,
  res: Response
) => {
  try {
    const { username, password } = req.body;

    const tokens = await authService.login(username, password);

    return res.status(200).json(tokens);
  } catch (err) {
    if (
      err instanceof UserNotFoundError ||
      err instanceof InvalidPasswordError
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Credenciais inválidas" });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};