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

    // console.log(username, password);
    const dto = await authService.register(username, password);

    return res.json(dto).status(StatusCodes.CREATED);
  } catch (err) {
    if (err instanceof UsernameInUseError) {
      return res.json({ Error: err.message }).status(StatusCodes.BAD_REQUEST);
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
