import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from './../users/users.module';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [AuthController],
  providers: [{
    provide: 'APP_GUARD',
    useClass: AuthGuard,
  }, AuthService, JwtService, AuthGuard, RoleGuard],
  imports: [
    UsersModule,
    MailerModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  exports: [AuthService, AuthGuard, RoleGuard],
})
export class AuthModule { }
