import { Response } from 'express';
import httpStatus from 'http-status';
import { Get, JsonController, Res } from 'routing-controllers';

import IndexService from '@/index.service';
import { IController } from '@/interfaces/controller.interface';
import ApiError from '@/utils/api-error.util';
import { http } from '@/utils/handler.util';

@JsonController('')
class IndexController implements IController {
  // prettier-ignore
  constructor(
    public service: IndexService = new IndexService()
  ) {}
  @Get('')
  public async index(@Res() res: Response) {
    try {
      const result = await this.service.index();
      return http.sendJsonResponse(res, httpStatus.OK, result);
    } catch (error) {
      const apiError = new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
      return http.sendErrorResponse(res, apiError.statusCode, apiError);
    }
  }
}

export default IndexController;
