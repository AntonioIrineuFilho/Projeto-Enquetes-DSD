import { RequestHandler } from "express";
import { ZodObject } from "zod";
import { $ZodIssue } from "@zod/core";

type TAllowedFields = "body" | "query" | "header" | "params";
type TValidation = (field: TAllowedFields, schema: ZodObject) => RequestHandler;

export const validation: TValidation = (field, schema) => (req, res, next) => {
  let errors: $ZodIssue[] = [];

  // Object.entries(schema).forEach((obj) => {
  //   console.log(obj);
  // });

  next();
};
