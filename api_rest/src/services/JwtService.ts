import InvalidJwtError from "@/errors/InvalidJwtError";
import ITokens from "@/interfaces/ITokens";
import { JWTPayload, jwtVerify, SignJWT } from "jose";

class JwtService {
  private ALG = "HS256";
  private KEY: Uint8Array = new TextEncoder().encode(process.env.SECRET_KEY!);

  async generateTokens(): Promise<ITokens> {
    const token = await new SignJWT()
      .setProtectedHeader({ alg: this.ALG, typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("1day")
      .sign(this.KEY);

    const refreshToken = await new SignJWT()
      .setProtectedHeader({ alg: this.ALG, typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("7days")
      .sign(this.KEY);

    return { token, refreshToken };
  }

  async validateToken(jwt: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(jwt, this.KEY);

    if (!payload) {
      throw new InvalidJwtError();
    }

    return payload;
  }
}

const jwtService = new JwtService();

export default jwtService;
