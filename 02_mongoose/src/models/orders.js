import mongoose from 'mongoose';

import { db } from './index';
import { PAGE_SIZE } from '../constants/db';
import { getDate } from '../utils/date';

import { EmployeeModel } from './staff';
import { ProductModel } from './products';

const orderSchema = new mongoose.Schema({
  date: {
    required: true,
    type: Date,
  },
  location: {
    required: true,
    type: String,
  },
  paidIn: {
    required: true,
    type: String,
    enum: ['cash', 'card'],
  },
  staffId: {
    required: true,
    type: mongoose.Schema.ObjectId,
    ref: EmployeeModel,
  },
  products: [
    {
      productId: {
        required: true,
        type: mongoose.Schema.ObjectId,
        ref: ProductModel,
      },
      name: {
        required: true,
        type: String,
      },
      amount: {
        required: true,
        type: Number,
      },
      unitPrice: {
        required: true,
        type: Number,
      },
    },
  ],
  total: {
    required: true,
    type: Number,
    min: 0.01,
  },
});

export const OrderModel = mongoose.model('Order', orderSchema);

export const addOrder = async (orderData) => {
  // console.log(order);
  const orderInstance = new OrderModel(orderData);
  const result = await orderInstance.save();  
  return result._id;  

};

export const deleteOrder = async (orderId) => {
  const result = await OrderModel.deleteOne({
    _id: orderId,
  }).exec();
  return result.deletedCount;
};

export const getOrder = async (orderId) => {
  const query = { _id: orderId };
  return OrderModel.findOne(query);
};

export const getOrders = async (
  orderId,
  { dateFrom, dateTo, page = 0 } = {}
) => {
  const query = {};

  if (orderId !== 'all') {
    query._id = new ObjectID(orderId);
  }

  if (dateFrom || dateTo) {
    query.$and = [];

    if (dateFrom) {
      query.$and.push({
        date: {
          $gte: getDate(dateFrom),
        },
      });
    }

    if (dateTo) {
      query.$and.push({
        date: {
          $lte: getDate(dateTo),
        },
      });
    }
  }

  return getCollection()
    .find(query)
    .limit(PAGE_SIZE)
    .skip(Number(page) * PAGE_SIZE)
    .toArray();
};

export const updateOrder = async (orderId, orderData) => {
  const dataToUpdate = { ...orderData };
  delete dataToUpdate._id; // Delete ID before update

  const result = await getCollection().updateOne(
    {
      _id: new ObjectID(orderId),
    },
    {
      $set: dataToUpdate,
    },
    {
      upsert: false,
    }
  );

  return result.modifiedCount;
};

