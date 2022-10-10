import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('ok');
});

// POST /api/v1/student/xls
// GET /api/v1/student/xls/{id}

// GET /api/v1/student
// GET /api/v1/student/{id}
// PUT /api/v1/student/{id}
// DELETE /api/v1/student/{id}

export default router;
