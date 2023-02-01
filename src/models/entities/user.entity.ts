import { AllowNull, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  tableName: 'users'
})
export class User extends Model<User> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  public id!: number;

  @AllowNull(false)
  @Column
  public name!: string;

  @AllowNull(false)
  @Column
  public email!: string;

  @AllowNull(false)
  @Column
  public password!: string;
}
