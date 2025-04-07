import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    DeletedAt,
} from 'sequelize-typescript';

@Table
export class User extends Model<User> {
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

    @Column({
        allowNull: true,
        defaultValue: '',
    })
    login: string;

    @Column({
        allowNull: false,
    })
    password: string;

    isActive: boolean;

    @CreatedAt public createdAt: Date;

    @DeletedAt public deletedAt: Date;
}