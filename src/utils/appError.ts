class AppError extends Error {
  statusCode: number;
  status: string;
  isOperation: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${message}`.startsWith('4') ? 'fail' : 'error';
    this.isOperation = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

export default AppError;
