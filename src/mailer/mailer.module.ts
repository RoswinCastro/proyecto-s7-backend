import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { MailerService } from './mailer.service';

dotenv.config(); // Asegúrate de cargar las variables de entorno

console.log('MAIL_HOST:', process.env.MAIL_HOST); // Verifica el host
console.log('MAIL_PORT:', process.env.MAIL_PORT); // Verifica el puerto
console.log('MAIL_USER:', process.env.MAIL_USER); // Verifica el usuario
console.log('MAIL_PASS:', process.env.MAIL_PASSWORD); // Verifica la contraseña
console.log('MAIL_FROM:', process.env.MAIL_FROM_EMAIL); // Verifica la contraseña

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT, 10),
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: `"No Reply" <${process.env.MAIL_FROM_EMAIL}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule { }
