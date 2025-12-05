import "dotenv/config";
import server from "./server";

server.listen(3334, "0.0.0.0", () => {
  console.log("API Rest rodando na porta 3334");
});
