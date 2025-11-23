import express, { json, Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import URLS from "./urls";
import { EnqueteController, VoteController } from "./controllers";

const server = express();

server.use(json());

const authRestApiProxy = createProxyMiddleware({
  target: URLS.AUTH_REST_API,
  changeOrigin: true,
});

server.use("/auth", authRestApiProxy);

const enqueteRouter = Router();
enqueteRouter.post("/", EnqueteController.createEnquete);
enqueteRouter.delete("/:id", EnqueteController.deleteEnquete);
enqueteRouter.get("/:id", EnqueteController.detailEnquete);
enqueteRouter.put("/:id", EnqueteController.updateEnquete);

const voteRouter = Router();
voteRouter.get("/:id", VoteController.voteChoice);
voteRouter.get("/by-enquete/:id", VoteController.votesCount);

server.use("/enquetes", enqueteRouter);
server.use("/votes", voteRouter);

export default server;
