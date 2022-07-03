import mongoose from 'mongoose';

import {
  MISSING_DATA,
  NOT_FOUND,
  PEER_ERROR,
  VALIDATION_ERROR,
} from '../constants/error';
import { addOrder, deleteOrder, getOrders, updateOrder } from '../db/orders';
import { getEmployees } from '../db/staff';
import { getProducts } from '../db/products';

import { EmployeeModel } from './staff';
import { ProductModel } from './products';

const mOrderSchema = new mongoose.Schema({
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

export const mOrder = mongoose.model('Order', mOrderSchema);

// const { ObjectID } = MongoDB;

export default class Orders {
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

  Order = mongoose.model('Order', mOrderSchema);

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
      await this.Order.validate(orderData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    await Orders._checkIfEmployeeExists(orderData.staffId);
    await Orders._checkIfProductsExist(orderData.products);

    return addOrder(orderData);
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOrder(orderId) {
    console.log(`deleteOrder ${orderId}`);

    const isValidObjectId = mongoose.Types.ObjectId.isValid(orderId);
    if (!isValidObjectId) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = `Not a valid ID: ${orderId}`;
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
      await this.Order.validate(orderData);
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
