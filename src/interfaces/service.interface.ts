import { Model, Repository } from 'sequelize-typescript';
/**
 * Service interface
 * @export
 * @interface IService
 * @description
 * This interface is used to define the structure of the service.
 * @property {Repository<Model>} repository - The repository of the service.
 * @property {Model} model - sequelize-typescript entity model.
 */
export interface IService {
  repository: Repository<Model>;
}
