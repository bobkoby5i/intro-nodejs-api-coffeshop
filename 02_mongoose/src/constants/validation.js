import mongoose from 'mongoose';

import { VALIDATION_ERROR } from './error';

export function validateObjectId(id) {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidObjectId) {
    const error = new Error(VALIDATION_ERROR);
    error.reason = `Not a valid ID: ${id}`;
    throw error;
  }
}

export default {
  validateObjectId,
};
