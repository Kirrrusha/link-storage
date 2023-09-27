import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppConfigModule } from './app-config/app-config.module';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';

@Module({
  imports: [ArticleModule, TagModule, UserModule, AuthModule, TokenModule, MailModule, PrismaModule, AppConfigModule, JwtAuthModule],
  providers: [],
})
export class AppModule {}
