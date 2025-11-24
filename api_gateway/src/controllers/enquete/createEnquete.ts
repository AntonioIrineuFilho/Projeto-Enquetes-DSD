import getSoapClient from "@/lib/soap";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ICreateEnqueteDTO from "./dtos/ICreateEnqueteDTO";

export const createEnquete = async (req: Request, res: Response) => {
  const { title, description, end_date, choices } = req.body;

  const soapClient = await getSoapClient();

  const payload: ICreateEnqueteDTO = {
    enquete: {
      title,
      description,
      end_date,
      choices: {
        ChoiceInput: choices,
      },
    },
  };

  soapClient.EnqueteService.Application.createEnquete(
    payload,
    (err: any, result: any) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }

      return res.status(StatusCodes.CREATED).json(payload);
    }
  );
};
