import { Response } from 'express';
import httpStatus from 'http-status';
import { Get, HttpError, JsonController, Res } from 'routing-controllers';
import { Service } from 'typedi';

import IndexService from '@/index.service';
import { IController } from '@/interfaces/controller.interface';

@JsonController('')
@Service()
class IndexController implements IController {
  // prettier-ignore
  constructor(
    public readonly service: IndexService
  ) {}
  @Get('')
  public async index(@Res() res: Response) {
    try {
      const result = await this.service.index();
      return result;
    } catch (error) {
      const httpError = new HttpError(httpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
      return httpError;
    }
  }
}

export default IndexController;
