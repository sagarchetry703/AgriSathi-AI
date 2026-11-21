export function errorHandler(err, req, res, next) {
  console.error('❌ Server Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected internal error occurred.';

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
}
