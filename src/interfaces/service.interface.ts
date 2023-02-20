import { Model, Repository } from 'sequelize-typescript';
export interface IService {
  repository: Repository<Model>;
}
