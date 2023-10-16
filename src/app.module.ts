import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    ArticleModule,
    TagModule,
    UserModule,
    AuthModule,
    TokenModule,
    MailModule,
    PrismaModule,
  ],
  providers: [],
})
export class AppModule {}
