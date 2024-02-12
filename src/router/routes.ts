import { MODULE_ROUTES } from '@constants/routes';
import { EventModule } from '@modules/planner/events';
import { GroupModule } from '@modules/planner/groups';
import { SessionModule } from '@modules/session';
import { RouteTree } from '@nestjs/core';

export const ROUTER_TREE: RouteTree[] = [
  {
    path: MODULE_ROUTES.PLANNER.PATH,
    children: [
      {
        path: MODULE_ROUTES.PLANNER.SERVICES.GROUP.PATH,
        module: GroupModule,
      },
      {
        path: MODULE_ROUTES.PLANNER.SERVICES.EVENTS.PATH,
        module: EventModule,
      },
    ],
  },
  {
    path: MODULE_ROUTES.SESSION.PATH,
    module: SessionModule,
  },
];
