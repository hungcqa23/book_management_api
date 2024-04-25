class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string = 'Error', statusCode: number = 400) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${message}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

export default AppError;
