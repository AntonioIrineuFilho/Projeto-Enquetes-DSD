import getSoapClient from "@/lib/soap";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import IVotesCountDTO from "./dtos/IVotesCountTO";

export const votesCount = async (req: Request, res: Response) => {
  const { id } = req.params;

  const soapClient = await getSoapClient();

  const payload: IVotesCountDTO = {
    enquete_id: id,
  };

  soapClient.EnqueteService.Application.votesCount(
    payload,
    (err: any, result: any) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }

      return res.json(result);
    }
  );
};
