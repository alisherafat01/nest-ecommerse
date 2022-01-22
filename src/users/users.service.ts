import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Model } from 'mongoose';
import CreateUserDto from './dtos/create-user.dto';
import { User, UserDocument } from './user.schema';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getPasswordHash(password: string) {
    return bcrypt.hash(password, 10);
  }

  async checkPasswordMatch(rawPassword: string, hashPassword: string) {
    return bcrypt.compare(rawPassword, hashPassword);
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async getAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async create(userData: CreateUserDto) {
    userData.password = await this.getPasswordHash(userData.password);
    const user = new this.userModel(userData);
    return user.save();
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async removeAll() {
    return this.userModel.deleteMany();
  }
}
