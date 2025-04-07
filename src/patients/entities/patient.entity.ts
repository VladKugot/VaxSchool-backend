import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'patients' })

export class Patient extends Model<Patient> {
  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @Column({ type: DataType.DATE, allowNull: false })
  birthDate: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  gender: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @Column({ type: DataType.STRING, allowNull: true })
  familyDoctor?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  idUser: number;

  @Column({ type: DataType.ENUM('teacher', 'nurse', 'student'), allowNull: false })
  personType: 'teacher' | 'nurse' | 'student';

  @Column({ type: DataType.STRING, allowNull: false })
  institution: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: true })
  pageNumber?: string;

  // Поля для вчителя
  @Column({ type: DataType.STRING, allowNull: true })
  position?: string;

  @Column({ type: DataType.JSON, allowNull: true })
  myClasses?: string[];  // ['2-a', '3-b']

  // Поля для учнів
  @Column({ type: DataType.STRING, allowNull: true })
  studentClass?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  classTeacher?: string;

  @Column({ type: DataType.JSON, allowNull: true })
  parents?: string[];

  @Column({ type: DataType.JSON, allowNull: true })
  parentsPhone?: string[];
}
