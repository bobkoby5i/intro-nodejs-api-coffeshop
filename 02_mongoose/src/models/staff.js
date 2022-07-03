import mongoose from 'mongoose';
import { PAGE_SIZE } from '../constants/db';

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


export const addEmployee = async (employeeData) => {
  const employeeInstance = new EmployeeModel(employeeData);
  const result = await employeeInstance.save();    
  return result._id;
};


export const getEmployee = async (employeeId) => {
  const query = { _id: employeeId };
  return EmployeeModel.findOne(query);
};

export const getEmployees = async (
  employeeId,
  { ratingAbove, ratingBelow, page = 0, position } = {}
) => {
  const query = {};

  if (employeeId !== 'all') {
    query._id = employeeId;
  }

  if (ratingAbove || ratingBelow) {
    query.$and = [];

    if (ratingAbove) {
      query.$and.push({
        rating: {
          $gte: Number(ratingAbove),
        },
      });
    }

    if (ratingBelow) {
      query.$and.push({
        rating: {
          $lte: Number(ratingBelow),
        },
      });
    }
  }

  if (position) {
    query.position = position;
  }

  return EmployeeModel.find(query)
    .limit(PAGE_SIZE)
    .skip(Number(page) * PAGE_SIZE)
    .exec();
};

export const updateEmployee = async (employeeId, employeeData) => {
  const dataToUpdate = { ...employeeData };
  delete dataToUpdate._id; // Delete ID before update

  const result = await EmployeeModel.updateOne(
    {
      _id: employeeId,
    },
    {
      $set: dataToUpdate,
    },
    {
      upsert: false,
    }
    ).exec();

  return result.modifiedCount;
};

export const deleteEmployee = async (employeeId) => {
  const result = await EmployeeModel.deleteOne({
    _id: employeeId,
  }).exec();
  return result.deletedCount;
};
