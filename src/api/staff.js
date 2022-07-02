import express from 'express';
import Staff from '../services/staff';
import { CONFLICT, MISSING_DATA, NOT_FOUND } from '../constants/error';

const { Router } = express;
const router = Router();

const staff = new Staff();

router.get('/', (req, res) => {
  res.json({
    hello: 'Hello from staff',
    availableMethods: ['GET /:id', 'POST /:id', 'PUT', 'DELETE /:id'],
  });
});

router.get('/:id', async (req, res) => {
  console.log(`GET STAFF ${req.params.id}`);

  // res.json({
  //   _id: '1',
  //   firstName: 'Jan',
  //   lastName: 'Kowalski',
  //   startedAt: new Date(),
  //   rating: 4.5,
  //   position: 'waiter',
  //   monthlySalary: 4000.0,
  // });
  try {
    const employeeData = await staff.getEmployee(req.params.id);

    return res.json({
      employees: employeeData,
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Generic server error',
      message: err.message,
    });
  }
});

router.post('/:id', async (req, res) => {
  console.log('POST STAFF', req.body);

  try {
    await staff.addEmployee({ _id: req.params.id, ...req.body });
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

router.put('/:id?', async (req, res) => {
  console.log(`PUT STAFF ${req.params.id}`, req.body);

  try {
    await staff.updateEmployee(req.params.id, req.body);
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
          error: 'Employee not found',
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
  console.log(`DELETE STAFF ${req.params.id}`);

  try {
    await staff.deleteEmployee(req.params.id);
    return res.json({
      ok: true,
    });
  } catch (err) {
    if (err.message === NOT_FOUND) {
      return res.status(404).json({
        error: 'Employee not found',
      });
    }

    return res.status(500).json({
      error: 'Generic server error',
      message: err.message,
    });
  }
});

export default router;
