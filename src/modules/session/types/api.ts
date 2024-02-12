import { UserApiDto } from '../dto/user.api';

export interface IAuthJwtPayload {
  userId: string;
  sessionUUID: string;
}

export interface IRedisSessionData {
  user: Omit<UserApiDto, '_id'> & { _id: string };
  sessionUUID: string;
  expireSessionDate: string;
}

export interface ISessionData {
  user: UserApiDto;
  sessionUUID: string;
  expireSessionDate: Date;
}
