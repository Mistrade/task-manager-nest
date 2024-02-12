import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: false })
  email?: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  surname: string;

  @Prop({ type: String, required: false })
  patronymic?: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Number, required: true })
  timezone: number;
}

const UserSchema = SchemaFactory.createForClass(User);
type TUserDocument = HydratedDocument<User>;
type TUserModel = Model<TUserDocument>;
type TApiUser = Omit<User, 'password'>;

export { UserSchema, TUserDocument, TUserModel, User, TApiUser };
