// import MongoDB from 'mongodb';
import Joi from '@hapi/joi';

import {
  CONFLICT,
  MISSING_DATA,
  NOT_FOUND,
  VALIDATION_ERROR,
} from '../constants/error';

import { idSchema } from '../constants/validation';

// const { ObjectID } = MongoDB;

export default class Orders {
  defaultOrder = {
    _id: '123123123123123123123123', // new ObjectID('62a78f1cab246a81fc27ef0a'),
    date: new Date(),
    location: 2,
    paidIn: 'cash',
    staffId: '1',
    products: [
      {
        productId: '321321321321321321321321',
        name: 'Mocha',
        amount: 2,
        unitPrice: 2.0,
        total: 4.0,
      },
    ],
    total: 4.0,
  };

  productOrderSchema = Joi.object().keys({
    productId: idSchema.required(),
    name: Joi.string().required(),
    amount: Joi.number().greater(0).required(),
    unitPrice: Joi.number().greater(0).required(),
  });

  orderUpdateSchema = Joi.object().keys({
    _id: idSchema.required(),
    date: Joi.date(),
    location: Joi.string(),
    paidIn: Joi.string().valid('cash', 'card'),
    staffId: Joi.string().length(24),
    products: Joi.array().items(this.productOrderSchema),
    total: Joi.number().greater(0),
  });

  orderSchema = this.orderUpdateSchema.options({ presence: 'required' });

  addOrderSchema = this.orderSchema.keys({
    _id: Joi.any().strip().optional(),
  });

  async addOrder(orderData) {
    if (!orderData) {
      throw new Error(MISSING_DATA);
    }

    if (this.defaultOrder._id === orderData._id) {
      throw new Error(CONFLICT);
    }

    try {
      await this.addOrderSchema.validateAsync(orderData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    return true;
  }

  async deleteOrder(orderId) {
    console.log(`deleteOrder ${orderId}`);
    if (this.defaultOrder._id === orderId) {
      console.log(`Deleting ${orderId}`);
      return true;
    }

    throw new Error(NOT_FOUND);
  }

  async getOrders(orderId, dateFrom, dateTo) {
    console.log(`Get orders`, orderId, dateFrom, dateTo);
    if (!orderId) {
      return this.defaultOrder;
    }

    return [this.defaultOrder];
  }

  async updateOrder(orderId, orderData) {
    if (!orderId || !orderData) {
      throw new Error(MISSING_DATA);
    }

    if (this.defaultOrder._id !== orderId) {
      throw new Error(NOT_FOUND);
    }

    try {
      await this.orderUpdateSchema.validateAsync(orderData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    console.log(`Saving ${orderId}`, orderData);
    return true;
  }
}
