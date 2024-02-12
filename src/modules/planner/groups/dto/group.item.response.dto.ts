import { ResponseAdapter } from '@exception/response.adapter';
import { ResponseInfoAdapter } from '@exception/response.info.adapter';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../../../../models/group';

export class GroupItemResponseDto implements ResponseAdapter<Group> {
  @ApiProperty({ type: Group })
  data: Group;

  @ApiProperty({ type: ResponseInfoAdapter })
  info: ResponseInfoAdapter;
}
