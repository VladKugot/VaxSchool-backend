import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
  } from 'sequelize-typescript';
  
  @Table
  export class Vaccine extends Model<Vaccine> {
    @Column({
      type: DataType.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    })
    public id: number;
  
    @Column({
      allowNull: false,
    })
    type: string;
  
    @Column({
      allowNull: false,
    })
    name: string;
  
    @Column({
      allowNull: false,
    })
    description: string;
  
    @CreatedAt public createdAt: Date;
  
    @UpdatedAt public updatedAt: Date;
  
    @DeletedAt public deletedAt: Date;
  }
  