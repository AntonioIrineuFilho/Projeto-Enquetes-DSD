export default class UsernameInUseError extends Error {
  constructor(username: string) {
    super(`Username in use: ${username}`);
  }
}
