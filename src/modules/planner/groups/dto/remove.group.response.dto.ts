import { ResponseAdapter } from '@exception/response.adapter';
import { ResponseInfoAdapter } from '@exception/response.info.adapter';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class RemoveGroupResponseDataDto {
  @ApiProperty({
    type: String,
    description: 'Идентификатор удаленной группы событий',
    required: true,
  })
  _id: Types.ObjectId;
}

export class RemoveGroupResponseDto
  implements ResponseAdapter<RemoveGroupResponseDataDto>
{
  @ApiProperty({ type: RemoveGroupResponseDataDto })
  data: RemoveGroupResponseDataDto;

  @ApiProperty({ type: ResponseInfoAdapter })
  info: ResponseInfoAdapter;
}
