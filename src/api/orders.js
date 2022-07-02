import express from 'express';
import Orders from '../services/orders';
import errorResponse from '../utils/errorResponse';

const { Router } = express;
const router = Router();

const orders = new Orders();

router.get('/', (req, res) => {
  res.json({
    hello: 'Hello from orders',
    availableMethods: ['GET /:id', 'POST /:id', 'PUT', 'DELETE /:id'],
  });
});

router.get('/:id', async (req, res) => {
  console.log(`GET ORDER ${req.params.id}`);

  try {
    const orderData = await orders.getOrders(req.params.id);
    return res.json({
      orders: orderData,
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Generic server error',
      message: err.message,
    });
  }
});

router.post('/:id', async (req, res) => {
  console.log('POST ORDER', req.body);

  try {
    await orders.addOrder({ _id: req.params.id, ...req.body });
    return res.json({
      ok: true,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.put('/:id?', async (req, res) => {
  console.log(`PUT ORDER ${req.params.id}`, req.body);

  try {
    await orders.updateOrder(req.params.id, req.body);
    return res.json({
      ok: true,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.delete('/:id', async (req, res) => {
  console.log(`DELETE ORDER ${req.params.id}`);

  try {
    await orders.deleteOrder(req.params.id);
    return res.json({
      ok: true,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

export default router;
