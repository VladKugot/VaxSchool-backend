import {
    IsOptional,
    IsString,
    Matches,
    MinLength,
  } from 'class-validator';

  export class CreateUserDto {

    @IsString({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
  
    @IsOptional()
    @Matches(/^(?!\s)[^\s]{3,}$/, {
      message: 'Login must contain at least 3 characters',
    })
    login: string;
  
    isActive: boolean;
  }