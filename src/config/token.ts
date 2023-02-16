import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

import config from '@/config';
import UserTokenKeyDto from '@/users/dtos/user-token-key.dto';

export type TResultToken = {
  accessToken: string;
  refreshToken: string;
};

class TokenGenerator {
  constructor(
    private readonly accessTokenSecretKey: string = config.JWT_ACCESS_TOKEN_SECRET,
    private readonly refreshTokenSecretKey: string = config.JWT_REFRESH_TOKEN_SECRET,
    private option: SignOptions | VerifyOptions = {
      algorithm: 'HS256',
      expiresIn: config.JWT_EXPIRATION
    }
  ) {}

  public readonly sign = (user: UserTokenKeyDto, signOptions?: Partial<SignOptions>): TResultToken => {
    const jwtSignOptions = Object.assign({}, signOptions, this.option);

    const accessToken = jwt.sign({ user }, this.accessTokenSecretKey, jwtSignOptions);
    const refreshToken = jwt.sign({ user }, this.refreshTokenSecretKey, {
      ...jwtSignOptions,
      expiresIn: config.JWT_EXPIRATION * 24
    });

    return { accessToken, refreshToken };
  };

  public readonly refresh = (refreshToken: string, refreshOptions?: Partial<SignOptions>): TResultToken => {
    const verifiedUser = jwt.verify(refreshToken, this.refreshTokenSecretKey, this.option) as JwtPayload;

    delete verifiedUser.iat;
    delete verifiedUser.exp;
    delete verifiedUser.nbf;
    delete verifiedUser.jti;

    const jwtRefreshOptions = Object.assign({}, this.option, refreshOptions);
    const accessToken = jwt.sign(verifiedUser, this.accessTokenSecretKey, jwtRefreshOptions);
    return { accessToken, refreshToken };
  };

  public readonly verify = (type: string, token: string): JwtPayload => {
    if (type === 'refresh') {
      return jwt.verify(token, this.refreshTokenSecretKey, this.option) as JwtPayload;
    } else {
      return jwt.verify(token, this.accessTokenSecretKey, this.option) as JwtPayload;
    }
  };
}

export const tokenHandler = new TokenGenerator();
