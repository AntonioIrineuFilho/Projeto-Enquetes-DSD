import express from "express";
import cors from "cors";
import {
  LoginController,
  RegisterController,
  ValidateTokenController,
} from "./controllers";

const server = express();
server.use(express.json());
server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

server.post(
  "/register",
  RegisterController.validate,
  RegisterController.handle
);

server.post("/login", LoginController.validate, LoginController.handle);

server.get("/validate-token", ValidateTokenController.handle);

export default server;
