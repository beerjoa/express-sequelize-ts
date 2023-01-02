import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';

import ApiError from '@/utils/api-error.util';
import { http } from '@/utils/handler.util';

type TValidateSchemaKey = 'body' | 'param' | 'query';
type TValidateSchema = {
  [K in TValidateSchemaKey]: any | undefined;
};

const validateSchemasFn = (req: Request, schemas: Partial<TValidateSchema>): Promise<ApiError | void> => {
  return new Promise<ApiError | void>(async (resolve, reject) => {
    const schemaKeys = Object.keys(schemas) as TValidateSchemaKey[];
    for await (const key of schemaKeys) {
      if (!key) return;
      const schema = schemas[key];
      const convertedData = plainToInstance(schema, req[key]);

      validate(convertedData).then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const apiError = new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errors.toString());
          reject(apiError);
        }
      });
    }
    resolve();
  });
};

const validateSchemas =
  (schemas: Partial<TValidateSchema>): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    await validateSchemasFn(req, schemas)
      .then(() => {
        next();
      })
      .catch((err) => {
        next(http.sendErrorResponse(res, err.statusCode, err));
      });
  };

export default validateSchemas;
