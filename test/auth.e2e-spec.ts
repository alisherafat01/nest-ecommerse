import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { SignupUserDto } from '../src/authentication/dto/signup-user.dto';
import { UsersService } from '../src/users/users.service';
import { SigninUserDto } from '../src/authentication/dto/signin-user-dto';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let usersService: UsersService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    usersService = moduleFixture.get<UsersService>(UsersService);
    //connection = await moduleFixture.get(getConnectionToken());
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    // await connection.close(/*force:*/ true); // <-- important
    await app.close();
  });

  afterEach(async () => {
    // truncate data from DB...
    await usersService.removeAll();
  });
  describe('POST /signup', () => {
    const signupData: SignupUserDto = {
      email: 'test@test.com',
      name: 'testuser',
      password: 'test123456',
    };

    it('should return 400 error if all inputs not provided', () => {
      let data = { ...signupData };
      delete data['password'];
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(data)
        .expect(400);
    });

    it('should return 400  if email is in use', async () => {
      await usersService.create(signupData);
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupData)
        .expect(400);
    });

    it('should return 201 and return user and tokens', async () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupData)
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toBe(signupData.email);
          expect(res.body.user.password).not.toBeDefined();
          expect(res.body.token).toHaveProperty('access_token');
        });
    });
  });

  describe('POST /signin', () => {
    const signinData: SigninUserDto = {
      email: 'test@test.com',
      password: 'test123456',
    };

    it('should return 400 if email not found', async () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send(signinData)
        .expect(400);
    });

    it('should return 400 if password not match', async () => {
      let user = await usersService.create({ ...signinData, name: 'test' });
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({ ...signinData, password: 'another password' })
        .expect(400);
    });

    it('should return user and tokens', async () => {
      let user = await usersService.create({ ...signinData, name: 'test' });
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send(signinData)
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toBe(signinData.email);
          expect(res.body.user.password).not.toBeDefined();
          expect(res.body.token).toHaveProperty('access_token');
        });
    });
  });
});
