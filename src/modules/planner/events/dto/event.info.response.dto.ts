import { ResponseAdapter } from '@exception/response.adapter';
import { ResponseInfoAdapter } from '@exception/response.info.adapter';
import { Event } from '@models/event';
import { ApiProperty } from '@nestjs/swagger';

export class EventInfoResponseDto implements ResponseAdapter<Event> {
  @ApiProperty({ type: Event })
  data: Event;

  @ApiProperty({ type: ResponseInfoAdapter })
  info: ResponseInfoAdapter;
}
