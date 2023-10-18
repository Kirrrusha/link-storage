import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as cookie from 'cookie';

import * as supertest from 'supertest';

import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { MailService } from '../src/mail/mail.service';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';

function generateRandomEmail() {
  const randomString = Math.random().toString(36).substring(7); // Генерируем случайную строку
  const domain = 'example.com'; // Замените на желаемый домен

  const email = `test.${randomString}@${domain}`;
  return email;
}

describe('AuthController (e2e)', () => {
  process.env.MAIL_TRANSPORT = 'smtps://test@test.ru:tets@ssl://smtp.test.ru';
  process.env.MAIL_FROM_NAME = 'my-value';
  process.env.DATABASE_URL_PRISMA = 'postgresql://user:password@localhost:5438/test?schema=public';
  process.env.AUTH_COOKIE_NAME = 'test';
  process.env.EXPIRES_IN_DAYS = '30';
  let app: INestApplication;
  let loginDto: CreateUserDto;
  const prisma = new PrismaClient();

  const sendConfirmMailMock = jest.fn();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue({ sendConfirmMail: sendConfirmMailMock })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    loginDto = {
      email: generateRandomEmail(),
      fullName: 'Мистер Тест',
      password: 'YgzuQ2yj9A2Rsw',
    };
  });

  it('/auth/sign-up (POST) - success', async () => {
    const response = await supertest(app.getHttpServer()).post('/auth/sign-up').send(loginDto);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toHaveProperty('accessToken');

    expect(sendConfirmMailMock).toHaveBeenCalledTimes(1);

    const setCookieHeader = response.headers['set-cookie'];

    expect(setCookieHeader).toBeDefined();

    const parsedCookies = setCookieHeader.map(cookie.parse);

    parsedCookies.forEach((cookie: Record<string, string>) => {
      expect(cookie[String(process.env.AUTH_COOKIE_NAME)]).toBeDefined();
      expect(cookie['Expires']).toBeDefined();
      expect(cookie['Path']).toBe('/');
    });
    for (const key in parsedCookies) {
      if (parsedCookies.hasOwnProperty(key)) {
      }
    }
  });

  it('/auth/sign-up (POST) - fail request', async () => {
    const response = await supertest(app.getHttpServer()).post('/auth/sign-up').send({
      email: 'mister-test',
      fullName: 'Мистер Тест',
    });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toStrictEqual({
      statusCode: 400,
      message: ['Email должен быть валидным', 'Пароль должен быть строкой', 'Поле пароль не должно быть пустым'],
      error: 'Bad Request',
    });
  });

  it('/auth/sign-up (POST) - fail user', async () => {
    await supertest(app.getHttpServer()).post('/auth/sign-up').send(loginDto);
    const response = await supertest(app.getHttpServer()).post('/auth/sign-up').send(loginDto);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('/auth/sign-in (POST) - success', async () => {
    const responseSignUp = await supertest(app.getHttpServer()).post('/auth/sign-up').send(loginDto);

    expect(responseSignUp.status).toBe(HttpStatus.CREATED);

    const responseSignIn = await supertest(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: loginDto.email, password: loginDto.password });

    expect(responseSignIn.status).toBe(HttpStatus.OK);
    expect(responseSignIn.body).toHaveProperty('accessToken');

    const setCookieHeader = responseSignIn.headers['set-cookie'];

    expect(setCookieHeader).toBeDefined();

    const parsedCookies = setCookieHeader.map(cookie.parse);

    parsedCookies.forEach((cookie: Record<string, string>) => {
      expect(cookie[String(process.env.AUTH_COOKIE_NAME)]).toBeDefined();
      expect(cookie['Expires']).toBeDefined();
      expect(cookie['Path']).toBe('/');
    });
    for (const key in parsedCookies) {
      if (parsedCookies.hasOwnProperty(key)) {
      }
    }
  });

  it('/auth/sign-in (POST) - fail password', async () => {
    const responseSignUp = await supertest(app.getHttpServer()).post('/auth/sign-up').send(loginDto);
    expect(responseSignUp.status).toBe(HttpStatus.CREATED);

    supertest(app.getHttpServer()).post('/auth/sign-in').send({ email: loginDto.email, password: 123 }).expect(401, {
      statusCode: 401,
      message: 'Неверный пароль',
      error: 'Unauthorized',
    });
  });

  it('/auth/sign-in (POST) - fail password', () => {
    supertest(app.getHttpServer()).post('/auth/sign-in').send({ email: 'aaa@a.ru', password: 123 }).expect(401, {
      statusCode: 401,
      message: 'Пользователь с таким email не найден',
      error: 'Unauthorized',
    });
  });

  afterAll(async () => {
    await prisma.$executeRaw`DELETE FROM "User";`;
    await prisma.$executeRaw`DELETE FROM "Token";`;
    await prisma.$disconnect();
    await app.close();
  });
});
