const REST_HOST = process.env.NODE_ENV === "production" ? "rest" : "localhost";
const SOAP_HOST = process.env.NODE_ENV === "production" ? "soap" : "localhost";

const URLS = {
  AUTH_REST_API: `http://${REST_HOST}:3334`,
  ENQUETE_SOAP_API: `http://${SOAP_HOST}:3335`,
};

export default URLS;
