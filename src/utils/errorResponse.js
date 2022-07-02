import {
  CONFLICT,
  MISSING_DATA,
  NOT_FOUND,
  VALIDATION_ERROR,
} from '../constants/error';

export default (err, res) => {
  console.log('errorResponse()');
  switch (err.message) {
    case MISSING_DATA:
      return res.status(400).json({
        error: 'Missing input parameters',
      });
    case VALIDATION_ERROR:
      return res.status(400).json({
        error: 'Validation error',
        message: err.reason,
      });
    case NOT_FOUND:
      return res.status(404).json({
        error: 'Order not found',
      });
    case CONFLICT:
      return res.status(409).json({
        error: 'Resource already exists',
      });
    default:
      return res.status(500).json({
        error: 'Generic server error',
        message: err.message,
      });
  }
};
