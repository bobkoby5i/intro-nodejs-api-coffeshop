import Joi from '@hapi/joi';
import {
  CONFLICT,
  MISSING_DATA,
  NOT_FOUND,
  VALIDATION_ERROR,
} from '../constants/error';
import { idSchema } from '../constants/validation';

export default class Products {
  defaultProduct = {
    _id: '123123123123123123123123',
    name: 'Mocha',
    brand: 'Bialetti',
    available: 10,
    lastOrderDate: new Date(),
    unitPrice: 2.0,
    supplierName: 'EuroKawexpol',
    expirationDate: new Date(),
    categories: ['coffee'],
  };

  productUpdateSchema = Joi.object().keys({
    _id: idSchema.required(),
    name: Joi.string(),
    brand: Joi.string(),
    available: Joi.number(),
    lastOrderDate: Joi.date(),
    unitPrice: Joi.number(),
    supplierName: Joi.string().required(),
    expirationDate: Joi.date(),
    categories: Joi.array().items(
      Joi.string().valid('coffee'),
      Joi.string().valid('food'),
      Joi.string().valid('accessories'),
      Joi.string().valid('equipment'),
      Joi.string().valid('premium')
    ),
  });

  productSchema = this.productUpdateSchema.options({ presence: 'required' });

  async addProduct(productData) {
    if (!productData) {
      throw new Error(MISSING_DATA);
    }

    if (this.defaultProduct._id === productData._id) {
      throw new Error(CONFLICT);
    }

    try {
      await this.productSchema.validateAsync(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    return true;
  }

  async deleteProduct(productId) {
    if (this.defaultProduct._id === productId) {
      console.log(`Deleting ${productId}`);
      return true;
    }

    throw new Error(NOT_FOUND);
  }

  async getProducts(productId, onlyAvailable = false) {
    console.log(`Get products`, productId, onlyAvailable);
    if (!productId) {
      return this.defaultProduct;
    }

    return onlyAvailable ? [] : [this.defaultProduct];
  }

  async updateProduct(productId, productData) {
    if (!productId || !productData) {
      throw new Error(MISSING_DATA);
    }

    if (this.defaultProduct._id !== productId) {
      throw new Error(NOT_FOUND);
    }

    try {
      await this.productUpdateSchema.validateAsync(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    console.log(`Saving ${productId}`, productData);
    return true;
  }
}
