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
} from '../models/staff';

export default class Staff {
  // defaultEmployee = {
  //   _id: '1',
  //   firstName: 'Jan',
  //   lastName: 'Kowalski',
  //   startedAt: new Date(),
  //   rating: 4.5,
  //   position: 'waiter',
  //   monthlySalary: 4000.0,
  // };

  async addEmployee(employeeData) {
    if (!employeeData) {
      throw new Error(MISSING_DATA);
    }

    try {
      return await addEmployee(employeeData);
    } catch (err) {
      console.log(err)
      if (err.name === 'ValidationError') {
        const error = new Error(VALIDATION_ERROR);
        error.reason = err.message;
        throw error;
      }      
      throw error;
    }
  }

  async getEmployee(employeeId) {
    console.log(`getEmployee(${employeeId})`);
    validateObjectId(employeeId);

    const employee = await getEmployee(employeeId);
    if (!employee) {
      throw new Error(NOT_FOUND);
    }
    return employee;
  }

  async getEmployees(employeeIds, additionalParams) {
    console.log(`getEmployees():`, employeeId, additionalParams);
    return getEmployees(employeeIds, additionalParams);
  }

  async updateEmployee(employeeId, employeeUpdData) {
    validateObjectId(employeeId);

    if (!employeeId || Object.keys(employeeUpdData).length === 0) {
      throw new Error(MISSING_DATA);
    }

    try {
      console.log(`Saving ${employeeId}`, employeeUpdData);
      return await updateProduct(employeeId, employeeUpdData);
    } catch (err) {
      if (err.name === 'ValidationError') {
        const error = new Error(VALIDATION_ERROR);
        error.reason = err.message;
        throw error;
      }      
      throw error;
    }        
  }

  async deleteEmployee(employeeId) {
    validateObjectId(employeeId);

    const deletedCount = await deleteEmployee(employeeId);
    if (deletedCount === 0) {
      throw new Error(NOT_FOUND);
    }
    return true;    
  }
}
