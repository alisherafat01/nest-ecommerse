import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import validationConfigs from '../configs/validation-pipe.config';

export class FlexibleValidationPipe {
  static build(options: {}): ValidationPipe {
    return new ValidationPipe({ ...validationConfigs, ...options });
  }
}
