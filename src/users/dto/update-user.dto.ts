import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    resetToken?: string;

    @IsDate()
    @IsOptional()
    resetTokenExpiry?

    @Exclude()
    password?: string;
}
