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
export class Hospital extends Model<Hospital> {
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
    name: string;

    @Column({
        allowNull: false,
    })
    address: string;

    @Column({
        allowNull: false,
    })
    timeTable: string;

    @Column({
        allowNull: false,
    })
    phoneNumber: string;

    @Column({
        allowNull: false,
    })
    coordinates_x: string;

    @Column({
        allowNull: false,
    })
    coordinates_y: string;

    @CreatedAt public createdAt: Date;

    @UpdatedAt public updatedAt: Date;

    @DeletedAt public deletedAt: Date;

}
