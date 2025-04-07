import { IsString, IsOptional, IsDate, IsEnum, IsArray, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';

export enum PersonType {
  TEACHER = 'teacher',
  NURSE = 'nurse',
  STUDENT = 'student',
}

export class CreatePatientDto {
  @IsString()
  firstName: string;  // Ім'я

  @IsString()
  lastName: string;   // Прізвище

  @Transform(({ value }) => new Date(value))
  @IsDate()
  birthDate: Date;


  @IsString()
  gender: string;

  @IsString()
  address: string;

  @IsString()
  familyDoctor: string;

  @IsNumber()
  idUser: number;

  @IsEnum(PersonType)
  personType: PersonType;

  @IsString()
  institution: string;

  @IsString()
  phone: string;

  @IsString()
  pageNumber: string;  

  @IsOptional()
  @IsString()
  position?: string; 

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  myClasses?: string[];  // Мої класи (наприклад, ['2-a', '3-b'])

  @IsOptional()
  @IsString()
  studentClass?: string;

  @IsOptional()
  @IsString()
  classTeacher?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  parents?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  parentsPhone?: string[]; 
}
