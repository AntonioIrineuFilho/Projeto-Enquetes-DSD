export default class InvalidJwtError extends Error {
  constructor() {
    super("Invalid Jwt");
  }
}
