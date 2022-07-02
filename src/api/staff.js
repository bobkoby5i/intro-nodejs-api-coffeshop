import express from 'express';

const { Router } = express;
const router = Router();

router.get('/', (req, res) => {
  res.json({
    hello: 'Hello from staff',
    availableMethods: ['GET /:id', 'POST /:id', 'PUT', 'DELETE /:id'],
  });
});

router.get('/:id', (req, res) => {
  console.log(`GET STAFF ${req.params.id}`);

  res.json({
    _id: '1',
    firstName: 'Jan',
    lastName: 'Kowalski',
    startedAt: new Date(),
    rating: 4.5,
    position: 'waiter',
    monthlySalary: 4000.0,
  });
});

router.post('/:id', (req, res) => {
  console.log('POST STAFF', req.body);

  res.json({
    ok: true,
  });
});

router.put('/:id?', (req, res) => {
  console.log(`PUT STAFF ${req.params.id}`, req.body);

  res.json({
    ok: true,
  });
});

router.delete('/:id', (req, res) => {
  console.log(`DELETE STAFF ${req.params.id}`);

  res.json({
    ok: true,
  });
});

export default router;
