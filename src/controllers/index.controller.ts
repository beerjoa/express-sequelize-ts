import { NextFunction, Request, Response } from 'express';

import { IController } from '@/interfaces/controller.interface';
import IndexService from '@/services/index.service';
import catchAsync from '@/utils/catch-async.util';

class IndexController implements IController {
  constructor(public service: IndexService = new IndexService()) {}
  public index = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await this.service.index();
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }
  );
}

export default IndexController;
