import { IService } from '@interfaces/service.interface';

class IndexService implements IService {
  db = null;
  public async index(): Promise<any> {
    return {
      message: 'Hello World'
    };
  }
}

export default IndexService;
