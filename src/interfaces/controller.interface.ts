import { IService } from '@/interfaces/service.interface';

/**
 * Controller interface
 * @export
 * @interface IController
 * @description
 * This interface is used to define the structure of the controller.
 * @property {IService} service - The service of the controller.
 */
export interface IController {
  service: IService;
}
