import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/user.schema';
import { SignupUserDto } from './dto/signup-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupUserDto) {
    // See if email is in use
    let user = await this.usersService.findOneByEmail(signupDto.email);
    if (user) {
      throw new BadRequestException('email in use');
    }

    user = await this.usersService.create(signupDto);
    
    const access_token = this.getAccessToken(user);

    return { user, token: { access_token } };
  }

  async signin(email: string, password: string) {
    let user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Wrong credentials provided');
    }

    const isPasswordMatching = await this.usersService.checkPasswordMatch(
      password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
    const payload = this.getJwtPayload(user);
    const access_token = this.jwtService.sign(payload);
    // return the user
    return { user, token: { access_token } };
  }

  private getJwtPayload(user: User) {
    return { id: user.id };
  }

  public getAccessToken(user: User) {
    return this.jwtService.sign(this.getJwtPayload(user));
  }
}
