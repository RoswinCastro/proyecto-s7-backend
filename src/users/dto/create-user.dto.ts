import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsEmailWhitelistedDomain } from "src/common/validators/is-email-whitelisted-domain.validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmailWhitelistedDomain()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsString()
    profilePhoto?: string;
}
