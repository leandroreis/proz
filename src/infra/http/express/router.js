import express from 'express';
import path from 'path';

import db from '../../database/postgres.js'

const router = express.Router();

router.get('/student/xlsx/:id', async (req, res, next) => {
  const id = req.params.id;
  const sql = "select * from imports where id = $1";
  const result = await db.oneOrNone(sql, [id]);

  if (!result) {
    return res.status(404).send({
      message: 'XLSX not found'
    });
  }

  res.json(result);
});

router.post('/student/xlsx', async (req, res, next) => {
  if (!req.files) {
    return res.status(400).send({
      message: 'No file uploaded'
    });
  }

  // Save the file
  const fileName = process.hrtime.bigint() + '.xlsx';
  req.files.file.mv(path.join(process.env.UPLOADS_PATH, fileName));

  // Insert into database
  const sql = 'INSERT INTO imports (file_name) VALUES ($1) RETURNING id';
  const result = await db.one(sql, [fileName]);

  res.send({
    id: result.id
  });
});

router.get('/student', async (req, res, next) => {
  const sql = "select * from students";
  const result = await db.query(sql, []);
  res.json(result);
});

router.get('/student/:id', async (req, res, next) => {
  const id = req.params.id;
  const sql = "select * from students where id = $1";
  const result = await db.oneOrNone(sql, [id]);

  if (result === null) {
    return res.status(404).send({
      message: 'Student not found'
    });
  }

  res.json(result);
});

// PUT /api/v1/student/:id
router.put('/student/:id', async (req, res, next) => {
  const id = req.params.id;
  res.send('PUT /student/:id ' + id);
});

// DELETE /api/v1/student/:id
router.delete('/student/:id', async (req, res, next) => {
  const id = req.params.id;
  res.send('DELETE /student/:id ' + id);
});

export default router;
