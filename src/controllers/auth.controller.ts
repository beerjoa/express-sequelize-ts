import { Request, Response } from 'express';

import { UserDto } from '@/dtos/user.dto';
import { IController } from '@/interfaces/controller.interface';
import AuthService from '@/services/auth.service';
import catchAsync from '@/utils/catch-async.util';

class AuthController implements IController {
  constructor(public readonly service: AuthService = new AuthService()) {}
  public readonly signIn = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userData: UserDto = req.body;

      const result = await this.service.signIn(userData);
      res.status(200).json(result);
    }
  );
}

export default AuthController;
