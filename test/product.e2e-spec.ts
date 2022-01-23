import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { SignupUserDto } from '../src/authentication/dto/signup-user.dto';
import { UsersService } from '../src/users/users.service';
import { SigninUserDto } from '../src/authentication/dto/signin-user-dto';
import { ProductService } from '../src/product/product.service';
import { CreateProductDto } from '../src/product/dto/create-product.dto';
import { UpdateProductDto } from '../src/product/dto/update-product.dto';
import { JwtAuthGuard } from '../src/authentication/jwt.guard';
import { MockJwtAuthGuard } from './mocks/mock-auth-guard';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from '../src/authentication/authentication.service';

describe('Product /products (e2e)', () => {
  let app: INestApplication;
  let productService: ProductService;
  let authService: AuthenticationService;
  let userService: UsersService;
  let accessToken: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideProvider(JwtAuthGuard)
      // .useClass(MockJwtAuthGuard)
      .compile();

    productService = moduleFixture.get<ProductService>(ProductService);
    userService = moduleFixture.get<UsersService>(UsersService);
    authService = moduleFixture.get<AuthenticationService>(
      AuthenticationService,
    );
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const signupResult = await authService.signup({
      email: 'test@test.com',
      name: 'test user',
      password: 'testpassword',
    });
    accessToken = signupResult.token.access_token;
  });

  afterEach(async () => {
    // truncate data from DB...
    await userService.removeAll();
    await productService.deleteAll();
  });

  const createInput: CreateProductDto = {
    count: 10,
    price: 50000,
    title: 'test product',
    images: [
      {
        path: '/to.jpg',
        title: 'new image',
      },
    ],
  };

  describe('POST /', () => {
    it('should return 400 error if all inputs not provided', () => {
      let data = { ...createInput };
      delete data['title'];
      return request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .expect(400);
    });

    it('should return 201 and return product', async () => {
      return request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createInput)
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
          expect(body.title).toBe(createInput.title);
          expect(body.images).toBeDefined();
          expect(Object.keys(body.images[0])).toEqual(
            expect.arrayContaining(['id', 'path']),
          );
        });
    });
  });

  describe('PATCH /{id}', () => {
    const id = '61eae803df9a99808b4b750a';
    const updateInput: UpdateProductDto = {
      count: 11,
      price: 51000,
      title: 'updated test product',
      images: [
        {
          path: '/to.jpg',
          title: 'updated new image',
        },
      ],
    };

    it('should return 404 if id not found', async () => {
      return request(app.getHttpServer())
        .patch(`/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateInput)
        .expect(404);
    });

    it('should update and return product', async () => {
      const product = await productService.create(createInput);
      return request(app.getHttpServer())
        .patch(`/products/${product.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateInput)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject(updateInput);
        });
    });
  });
});
