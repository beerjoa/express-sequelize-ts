import { Router } from 'express';

import { IController } from '@/interfaces/controller.interface';

export interface IRoute {
  path: string;
  router: Router;
  controller: IController;
  initRoutes(): void;
}
