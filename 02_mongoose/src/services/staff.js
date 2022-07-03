/* eslint-disable no-dupe-class-members */
/* eslint-disable class-methods-use-this */
import mongoose from 'mongoose';
import { MISSING_DATA, NOT_FOUND, VALIDATION_ERROR } from '../constants/error';
import { validateObjectId } from '../constants/validation';

import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
} from '../db/staff';

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      required: true,
      type: String,
    },
    lastName: {
      required: true,
      type: String,
    },
    startedAt: {
      required: true,
      type: Date,
    },
    rating: {
      required: true,
      type: Number,
      min: 0,
      max: 10,
    },
    position: {
      required: true,
      type: [String],
      enum: ['waiter', 'waitress', 'barista', 'cleaning', 'temp'],
    },
    monthlySalary: {
      required: true,
      type: Number,
      min: 2000,
    },
  },
  { strict: 'throw' }
);

// eslint-disable-next-line prettier/prettier
export const EmployeeModel = mongoose.model('Employee', employeeSchema, 'staff');
export default class Staff {
  // idSchema = idSchema;

  // defaultEmployee = {
  //   _id: '1',
  //   firstName: 'Jan',
  //   lastName: 'Kowalski',
  //   startedAt: new Date(),
  //   rating: 4.5,
  //   position: 'waiter',
  //   monthlySalary: 4000.0,
  // };

  static getEmployeeSchema(myRequired) {
    return new mongoose.Schema(
      {
        firstName: {
          required: myRequired,
          type: String,
        },
        lastName: {
          required: myRequired,
          type: String,
        },
        startedAt: {
          required: myRequired,
          type: Date,
        },
        rating: {
          required: myRequired,
          type: Number,
          min: 0,
          max: 10,
        },
        position: {
          required: myRequired,
          type: [String],
          enum: ['waiter', 'waitress', 'barista', 'cleaning', 'temp'],
        },
        monthlySalary: {
          required: myRequired,
          type: Number,
          min: 2000,
        },
      },
      { strict: 'throw' }
    );
  }

  static employeeSchemaUpd = Staff.getEmployeeSchema(false);

  // eslint-disable-next-line prettier/prettier
  static employeeModelUpd = mongoose.model('EmployeeUpd', Staff.employeeSchemaUpd, 'staff');

  static employeeModelAdd = EmployeeModel;

  async addEmployee(employeeData) {
    if (!employeeData) {
      throw new Error(MISSING_DATA);
    }

    try {
      await Staff.employeeModelAdd.validate(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    return addEmployee(employeeData);
  }

  async getEmployee(employeeId) {
    console.log(`getEmployee(${employeeId})`);
    return getEmployee(employeeId);
  }

  async getEmployees(employeeId, additionalParams) {
    console.log(`Get getEmployees`, employeeId, additionalParams);
    return getEmployees(employeeId, additionalParams);
  }

  async updateEmployee(employeeId, employeeData) {
    if (!employeeId || !employeeData) {
      throw new Error(MISSING_DATA);
    }
    validateObjectId(employeeId);

    try {
      await Staff.employeeModelUpd.validate(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    console.log(`Saving ${employeeId}`, employeeData);
    return updateEmployee(employeeId, employeeData);
  }

  async deleteEmployee(employeeId) {
    validateObjectId(employeeId);

    const deletedCount = await deleteEmployee(employeeId);
    if (deletedCount === 0) {
      throw new Error(NOT_FOUND);
    }
  }
}
