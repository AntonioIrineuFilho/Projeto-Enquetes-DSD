export default class InvalidPasswordError extends Error {
  constructor() {
    super("Password mismatch");
  }
}
