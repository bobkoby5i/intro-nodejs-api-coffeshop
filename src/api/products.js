import express from 'express';
import Products from '../services/products';
import { CONFLICT, MISSING_DATA, NOT_FOUND } from '../constants/error';

const { Router } = express;
const router = Router();

const products = new Products();

// const onlyProduct = {
//   _id: '1',
//   name: 'Mocha',
//   brand: 'Bialetti',
//   available: 10,
//   lastOrderDate: new Date(),
//   unitPrice: 2.0,
//   supplierName: 'EuroKawexpol',
//   expirationDate: new Date(),
//   categories: ['coffee'],
// };

router.get('/', (req, res) => {
  res.json({
    hello: 'Hello from products',
    availableMethods: [
      'GET /:id',
      'POST /:id',
      'PUT',
      'DELETE /:id',
      'GET /availableProducts',
    ],
  });
});

router.get('/:id?', async (req, res) => {
  console.log(`GET PRODUCTS ${req.params.id}`);

  try {
    const productData = await products.getProducts(
      req.params.id,
      req.query.onlyAvailable
    );

    return res.json({
      products: productData,
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Generic server error',
      message: err.message,
    });
  }
});

router.post('/:id', async (req, res) => {
  console.log('POST PRODUCTS', req.body);

  try {
    await products.addProduct({ _id: req.params.id, ...req.body });
    return res.json({
      ok: true,
    });
  } catch (err) {
    switch (err.message) {
      case MISSING_DATA:
        return res.status(400).json({
          error: 'Missing input parameters',
        });
      case CONFLICT:
        return res.status(409).json({
          error: 'Resource already exists',
        });
      default:
        return res.status(500).json({
          error: 'Generic server error',
          message: err.message,
        });
    }
  }
});

router.put('/:id', async (req, res) => {
  console.log(`PUT PRODUCTS ${req.params.id}`, req.body);

  try {
    await products.updateProduct(req.params.id, req.body);
    return res.json({
      ok: true,
    });
  } catch (err) {
    switch (err.message) {
      case MISSING_DATA:
        return res.status(400).json({
          error: 'Missing input data',
        });
      case NOT_FOUND:
        return res.status(404).json({
          error: 'Order not found',
        });
      default:
        return res.status(500).json({
          error: 'Generic server error',
          message: err.message,
        });
    }
  }
});

router.delete('/:id', async (req, res) => {
  console.log(`DELETE PRODUCTS ${req.params.id}`);

  try {
    await products.deleteProduct(req.params.id);
    return res.json({
      ok: true,
    });
  } catch (err) {
    if (err.message === NOT_FOUND) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    return res.status(500).json({
      error: 'Generic server error',
      message: err.message,
    });
  }
});

export default router;
