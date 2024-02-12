import { ResponseAdapter } from '@exception/response.adapter';
import { ResponseInfoAdapter } from '@exception/response.info.adapter';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class DeleteEventResponseDto implements ResponseAdapter<Types.ObjectId> {
  @ApiProperty({
    type: String,
    description: 'Идентификатор удаленного события',
    required: true,
    nullable: true,
  })
  data: Types.ObjectId;

  @ApiProperty({ type: ResponseInfoAdapter })
  info: ResponseInfoAdapter;
}
