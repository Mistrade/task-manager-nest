import { ResponseAdapter } from '@exception/response.adapter';
import { ResponseInfoAdapter } from '@exception/response.info.adapter';
import { ApiProperty } from '@nestjs/swagger';
import { SessionDataDto } from './session.data';

export class SessionDto implements ResponseAdapter<SessionDataDto> {
  @ApiProperty({ type: SessionDataDto, description: '', nullable: true })
  data: SessionDataDto;

  @ApiProperty({ type: ResponseInfoAdapter, description: '' })
  info: ResponseInfoAdapter;
}
