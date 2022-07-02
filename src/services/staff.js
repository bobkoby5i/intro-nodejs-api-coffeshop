import Joi from '@hapi/joi';

import {
  CONFLICT,
  MISSING_DATA,
  NOT_FOUND,
  VALIDATION_ERROR,
} from '../constants/error';
import { idSchema } from '../constants/validation';

export default class Staff {
  defaultEmployee = {
    _id: '1',
    firstName: 'Jan',
    lastName: 'Kowalski',
    startedAt: new Date(),
    rating: 4.5,
    position: 'waiter',
    monthlySalary: 4000.0,
  };

  employeeUpdateSchema = Joi.object().keys({
    _id: idSchema.required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    startedAt: Joi.date(),
    rating: Joi.number().min(0).max(10),
    position: Joi.array().items(
      Joi.string().valid('waiter'),
      Joi.string().valid('waitress'),
      Joi.string().valid('barista'),
      Joi.string().valid('cleaning'),
      Joi.string().valid('temp')
    ),
    monthlySalary: Joi.number().min(2000), // Optimistically setting this one :)
  });

  employeeSchema = this.employeeUpdateSchema.options({ presence: 'required' });

  async addEmployee(employeeData) {
    if (!employeeData) {
      throw new Error(MISSING_DATA);
    }

    if (this.defaultEmployee._id === employeeData._id) {
      throw new Error(CONFLICT);
    }

    try {
      await this.employeeSchema.validateAsync(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    return true;
  }

  async deleteEmployee(employeeId) {
    if (this.defaultEmployee._id === employeeId) {
      console.log(`Deleting ${employeeId}`);
      return true;
    }

    throw new Error(NOT_FOUND);
  }

  async getEmployee(employeeId) {
    console.log(`Get products`, employeeId);
    if (!employeeId) {
      return this.defaultEmployee;
    }

    return [this.defaultEmployee];
  }

  async updateEmployee(employeeId, employeeData) {
    if (!employeeId || !employeeData) {
      throw new Error(MISSING_DATA);
    }

    if (this.defaultEmployee._id !== employeeId) {
      throw new Error(NOT_FOUND);
    }

    try {
      await this.employeeUpdateSchema.validateAsync(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    console.log(`Saving ${employeeId}`, employeeData);
    return true;
  }
}
