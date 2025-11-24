import { getSoapClient } from "./lib/soap";
import server from "./server";

server.listen("3333", async () => {
  console.log("API Gateway escutando na porta 3333");
  const soapClient = await getSoapClient();
});
