import Joi from '@hapi/joi';
import {
  CONFLICT,
  MISSING_DATA,
  NOT_FOUND,
  VALIDATION_ERROR,
} from '../constants/error';
import { idSchema } from '../constants/validation';
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../db/products';

export default class Products {
  idSchema = idSchema;

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
    _id: this.idSchema.required(),
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

  addProductSchema = this.productSchema.keys({
    _id: Joi.any().strip().optional(),
  });

  async addProduct(productData) {
    if (!productData) {
      throw new Error(MISSING_DATA);
    }

    if (this.defaultProduct._id === productData._id) {
      throw new Error(CONFLICT);
    }

    try {
      await this.addProductSchema.validateAsync(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    return addProduct(productData);
  }

  async deleteProduct(productId) {
    try {
      await this.idSchema.validateAsync(productId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    const deletedCount = await deleteProduct(productId);
    if (deletedCount === 0) {
      throw new Error(NOT_FOUND);
    }
    return true;
  }

  async getProduct(productId) {
    try {
      await this.idSchema.validateAsync(productId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    console.log(`Get product`, productId);
    const product = await getProduct(productId);
    if (!product) {
      throw new Error(NOT_FOUND);
    }
    return getProduct(productId);
  }

  // eslint-disable-next-line class-methods-use-this
  async getProducts(productIds, additionalParams) {
    console.log(`Get products:`, productIds, additionalParams);
    return getProducts(productIds, additionalParams);
  }

  async updateProduct(productId, productData) {
    try {
      await this.idSchema.validateAsync(productId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    // Throw when there is nothing to update
    if (!productData || Object.keys(productData).length <= 1) {
      throw new Error(MISSING_DATA);
    }

    // eslint-disable-next-line no-param-reassign
    productData._id = productId;
    try {
      await this.productUpdateSchema.validateAsync(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    console.log(`Saving ${productId}`, productData);
    return updateProduct(productData);
  }
}
