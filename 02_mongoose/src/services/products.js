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
} from '../db/products';

// import { PAGE_SIZE } from '../constants/db';

const productSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    brand: {
      required: true,
      type: String,
    },
    available: {
      required: true,
      type: Number,
    },
    lastOrderDate: {
      required: true,
      type: Date,
    },
    unitPrice: {
      required: true,
      type: Number,
    },
    supplierName: {
      required: true,
      type: String,
    },
    expirationDate: {
      required: true,
      type: Date,
    },
    categories: {
      type: [String],
      enum: ['coffee', 'food', 'accessories', 'equipment', 'premium'],
    },
  },
  { strict: 'throw' }
);

export const ProductModel = mongoose.model('Product', productSchema);

export default class Products {
  // idSchema = idSchema;

  defaultProduct = {
    _id: '62c1b7ba64a5c35a3c5abe3f',
    name: 'Mocha',
    brand: 'Bialetti',
    available: 10,
    lastOrderDate: new Date(),
    unitPrice: 2.0,
    supplierName: 'EuroKawexpol',
    expirationDate: new Date(),
    categories: ['coffee'],
  };

  async addProduct(productData) {
    if (!productData) {
      throw new Error(MISSING_DATA);
    }

    try {
      await ProductModel.validate(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    return addProduct(productData);
  }

  async deleteProduct(productId) {
    validateObjectId(productId);

    const deletedCount = await deleteProduct(productId);
    if (deletedCount === 0) {
      throw new Error(NOT_FOUND);
    }
    return true;
  }

  async getProduct(productId) {
    console.log(`Get product(${productId})`);
    validateObjectId(productId);

    const product = await getProduct(productId);
    if (!product) {
      throw new Error(NOT_FOUND);
    }
    return getProduct(productId);
  }

  async getProducts(productIds, additionalParams) {
    console.log(`Get products:`, productIds, additionalParams);
    return getProducts(productIds, additionalParams);
  }

  async updateProduct(productId, productData) {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
    if (!isValidObjectId) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = `Not a valid ID: ${productId}`;
      throw error;
    }

    // Throw when there is nothing to update
    if (!productData || Object.keys(productData).length === 0) {
      throw new Error(MISSING_DATA);
    }

    // eslint-disable-next-line no-param-reassign
    // productData._id = productId;
    try {
      // await this.productUpdateSchema.validateAsync(productData);
      await ProductModel.validate(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    console.log(`Saving ${productId}`, productData);
    return updateProduct(productId, productData);
  }
}
