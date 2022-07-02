// import MongoDB from 'mongodb';

import { CONFLICT, MISSING_DATA, NOT_FOUND } from '../constants/error';

// const { ObjectID } = MongoDB;

export default class Orders {
  defaultOrder = {
    _id: '1', // new ObjectID('62a78f1cab246a81fc27ef0a'),
    date: new Date(),
    location: 2,
    paidIn: 'cash',
    staffId: '1',
    products: [
      {
        productId: '2',
        name: 'Mocha',
        amount: 2,
        unitPrice: 2.0,
        total: 4.0,
      },
    ],
    total: 4.0,
  };

  async addOrder(orderData) {
    if (!orderData) {
      throw new Error(MISSING_DATA);
    }

    if (this.defaultOrder._id === orderData._id) {
      throw new Error(CONFLICT);
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

    console.log(`Saving ${orderId}`, orderData);
    return true;
  }
}
