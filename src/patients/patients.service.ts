import { BadRequestException, Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { Patient } from './entities/patient.entity';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PATIENT_REPOSITORY } from '@/utils/constants';
import { Op, Sequelize } from 'sequelize';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: typeof Patient,
  ) { }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const { firstName, lastName, birthDate, gender, address, familyDoctor, idUser,
      personType, institution, phone, pageNumber, position, myClasses, studentClass, classTeacher, parents, parentsPhone }
      = createPatientDto;

    const user = await this.patientRepository.create({
      firstName, lastName, birthDate, gender, address, familyDoctor, idUser,
      personType, institution, phone, pageNumber, position, myClasses, studentClass, classTeacher, parents, parentsPhone
    } as unknown as Patient);

    return user;
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientRepository.findAll();
  }

  async findOne(id: number): Promise<Patient | null> {
    const patientId = Number(id);
    if (isNaN(patientId)) {
      throw new BadRequestException('Invalid patient ID');
    }

    return await this.patientRepository.findByPk(patientId);
  }

  async findOneByPageNumber(pageNumber: number): Promise<Patient | null> {
    return this.patientRepository.findOne({ where: { pageNumber } });
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return await patient.update(updatePatientDto);
  }

  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    await patient.destroy();
  }

  async findBySchoolAndClass(institution: string, className: string): Promise<Partial<Patient>[]> {
    if (className === 'all') {
      const patients = await this.patientRepository.findAll({
        where: {
          institution: { [Op.like]: `%${institution}%` },
          [Op.or]: [{ personType: 'student' }],
        },
        attributes: ['id', 'firstName', 'lastName', 'birthDate', 'studentClass', 'pageNumber'],
        raw: true,
      });

      return patients;
    }

    const patients = await this.patientRepository.findAll({
      where: {
        institution: { [Op.like]: `%${institution}%` },
        studentClass: { [Op.like]: `%${className}%` },
        [Op.or]: [{ personType: 'student' }],
      },
      attributes: ['id', 'firstName', 'lastName', 'birthDate', 'studentClass', 'pageNumber'],
      raw: true,
    });

    return patients;
  }

 
  async findTeacherBySchool(institution: string): Promise<Patient[]> {
    const teachers = await this.patientRepository.findAll({
      where: {
        institution: { [Op.like]: `%${institution}%` },
        [Op.or]: [{ personType: 'teacher' }, { personType: 'nurse' }],
      },
      attributes: ['id', 'firstName', 'lastName', 'position', 'birthDate', 'pageNumber'],
      raw: true,
    });
    return teachers;
  }

  async findByUserId(idUser: number): Promise<Patient | null> {
    return this.patientRepository.findOne({ where: { idUser } });
  }

  async findClassBySchool(school: string): Promise<string[]> {
    const classes = await this.patientRepository.findAll({
      where: {
        institution: { [Op.like]: `%${school}%` },
        [Op.or]: [{ personType: 'student' }],
      },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('studentClass')), 'studentClass']],
      raw: true,
    });

    return classes.map((c) => c.studentClass).filter((studentClass): studentClass is string => studentClass !== undefined);
  }

  async findTeachersBySchool(
    institution: string,
    lastName?: string,
    position?: string
  ): Promise<Patient[]> {
    const whereCondition: any = {
      institution: { [Op.like]: `%${institution}%` },
      personType: { [Op.in]: ['teacher', 'nurse'] },
    };

    if (lastName) {
      whereCondition.lastName = { [Op.like]: `%${lastName}%` };
    }

    if (position) {
      whereCondition.position = { [Op.like]: `%${position}%` };
    }

    return await this.patientRepository.findAll({
      where: whereCondition,
      attributes: ['id', 'firstName', 'lastName', 'position', 'birthDate', 'pageNumber'],
      raw: true,
    });
  }
}
