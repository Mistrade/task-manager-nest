export enum EApiResponseTypes {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export const UNKNOWN_ERROR_CODE = 'UNKNOWN_ERROR';

export enum EGlobalApiMessages {
  MONGO_VERSION_ERROR = `Ошибка при синхронизации версий документа, повторите попытку позже.`,
  MONGO_UNKNOWN_ERROR = `Произошла непредвиденная ошибка со стороны базы данных, попробуйте повторить операцию позже.`,
  MONGO_PARALLEL_SAVE_ERROR = `Произошла ошибка из-за попытки параллельного сохранения данных. Пожалуйста, дождитесь завершения операции.`,
  MONGO_DOCUMENT_NOT_FOUND_ERROR = `Запрашиваемый документ не найден. Попробуйте изменить данные запроса.`,
  MONGO_VALIDATION_ERROR = `Произошла ошибка валидации(проверки отправленных данных) на уровне БД(Базы данных).`,

  SERVER_UNKNOWN_ERROR = `Произошла непредвиденная ошибка на сервере`,
  SERVER_BAD_REQUEST = `Невалидные данные для запроса.`,
}
