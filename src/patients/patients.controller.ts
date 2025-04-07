import { Controller, Get, Param, Post, Body, Put, Delete, Query, NotFoundException, BadRequestException, Patch, Res } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';

@Controller('patients')
export class PatientsController {
  private readonly secretKey: string = process.env.JWT_SECRET || 'ca6484ke';
  constructor(private readonly patientsService: PatientsService) { }

  @Get()
  async findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Post()
  public async create(@Body() createPatient: CreatePatientDto) {
    return await this.patientsService.create(createPatient);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<Partial<Patient> | Partial<Patient>[]> {

    const patientId = Number(id);
    if (isNaN(patientId)) {
      throw new BadRequestException(`Invalid patient ID: ${id}`);
    }

    const patient = await this.patientsService.findOne(patientId);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  @Get('page-number/:pageNumber')
async findOnePageNumber(@Param('pageNumber') pageNumber: string): Promise<Patient | null> {
  const page = Number(pageNumber);
  if (isNaN(page)) {
    throw new BadRequestException(`Invalid patient pageNumber: ${pageNumber}`);
  }

  const patient = await this.patientsService.findOneByPageNumber(page);
  if (!patient) {
    throw new NotFoundException(`Patient with pageNumber ${pageNumber} not found`);
  }

  return patient;
}

  @Get('user/:userId')
  async findUserByUserId(
    @Param('userId') userId: string,
  ): Promise<{ userId: number; personType: string, pageNumber: string }> {
    const userIdentifier = Number(userId);
    if (isNaN(userIdentifier)) {
      throw new BadRequestException(`Invalid user ID: ${userId}`);
    }
  
    const patient = await this.patientsService.findByUserId(userIdentifier);
    if (!patient) {
      throw new NotFoundException(`Patient with user ID ${userId} not found`);
    }
  
    return { userId: patient.id, personType: patient.personType, pageNumber: patient.pageNumber || '' };
  }

  @Get('year/:userId')
  async findYearBirth(
    @Param('userId') userId: string,
  ): Promise<{ year: number; pageNumber: number }> {
    const userIdNumber = Number(userId);
    if (isNaN(userIdNumber)) {
      throw new BadRequestException(`Invalid user ID: ${userId}`);
    }
  
    const patient = await this.patientsService.findOne(userIdNumber);
    if (!patient) {
      throw new NotFoundException(`Patient with user ID ${userId} not found`);
    }
  
    const birthDate = new Date(patient.birthDate);
    return {
      year: birthDate.getFullYear(),
      pageNumber: patient.pageNumber ? Number(patient.pageNumber) : 0,
    };
  }

  @Get('generate-token/:id')
  async getToken(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const secretKey = process.env.JWT_SECRET || 'ca6484ke';
      const token = jwt.sign({ id }, secretKey, { expiresIn: '3m' });

      return res.json({ token });
    } catch (error) {
      console.error('Error generating token:', error);
      return res.status(500).json({ message: 'Error generating token' });
    }
  }

  @Get('verify-token/:token')
verifyToken(@Param('token') token: string, @Res() res: Response) {
  try {
    const secretKey = process.env.JWT_SECRET || 'ca6484ke';

    const decoded: any = jwt.verify(token, secretKey);
    return res.json({ id: decoded.id });

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      try {
        const decoded: any = jwt.decode(token);
        const newToken = jwt.sign({ id: decoded.id }, this.secretKey, { expiresIn: '5m' });

        return res.json({ id: decoded.id, token: newToken });
      } catch (decodeError) {
        console.error('Error decoding expired token:', decodeError);
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.patientsService.remove(id);
  }

  @Get('/school/:schoolName/class/:className/student')
  async findBySchoolAndClass(
    @Param('schoolName') school: string,
    @Param('className') classNumber: string

  ) { return await this.patientsService.findBySchoolAndClass(school, classNumber); }

  @Get('/school/:schoolName/teacher')
  async findTeacherBySchool(@Param('schoolName') school: string) { return await this.patientsService.findTeacherBySchool(school); }

  @Get('/school/:schoolName/class')
  async findClassBySchool(@Param('schoolName') school: string) { return await this.patientsService.findClassBySchool(school); }

  @Get('teachers/:schoolName')
  async getTeachersBySchool(
    @Param('schoolName') institution: string,
    @Query('lastName') lastName?: string,
    @Query('position') position?: string
  ): Promise<Patient[]> {
    return this.patientsService.findTeachersBySchool(institution, lastName, position);
  }
}
