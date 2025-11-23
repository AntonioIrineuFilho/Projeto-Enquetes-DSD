import "dotenv/config";
import server from "./server";

server.listen("3334", () => {
  console.log("API Rest rodando na porta 3334");
});
