import { CONFLICT, MISSING_DATA, NOT_FOUND } from '../constants/error';

export default class Products {
  defaultProduct = {
    _id: '1',
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

    if (this.defaultProduct._id === productData._id) {
      throw new Error(CONFLICT);
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

    console.log(`Saving ${productId}`, productData);
    return true;
  }
}
