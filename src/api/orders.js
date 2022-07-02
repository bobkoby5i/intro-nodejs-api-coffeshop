import express from 'express';

const { Router } = express;
const router = Router();

router.get('/', (req, res) => {
  res.json({
    hello: 'Hello from orders',
    availableMethods: ['GET /:id', 'POST /:id', 'PUT', 'DELETE /:id'],
  });
});

router.get('/', (req, res) => {
  res.json({
    availableMethods: ['GET /:id', 'POST /:id', 'PUT', 'DELETE /:id'],
  });
});

router.get('/:id', (req, res) => {
  console.log(`GET ORDER ${req.params.id}`);

  res.json({
    _id: '1',
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
  });
});

router.post('/:id', (req, res) => {
  console.log('POST ORDER', req.body);

  res.json({
    ok: true,
  });
});

router.put('/:id?', (req, res) => {
  console.log(`PUT ORDER ${req.params.id}`, req.body);

  res.json({
    ok: true,
  });
});

router.delete('/:id', (req, res) => {
  console.log(`DELETE ORDER ${req.params.id}`);

  res.json({
    ok: true,
  });
});

export default router;
