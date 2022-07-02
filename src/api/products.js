import express from 'express';

const { Router } = express;
const router = Router();

const onlyProduct = {
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

router.get('/:id?', (req, res) => {
  console.log(`GET PRODUCTS ${req.params.id}`);

  res.json(onlyProduct);
});

router.post('/:id', (req, res) => {
  console.log('POST PRODUCTS', req.body);

  res.json({
    ok: true,
  });
});

router.put('/:id', (req, res) => {
  console.log(`PUT PRODUCTS ${req.params.id}`, req.body);

  res.json({
    ok: true,
  });
});

router.delete('/:id', (req, res) => {
  console.log(`DELETE PRODUCTS ${req.params.id}`);

  res.json({
    ok: true,
  });
});

export default router;
