import { Router } from 'express';

import IndexController from '@/controllers/index.controller';
import { IRoute } from '@/interfaces/route.interface';
import AuthRoute from '@/routes/auth.route';
class IndexRoute implements IRoute {
  public path = '/';
  public router = Router();
  public controller = new IndexController();

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get(`${this.path}`, this.controller.index);

    this.router.use(new AuthRoute().router);
  }
}

export default IndexRoute;
