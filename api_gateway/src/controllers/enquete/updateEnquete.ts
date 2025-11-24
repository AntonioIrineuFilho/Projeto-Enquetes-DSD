import getSoapClient from "@/lib/soap";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import IUpdateEnqueteDTO from "./dtos/IUpdateEnqueteDTO";

export const updateEnquete = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, end_date } = req.body;

  const soapClient = await getSoapClient();

  const payload: IUpdateEnqueteDTO = {
    enquete_id: id,
    enquete: {
      title,
      description,
      end_date,
    },
  };

  soapClient.EnqueteService.Application.updateEnquete(
    payload,
    (err: any, result: any) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }

      return res.json(payload);
    }
  );
};
