import logger from 'esther';

export default (err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  logger.error('INVALID CSRF');
  res.status(403);
  res.send();
};
