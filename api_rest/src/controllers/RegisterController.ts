import UsernameInUseError from "@/errors/UsernameInUseError";
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
): Promise<Response> => {
  try {
    const { username, password } = req.body;

    const dto = await authService.register(username, password);

    return res.status(StatusCodes.CREATED).json(dto);
  } catch (err) {
    if (err instanceof UsernameInUseError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ Error: err.message });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};
