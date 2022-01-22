import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';

const changePlainMongooseObjectToClass = (
  document: PlainLiteralObject,
  classToIntercept: Type,
) => {
  if (!(document instanceof Document)) {
    return document;
  }

  return plainToInstance(classToIntercept, document.toJSON());
};

export function serializeMongooseModel(
  instance: PlainLiteralObject | PlainLiteralObject[],
  model: Type,
) {
  if (Array.isArray(instance)) {
    return instance.map((obj) => changePlainMongooseObjectToClass(obj, model));
  }
  return changePlainMongooseObjectToClass(instance, model);
}
