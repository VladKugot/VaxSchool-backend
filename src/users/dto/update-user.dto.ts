import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {IsOptional, IsString, IsBoolean, Matches, MinLength} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).*$/, {
        message:
            'Password must contain a letter, a number, and a special character',
    })
    password: string;

    @IsOptional()
    @IsString()
    @Matches(/^(?!\s)[^\s]{3,}$/, {
        message: 'Login must contain at least 3 characters',
    })
    login: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}