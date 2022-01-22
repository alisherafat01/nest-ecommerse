import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Session,
  Request,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { classToPlain, plainToClass, plainToInstance } from 'class-transformer';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
import { AuthenticationService } from './authentication.service';
import { SigninUserDto } from './dto/signin-user-dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import { UsersService } from '../users/users.service';
import { CurrentUserInterceptor } from '../users/interceptors/current-user.interceptor';
import { serializeMongooseModel } from '../shared/utils/serializer';
import { User } from '../users/user.schema';
import { SkipAuth } from '../shared/decorators/skip-auth.decorator';

@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthenticationController {
  constructor(
    private usersService: UsersService,
    private authService: AuthenticationService,
  ) {}

  @Get('/profile')
  @UseInterceptors(CurrentUserInterceptor)
  async profile(@Request() req) {
    return req.currentUser;
  }

  @SkipAuth()
  @Post('/signup')
  async createUser(@Body() body: SignupUserDto) {
    let signupResult = await this.authService.signup(body);
    signupResult.user = serializeMongooseModel(signupResult.user, User);
    return signupResult;
  }

  @SkipAuth()
  @Post('/signin')
  async signin(@Body() body: SigninUserDto) {
    const signinResult = await this.authService.signin(
      body.email,
      body.password,
    );
    signinResult.user = serializeMongooseModel(signinResult.user, User);
    return signinResult;
  }
}
