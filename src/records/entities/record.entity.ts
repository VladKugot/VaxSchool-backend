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
export class Record extends Model<Record> {
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    })
    public id: number;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
    })
    public patientId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public status: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    public date: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public vaccinationName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public vaccineName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public manufacturer: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public batchNumber: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    public expirationDate: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public injectionSite: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public medicalFacility: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public doctor: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    public certificateNumber: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    public sideEffects: string;

    @CreatedAt
    public createdAt: Date;

    @UpdatedAt
    public updatedAt: Date;

    @DeletedAt
    public deletedAt: Date;
}
