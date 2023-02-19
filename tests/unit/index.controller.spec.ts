import IndexController from '@/index.controller';
import IndexService from '@/index.service';

describe('IndexController', () => {
  let controller: IndexController;
  let service: jest.Mocked<IndexService>;

  beforeEach(async () => {
    service = new IndexService() as jest.Mocked<IndexService>;
    controller = new IndexController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
