import getSoapClient from "@/lib/soap";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import IDeleteEnqueteDTO from "./dtos/IDeleteEnqueteDTO";

export const deleteEnquete = async (req: Request, res: Response) => {
  const { id } = req.params;

  const soapClient = await getSoapClient();

  const payload: IDeleteEnqueteDTO = {
    enquete_id: id,
  };

  soapClient.EnqueteService.Application.deleteEnquete(
    payload,
    (err: any, result: any) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }

      return res.status(StatusCodes.NO_CONTENT).send();
    }
  );
};
