export const MODULE_ROUTES = {
  GLOBAL_PREFIX: {
    PATH: 'api',
    FULL_PATH: '/api',
  },
  SESSION: {
    PATH: 'session',
    FULL_PATH: '/api/session',
  },
  PLANNER: {
    PATH: 'planner',
    FULL_PATH: '/api/planner',
    SERVICES: {
      GROUP: {
        PATH: 'groups',
        FULL_PATH: '/api/planner/groups',
      },
      EVENTS: {
        PATH: 'events',
        FULL_PATH: '/api/planner/events',
      },
    },
  },
};
