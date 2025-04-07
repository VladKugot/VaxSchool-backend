import { IsNotEmpty, IsString, IsDate, IsOptional, IsNumber } from 'class-validator';

export class CreateRecordDto {
    @IsNotEmpty()
    @IsNumber()
    patientId: number;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNotEmpty()
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsString()
    vaccinationName: string;

    @IsNotEmpty()
    @IsString()
    vaccineName: string;

    @IsNotEmpty()
    @IsString()
    manufacturer: string;

    @IsNotEmpty()
    @IsString()
    batchNumber: string;

    @IsNotEmpty()
    @IsDate()
    expirationDate: Date;

    @IsNotEmpty()
    @IsString()
    injectionSite: string;

    @IsNotEmpty()
    @IsString()
    medicalFacility: string;

    @IsNotEmpty()
    @IsString()
    doctor: string;

    @IsNotEmpty()
    @IsString()
    certificateNumber: string;

    @IsOptional()
    @IsString()
    sideEffects?: string;
}
