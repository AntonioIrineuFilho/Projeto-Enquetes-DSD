import getSoapClient from "@/lib/soap";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import IVoteChoiceDTO from "./dtos/IVoteChoiceDTO";

export const voteChoice = async (req: Request, res: Response) => {
  const { id } = req.params;

  const soapClient = await getSoapClient();

  const payload: IVoteChoiceDTO = {
    choice_id: id,
  };

  soapClient.EnqueteService.Application.voteChoice(
    payload,
    (err: any, result: any) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }

      return res.json(payload);
    }
  );
};
