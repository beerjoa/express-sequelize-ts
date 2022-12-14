import { IController } from '@interfaces/controller.interface';
import { Router } from 'express';
export interface IRoute {
  path: string;
  router: Router;
  controller: IController;
  initRoutes(): void;
}
