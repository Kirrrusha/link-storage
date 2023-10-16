import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmMail({ id, confirmLink, email }: { id: number; confirmLink: string; email: string }) {
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Подтверждение регистрации',
        template: join(__dirname, '/../templates', 'confirmReg'),
        context: {
          id,
          username: email,
          urlConfirmAddress: confirmLink,
        },
      })
      .catch((e) => {
        throw new HttpException(`Ошибка работы почты: ${JSON.stringify(e)}`, HttpStatus.UNPROCESSABLE_ENTITY);
      });
  }
}
