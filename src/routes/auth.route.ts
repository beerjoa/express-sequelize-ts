import auth from '@/middlewares/auth.middleware';
import { Router } from 'express';

import AuthController from '@/controllers/auth.controller';
import SignInUserDto from '@/dtos/sign-in-user.dto';
import { IRoute } from '@/interfaces/route.interface';
import validateSchemas from '@/middlewares/validate.middleware';

class AuthRoute implements IRoute {
  public path = '/auth';
  public router = Router();
  public controller = new AuthController();

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {
    this.router
      .route(`${this.path}/sign-in`)
      .post(
        validateSchemas({ body: SignInUserDto }),
        auth('local'),
        this.controller.signIn
      );
  }
}

export default AuthRoute;
