import getSoapClient from "@/lib/soap";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import IDetailEnqueteDTO from "./dtos/IDetailEnqueteDTO";

export const detailEnquete = async (req: Request, res: Response) => {
  const { id } = req.params;

  const soapClient = await getSoapClient();

  const payload: IDetailEnqueteDTO = {
    enquete_id: id,
  };

  soapClient.EnqueteService.Application.detailEnquete(
    payload,
    (err: any, result: any) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }

      return res.json(result);
    }
  );
};
