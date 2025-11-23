import URLS from "@/urls";
import { Client, createClient, createClientAsync } from "soap";

let clientPromise: Promise<Client> | null = null;

export async function getSoapClient(): Promise<Client> {
  if (!clientPromise) {
    clientPromise = createClientAsync(`${URLS.ENQUETE_SOAP_API}/?wsdl`).then(
      (client) => client
    );
    console.log("Gateway conectado à API SOAP");
  }
  return clientPromise;
}

export default getSoapClient;
