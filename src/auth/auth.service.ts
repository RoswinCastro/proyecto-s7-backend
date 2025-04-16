import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';
import { ManagerError } from './../common/errors/manager.error';
import { OmitPassword } from 'src/common/types/users/omit-password.user';
import { UserEntity } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) { }

  async register(registerAuthDto: RegisterAuthDto): Promise<{ user: OmitPassword; access_token: string }> {
    const { name, email, password } = registerAuthDto
    try {
      // Check if user already exists
      const existingUser = await this.usersService.findOneByEmail(email)
      if (existingUser) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'A user with this email already exists!',
        })
      }

      //hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create new user with hashed password
      const user = await this.usersService.create({
        name,
        email,
        password: hashedPassword,
      })

      const { password: _, ...rest } = user

      const access_token = this.jwtService.sign(rest, {
        secret: process.env.JWT_SECRET,
      })

      if (!access_token) {
        throw new ManagerError({
          type: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        })
      }

      return { user: rest, access_token }
    } catch (error) {
      ManagerError.createSignatureError(error.message)
    }
  }

  async login(loginAuthDto: LoginAuthDto): Promise<{ user: OmitPassword; access_token: string }> {
    const { email, password } = loginAuthDto;
    try {
      // Check if user exists
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new ManagerError({
          type: "BAD_REQUEST",
          message: "User not found!",
        });
      }

      //compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'Credentials not valid!',
        });
      }

      const { password: destructuring, ...rest } = user

      const access_token = this.jwtService.sign(rest, {
        secret: process.env.JWT_SECRET,
      })
      if (!access_token) {
        throw new ManagerError({
          type: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        })
      }
      return { user: rest, access_token }
    } catch (error) {
      ManagerError.createSignatureError(error.message)
    }
  }


  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    try {
      const response = await this.usersService.findOne(userId)
      const user = response.data;

      if (!user) {
        throw new ManagerError({
          type: "BAD_REQUEST",
          message: "User not found!",
        });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'Current password is incorrect!',
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.usersService.update(userId, { password: hashedPassword });

      return { message: 'Password changed successfully' };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  // async validateToken(token: string): Promise<UserEntity> {
  //   try {
  //     const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET })
  //     const response = await this.usersService.findOne(decoded.id)
  //     const user = response.data

  //     if (!user) {
  //       throw new UnauthorizedException("Unauthorized")
  //     }

  //     return user
  //   } catch (error) {
  //     throw new UnauthorizedException("Unauthorized")
  //   }
  // }
}