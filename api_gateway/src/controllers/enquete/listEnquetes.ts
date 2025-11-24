import getSoapClient from "@/lib/soap";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import IListEnquetesDTO from "./dtos/IListEnquetesDTO";

export const listEnquete = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  const soapClient = await getSoapClient();

  const payload: IListEnquetesDTO = {
    page: Number(page),
    limit: Number(limit),
  };

  soapClient.EnqueteService.Application.listEnquetes(
    payload,
    (err: any, result: any) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }

      return res.json(result);
    }
  );
};
