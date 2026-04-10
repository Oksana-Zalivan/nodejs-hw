import { isHttpError } from 'http-errors';
import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  console.log(err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  if (err.message === 'Only images allowed') {
    return res.status(400).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: 'Something went wrong',
  });
};
