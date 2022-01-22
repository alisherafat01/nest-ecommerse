import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import { SignupUserDto } from './dto/signup-user.dto';

describe('AuthService', () => {
  let authService: AuthenticationService;
  let usersService: UsersService;
  let mockUserModel: Model<UserDocument>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthenticationService,
        { provide: JwtService, useValue: { sign: jest.fn() } },
        { provide: getModelToken(User.name), useValue: {} },
      ],
    }).compile();

    authService = module.get<AuthenticationService>(AuthenticationService);
    usersService = module.get<UsersService>(UsersService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('signup user', () => {
    it('should fail if user found by email', async () => {
      let user = new User();
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(user as UserDocument);

      await expect(
        authService.signup({
          email: 'tst@test.com',
          name: 'test',
          password: 'somepassword',
        } as SignupUserDto),
      ).rejects.toThrow();
    });

    it('should return user and token', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(null as UserDocument);

      let createdUser = new User();
      createdUser.id = 'w234werwer';

      jest
        .spyOn(usersService, 'create')
        .mockResolvedValue(createdUser as UserDocument);

      let data = await authService.signup({
        email: 'tst@test.com',
        name: 'test',
        password: 'somepassword',
      } as SignupUserDto);
      expect(jwtService.sign).toBeCalled();
      // expect(data).toHaveProperty('user');
    });
  });
});
