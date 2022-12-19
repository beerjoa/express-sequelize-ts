import { Router } from 'express';

import IndexController from '@/controllers/index.controller';
import { IRoute } from '@/interfaces/route.interface';

class IndexRoute implements IRoute {
  public path = '/';
  public router = Router();
  public controller = new IndexController();

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get(`${this.path}`, this.controller.index);
  }
}

export default IndexRoute;
