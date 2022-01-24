import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer = null;

async function getMongoServerInstance() {
  if (mongod) {
    return mongod;
  }
  mongod = await MongoMemoryServer.create();
  return mongod;
}

export const closeInMemoryMongoConnection = async () => {
  if (mongod) await mongod.stop();
};

export const getInMemoryMongoUri = async () => {
  const mongod = await getMongoServerInstance();
  return mongod.getUri();
};
