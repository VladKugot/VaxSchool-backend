import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
    idUser?: number;
    firstName?: string;
    lastName?: string | undefined;
    classTeacher?: string | undefined;
    studentClass?: string | undefined;
    phone?: string | undefined;
    institution?: string | undefined;
    familyDoctor?: string | undefined;
}
