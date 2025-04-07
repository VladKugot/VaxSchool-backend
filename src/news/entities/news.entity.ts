import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    DeletedAt,
} from 'sequelize-typescript';

@Table
export class News extends Model<News> {
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    })
    public id: number;

    @Column({
        allowNull: true,
    })
    title: string;

    @Column({
        allowNull: false,
    })
    description : string;

    @Column({
        allowNull: false,
    })
    type : string;

    @CreatedAt public createdAt: Date;

    @DeletedAt public deletedAt: Date;
}