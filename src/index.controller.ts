import { Response } from 'express';
import httpStatus from 'http-status';
import { Get, HttpError, JsonController, Res } from 'routing-controllers';
import { Service } from 'typedi';

import IndexService from '@/index.service';
import { IController } from '@/interfaces/controller.interface';
import { OpenAPI } from 'routing-controllers-openapi';

/**
 * Index Controller
 * @class
 * @implements {IController}
 */
@OpenAPI({
  summary: 'Index',
  description: 'Index Controller'
})
@JsonController('')
@Service()
class IndexController implements IController {
  // prettier-ignore
  constructor(
    public readonly service: IndexService
  ) {}
  @Get('')
  @OpenAPI({
    summary: 'Index',
    description: 'return Hello World'
  })
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
