export default class UserNotFoundError extends Error {
  constructor(argument: string, value: string) {
    super(`User not found with ${argument}: ${value}`);
  }
}
