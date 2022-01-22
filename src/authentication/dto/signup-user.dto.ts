import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupUserDto {
  @IsEmail()
  email: string;
 
  @MinLength(3)
  name: string;

  @MinLength(6)
  password: string;
}
