import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { ISessionData } from '../types/api';
import { UserApiDto } from './user.api';

export class SessionDataDto implements ISessionData {
  @ApiProperty({
    type: UserApiDto,
    required: true,
    default: UserApiDto,
    description: 'Информация о пользователе',
  })
  user: UserApiDto;

  @ApiProperty({
    type: String,
    default: v4(),
    required: true,
    description: 'Уникальный идентификатор сессии',
  })
  sessionUUID: string;

  @ApiProperty({
    type: String,
    description: 'Дата, до которой сессия будет активна',
    nullable: true,
    required: true,
  })
  expireSessionDate: Date | null;

  constructor(props: ISessionData) {
    this.user = new UserApiDto(props.user);
    this.sessionUUID = props.sessionUUID;
    this.expireSessionDate = props.expireSessionDate;
  }
}
