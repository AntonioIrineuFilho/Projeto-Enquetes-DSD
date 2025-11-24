import express, { json, Router } from "express";
import URLS from "./urls";
import { EnqueteController, VoteController } from "./controllers";
import validateAuthHeader from "./middlewares/validateAuthHeader";
import proxy from "express-http-proxy";
import cors from "cors";

const server = express();

server.use(json());
server.use(cors());

const authRestApiProxy = proxy(URLS.AUTH_REST_API);

server.use("/auth", authRestApiProxy);

const enqueteRouter = Router();
enqueteRouter.post("/", validateAuthHeader, EnqueteController.createEnquete);
enqueteRouter.delete(
  "/:id",
  validateAuthHeader,
  EnqueteController.deleteEnquete
);
enqueteRouter.get("/:id", validateAuthHeader, EnqueteController.detailEnquete);
enqueteRouter.put("/:id", validateAuthHeader, EnqueteController.updateEnquete);

const voteRouter = Router();
voteRouter.get("/:id", validateAuthHeader, VoteController.voteChoice);
voteRouter.get(
  "/by-enquete/:id",
  validateAuthHeader,
  VoteController.votesCount
);

server.use("/enquetes", enqueteRouter);
server.use("/votes", voteRouter);

export default server;
