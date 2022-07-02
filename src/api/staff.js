import express from 'express';

const { Router } = express;
const router = Router();

router.get('/', (req, res) => {
  res.json({
    hello: 'Hello from staff',
    availableMethods: ['GET /:id', 'POST /:id', 'PUT', 'DELETE /:id'],
  });
});

export default router;
