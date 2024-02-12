import { ResponseAdapter } from '@exception/response.adapter';
import { ResponseInfoAdapter } from '@exception/response.info.adapter';
import { ApiProperty } from '@nestjs/swagger';
import { UserApiDto } from './user.api';

export class UpdateTimezoneResponseDto implements ResponseAdapter<UserApiDto> {
  @ApiProperty({ type: UserApiDto })
  data: UserApiDto;

  @ApiProperty({ type: ResponseInfoAdapter })
  info: ResponseInfoAdapter;
}
