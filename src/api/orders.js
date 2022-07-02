import express from 'express';
import Orders from '../services/orders';
import { CONFLICT, MISSING_DATA, NOT_FOUND } from '../constants/error';

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
    switch (err.message) {
      case MISSING_DATA:
        return res.status(400).json({
          error: 'Missing input parameters',
        });
      case CONFLICT:
        return res.status(409).json({
          error: 'Order already exists',
        });
      default:
        return res.status(500).json({
          error: 'Generic server error',
          message: err.message,
        });
    }
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
  console.log(`DELETE ORDER ${req.params.id}`);

  try {
    await orders.deleteOrder(req.params.id);
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
