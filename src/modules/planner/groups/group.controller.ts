import { GetSessionData } from '@decorators/get.session.data';
import { ECookieNames } from '@enums/cookie';
import { EModuleNames } from '@enums/modules';
import { EApiResponseTypes } from '@exception/enums';
import { RejectException } from '@exception/reject.exception';
import { ResponseAdapter } from '@exception/response.adapter';
import { SessionGuard } from '@guards/session.guard';
import { Group } from '@models/group';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiDefaultResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ISessionData } from '../../session/types/api';
import { CreateGroupDto } from './dto/create.group.dto';
import { GetGroupsResponseDto } from './dto/get.groups.response.dto';
import { GroupItemResponseDto } from './dto/group.item.response.dto';
import { GroupParamsDto } from './dto/group.params.dto';
import { RemoveGroupResponseDto } from './dto/remove.group.response.dto';
import { EGroupApiMessages } from './enums';
import { GroupService } from './group.service';

@ApiTags(EModuleNames.GROUPS)
@Controller()
@UseGuards(SessionGuard)
@ApiUnauthorizedResponse({ type: ResponseAdapter })
@ApiDefaultResponse({ type: ResponseAdapter })
@ApiCookieAuth(ECookieNames.ACCESS_TOKEN)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Запрос на создание группы событий' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: GroupItemResponseDto })
  async createGroup(
    @Body() dto: CreateGroupDto,
    @GetSessionData() session: ISessionData,
  ): Promise<GroupItemResponseDto> {
    const result: Group = await this.groupService.createGroup(dto, session);

    return new ResponseAdapter(result, {
      type: EApiResponseTypes.SUCCESS,
      message: EGroupApiMessages.SUCCESS_CREATED,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Запрос на получение списка групп событий пользователя',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetGroupsResponseDto })
  async getGroupList(
    @GetSessionData() session: ISessionData,
  ): Promise<GetGroupsResponseDto> {
    const result: Group[] = await this.groupService.getGroupsByUser(
      new Types.ObjectId(session.user._id),
    );

    return new ResponseAdapter(result);
  }

  @Post('toggle')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Переключение состояния выбранности группы событий',
  })
  @ApiOkResponse({ type: GroupItemResponseDto })
  async toggleGroup(
    @Body() dto: GroupParamsDto,
    @GetSessionData() session: ISessionData,
  ): Promise<GroupItemResponseDto> {
    const result = await this.groupService.toggle(
      new Types.ObjectId(dto.groupId),
      new Types.ObjectId(session.user._id),
    );

    if (result instanceof RejectException) {
      throw result;
    }

    return new ResponseAdapter(result);
  }

  @Get(':groupId')
  @ApiOperation({ deprecated: true })
  async getGroupInfoById() {}

  @Delete(':groupId')
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Удаление группы событий по идентификатору',
    deprecated: true,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RemoveGroupResponseDto })
  async removeGroupById(
    @GetSessionData() session: ISessionData,
    @Param() params: GroupParamsDto,
  ): Promise<RemoveGroupResponseDto> {
    const groupId = new Types.ObjectId(params.groupId);
    const userId = new Types.ObjectId(session.user._id);

    const result: RejectException | void = await this.groupService.removeGroup(
      groupId,
      userId,
    );

    if (result instanceof RejectException) {
      throw result;
    }

    return new ResponseAdapter(groupId, {
      message: EGroupApiMessages.SUCCESS_REMOVED,
      type: EApiResponseTypes.SUCCESS,
    });
  }

  @Patch(':groupId')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Обновление группы событий', deprecated: true })
  async updateGroupInfo(
    @GetSessionData() session: ISessionData,
    @Param() params: GroupParamsDto,
  ) {}
}
