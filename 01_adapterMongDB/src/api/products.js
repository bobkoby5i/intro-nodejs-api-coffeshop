import express from 'express';
import Products from '../services/products';
import errorResponse from '../utils/errorResponse';

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

router.get('/', async (req, res) => {
  try {
    const productData = await products.getProducts({
      amountAtLeast: req.query.amountAtLeast,
      brand: req.query.brand,
      categories: req.query.categories,
      page: req.query.page,
    });

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

router.get('/all', async (req, res) => {
  try {
    const productData = await products.getProducts('all', {
      amountAtLeast: req.query.amountAtLeast,
      brand: req.query.brand,
      categories: req.query.categories,
      page: req.query.page,
    });

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

router.get('/:id?', async (req, res) => {
  console.log(`GET PRODUCT ${req.params.id}`);

  try {
    const productData = await products.getProduct(req.params.id);

    return res.json(productData);
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.post('/:id', async (req, res) => {
  const product = { ...req.body };
  console.log('POST PRODUCTS', req.body);

  try {
    const productId = await products.addProduct(product);
    return res.status(201).json({
      id: productId,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.put('/:id', async (req, res) => {
  console.log(`PUT PRODUCTS ${req.params.id}`, req.body);

  try {
    const updatedCount = await products.updateProduct(req.params.id, req.body);
    return res.status(200).json({
      updated: updatedCount,
    });
  } catch (err) {
    return errorResponse(err, res);
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
    return errorResponse(err, res);
  }
});

export default router;
