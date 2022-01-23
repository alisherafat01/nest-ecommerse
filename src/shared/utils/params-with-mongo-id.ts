import { IsMongoId } from 'class-validator';

class ParamsMongoId {
  @IsMongoId()
  id: string;
}

export default ParamsMongoId;
