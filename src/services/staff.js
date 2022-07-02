import { CONFLICT, MISSING_DATA, NOT_FOUND } from '../constants/error';

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

  async addEmployee(employeeData) {
    if (!employeeData) {
      throw new Error(MISSING_DATA);
    }

    if (this.defaultEmployee._id === employeeData._id) {
      throw new Error(CONFLICT);
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

    console.log(`Saving ${employeeId}`, employeeData);
    return true;
  }
}
