/* eslint-disable class-methods-use-this */
import mongoose from 'mongoose';

import { MISSING_DATA, NOT_FOUND, VALIDATION_ERROR } from '../constants/error';
import { validateObjectId } from '../constants/validation';
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../models/products';

export default class Products {
  // defaultProduct = {
  //   _id: '62c1b7ba64a5c35a3c5abe3f',
  //   name: 'Mocha',
  //   brand: 'Bialetti',
  //   available: 10,
  //   lastOrderDate: new Date(),
  //   unitPrice: 2.0,
  //   supplierName: 'EuroKawexpol',
  //   expirationDate: new Date(),
  //   categories: ['coffee'],
  // };

  async addProduct(productData) {
    if (!productData) {
      throw new Error(MISSING_DATA);
    }

    try {
      return await addProduct(productData);
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

  async getProduct(productId) {
    console.log(`getProduct(${productId})`);
    validateObjectId(productId);

    const product = await getProduct(productId);
    if (!product) {
      throw new Error(NOT_FOUND);
    }
    return product;
  }

  async getProducts(productIds, additionalParams) {
    console.log(`getProducts():`, productIds, additionalParams);
    return getProducts(productIds, additionalParams);
  }

  async updateProduct(productId, productUpdData) {
    validateObjectId(productId);

    // Throw when there is nothing to update
    if (!productUpdData || Object.keys(productUpdData).length === 0) {
      throw new Error(MISSING_DATA);
    }

    try {
      return await updateProduct(productId, productUpdData);
    } catch (err) {
      if (err.name === 'ValidationError') {
        const error = new Error(VALIDATION_ERROR);
        error.reason = err.message;
        throw error;
      }      
      throw error;
    }    
  }

  async deleteProduct(productId) {
    validateObjectId(productId);
  
    const deletedCount = await deleteProduct(productId);
    if (deletedCount === 0) {
      throw new Error(NOT_FOUND);
    }
    return true;
  }
}

