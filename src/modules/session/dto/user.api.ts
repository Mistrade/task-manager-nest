import { TApiUser, User } from '@models/user';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UserApiDto implements TApiUser {
  @ApiProperty({
    type: String,
    description: 'Отчество',
    required: false,
  })
  patronymic?: string;

  @ApiProperty({
    type: String,
    description: 'Номер телефона',
    required: true,
  })
  phone: string;

  @ApiProperty({
    type: String,
    description: 'Идентификатор',
    required: true,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'Почта',
    required: false,
  })
  email?: string;

  @ApiProperty({
    type: String,
    description: 'Имя',
    required: true,
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Фамилия',
    required: true,
  })
  surname: string;

  @ApiProperty({
    type: Number,
    description: 'Смещение часового пояса пользователя от UTC в минутах',
    default: 180,
    required: true,
  })
  timezone: number;

  constructor(user: User | UserApiDto) {
    this.phone = user.phone;
    this._id = user._id;
    this.email = user.email;
    this.name = user.name;
    this.surname = user.surname;
    this.patronymic = user.patronymic;
    this.timezone = user.timezone ?? 180;
  }
}
