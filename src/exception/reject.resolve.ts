import { RejectException } from './reject.exception';

// export const rejectResolve = (object: any): RejectException | null => {
//   if (object instanceof RejectException) {
//     return object;
//   }
//
//   if ('data' in object && 'info' in object) {
//     return new RejectException<any>(
//       object.info.statusCode,
//       object.data,
//       object.info,
//     );
//   }
//
//   return null;
// };
