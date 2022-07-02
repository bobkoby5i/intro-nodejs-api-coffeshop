import express from 'express';
import Staff from '../services/staff';
import errorResponse from '../utils/errorResponse';

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
    return errorResponse(err, res);
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
    return errorResponse(err, res);
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
    return errorResponse(err, res);
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
    return errorResponse(err, res);
  }
});

export default router;
