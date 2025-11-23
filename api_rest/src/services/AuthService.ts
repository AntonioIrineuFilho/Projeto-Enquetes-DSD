import InvalidPasswordError from "@/errors/InvalidPasswordError";
import UsernameInUseError from "@/errors/UsernameInUseError";
import UserNotFoundError from "@/errors/UserNotFoundError";
import IUserCreateDTO from "@/interfaces/dtos/IUserCreateDTO";
import ITokens from "@/interfaces/ITokens";
import prisma from "@/lib/prisma";
import { compare, hash } from "bcrypt";
import jwtService from "./JwtService";

class AuthService {
  async register(username: string, password: string): Promise<IUserCreateDTO> {
    const userByUsername = await prisma.usuario.findUnique({
      where: {
        usuario: username,
      },
    });

    if (userByUsername) {
      throw new UsernameInUseError(username);
    }

    const hashedPassword = await hash(password, 8);

    await prisma.usuario.create({
      data: {
        usuario: username.toString(),
        senha: hashedPassword.toString(),
      },
    });

    return { username };
  }

  async login(username: string, password: string): Promise<ITokens> {
    const user = await prisma.usuario.findUnique({
      where: {
        usuario: username,
      },
    });

    if (!user) {
      throw new UserNotFoundError("username", username);
    }

    const isPasswordValid = await compare(password, user.senha);

    if (!isPasswordValid) {
      throw new InvalidPasswordError();
    }

    const tokens = await jwtService.generateTokens();
    return tokens;
  }
}

const authService = new AuthService();
export default authService;
