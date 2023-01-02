import { Router } from 'express';

import AuthController from '@/controllers/auth.controller';
import CreateUserDto from '@/dtos/create-user.dto';
import SignInUserDto from '@/dtos/sign-in-user.dto';
import { IRoute } from '@/interfaces/route.interface';
import auth from '@/middlewares/auth.middleware';
import validateSchemas from '@/middlewares/validate.middleware';

class AuthRoute implements IRoute {
  public path = '/auth';
  public router = Router();
  public controller = new AuthController();

  constructor() {
    this.initRoutes();
  }

  // prettier-ignore
  initRoutes(): void {
    this.router
      .route(`${this.path}/sign-up`)
      .post(
        validateSchemas({ body: CreateUserDto }),
        this.controller.signUp
      );

    this.router
      .route(`${this.path}/sign-in`)
      .post(
        validateSchemas({ body: SignInUserDto }),
        auth('local'),
        this.controller.signIn
      );

    this.router
      .route(`${this.path}/sign-out`)
      .get(
        auth('jwt'),
        this.controller.signOut
      );
  }
}

export default AuthRoute;
