// import MongoDB from 'mongodb';
import Joi from '@hapi/joi';

import {
  MISSING_DATA,
  NOT_FOUND,
  PEER_ERROR,
  VALIDATION_ERROR,
} from '../constants/error';
import { addOrder, deleteOrder, getOrders, updateOrder } from '../db/orders';
import { idSchema } from '../constants/validation';
import { getEmployees } from '../db/staff';
import { getProducts } from '../db/products';

// const { ObjectID } = MongoDB;

export default class Orders {
  idSchema = idSchema;
  // defaultOrder = {
  //   _id: '123123123123123123123123', // new ObjectID('62a78f1cab246a81fc27ef0a'),
  //   date: new Date(),
  //   location: 2,
  //   paidIn: 'cash',
  //   staffId: '1',
  //   products: [
  //     {
  //       productId: '321321321321321321321321',
  //       name: 'Mocha',
  //       amount: 2,
  //       unitPrice: 2.0,
  //       total: 4.0,
  //     },
  //   ],
  //   total: 4.0,
  // };

  productOrderSchema = Joi.object().keys({
    productId: idSchema.required(),
    name: Joi.string().required(),
    amount: Joi.number().greater(0).required(),
    unitPrice: Joi.number().greater(0).required(),
  });

  orderUpdateSchema = Joi.object().keys({
    // _id: idSchema.required(),
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

  static async _checkIfEmployeeExists(employeeId) {
    const existingEmployee = await getEmployees(employeeId);
    if (!existingEmployee) {
      const error = new Error(PEER_ERROR);
      error.reason = 'Missing related employee';
      throw error;
    }
  }

  static async _checkIfProductsExist(products) {
    const productIds = products.map((product) => product.productId);
    const dbProducts = await getProducts(productIds);
    if (dbProducts.length !== productIds.length) {
      const missingIds = productIds.filter(
        (productId) =>
          dbProducts.findIndex((product) => product._id === productId) === -1
      );
      const error = new Error(PEER_ERROR);
      error.reason = `Missing following products: ${missingIds.join(', ')}`;
      throw error;
    }
  }

  async addOrder(orderData) {
    if (!orderData) {
      throw new Error(MISSING_DATA);
    }

    try {
      await this.addOrderSchema.validateAsync(orderData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    await Orders._checkIfEmployeeExists(orderData.staffId);
    await Orders._checkIfProductsExist(orderData.products);

    return addOrder(orderData);
  }

  async deleteOrder(orderId) {
    console.log(`deleteOrder ${orderId}`);
    try {
      await this.idSchema.validateAsync(orderId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    const deletedCount = await deleteOrder(orderId);
    if (deletedCount === 0) {
      throw new Error(NOT_FOUND);
    }

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  async getOrders(orderId, additionalParams) {
    console.log(orderId, additionalParams);
    return getOrders(orderId, additionalParams);
  }

  async updateOrder(orderId, orderData) {
    if (!orderData || Object.keys(orderData).length === 0) {
      throw new Error(MISSING_DATA);
    }

    try {
      await this.orderUpdateSchema.validateAsync(orderData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    if (orderData.staffId) {
      await Orders._checkIfEmployeeExists(orderData.staffId);
    }
    if (orderData.products) {
      await Orders._checkIfProductsExist(orderData.products);
    }

    return updateOrder(orderId, orderData);
  }
}
