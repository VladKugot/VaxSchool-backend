import { Model, Column, CreatedAt, DataType, DeletedAt, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class VaccineList extends Model<VaccineList> {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @Column({
    allowNull: true,
    defaultValue: '',
  })
  vaccineName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  periodValue: number;

  @Column({
    allowNull: false,
    defaultValue: '',
  })
  periodUnit: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  frequency: number;

  @Column({
    defaultValue: true,
  })
  need: boolean;

  @CreatedAt public createdAt: Date;
  
  @UpdatedAt public updatedAt: Date;

  @DeletedAt public deletedAt: Date;
}
