import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { configModule } from './config/configure.root';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ArticleModule,
    TagModule,
    UserModule,
    AuthModule,
    TokenModule,
    MailModule,
  ],
})
export class AppModule { }
