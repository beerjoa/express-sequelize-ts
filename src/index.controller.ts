import { NextFunction, Request, Response } from 'express';
import { Controller, Get, Route } from 'tsoa';

import IndexService from '@/index.service';
import { IController } from '@/interfaces/controller.interface';
import catchAsync from '@/utils/catch-async.util';

@Route('')
class IndexController extends Controller implements IController {
  constructor(public service: IndexService = new IndexService()) {
    super();
  }
  @Get('')
  public index = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.index();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });
}

export default IndexController;
