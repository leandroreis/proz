import express from 'express';
import path from 'path';
import { createValidator } from 'express-joi-validation';
import * as XLSX from 'xlsx/xlsx.mjs';
import fs from 'fs';

import db from '../../database/postgres.js';
import schema from './squema.js';

const router = express.Router();
const validator = createValidator();
XLSX.set_fs(fs);

// Show xlsx by id
// TODO: Incluir validação de params
router.get('/student/xlsx/:id', async (req, res, next) => {
  const id = req.params.id;
  const sql = "SELECT * FROM imports WHERE id = $1";
  const file = await db.oneOrNone(sql, [id]);

  if (!file) {
    return res.status(404).json({
      message: 'XLSX not found'
    });
  }

  res.json(file);
});

// Upload xlsx file
router.post('/student/xlsx', async (req, res, next) => {
  // TODO: Fazer validação com Joi
  if (!req.files) {
    return res.status(400).json({
      message: 'No file uploaded'
    });
  }

  // Save the file
  const fileName = process.hrtime.bigint() + '.xlsx';
  req.files.file.mv(path.join(process.env.UPLOADS_PATH, fileName));

  // Insert into database
  const sql = 'INSERT INTO imports (file_name) VALUES ($1) RETURNING id';
  const file = await db.one(sql, [fileName]);
  res.json({ id: file.id });
});

// List of students
router.get('/student', async (req, res, next) => {
  // TODO: Paginação
  const sql = "SELECT * FROM students";
  const list = await db.query(sql);
  res.json(list);
});

// Show student by id
// TODO: Incluir validação de params
router.get('/student/:id', async (req, res, next) => {
  const id = req.params.id;
  const sql = "SELECT * FROM students WHERE id = $1";
  const student = await db.oneOrNone(sql, [id]);

  if (!student) {
    return res.status(404).json({
      message: 'Student not found'
    });
  }

  res.json(student);
});

// Update student by id
// TODO: Converter erros no response em json
router.put(
  '/student/:id',
  validator.params(schema.idParam),
  validator.body(schema.updateStudentBody),
  async (req, res, next) => {
    const id = req.params.id;
    const sqlSelect = "SELECT * FROM students WHERE id = $1";
    const student = await db.oneOrNone(sqlSelect, [id]);

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    const sqlUpdate = `
      UPDATE students SET
        gender_id = $(gender_id),
        marital_status_id = $(marital_status_id),
        name = $(name),
        email = $(email),
        doc_cpf = $(doc_cpf),
        doc_rg = $(doc_rg),
        birth_date = $(birth_date),
        updated_at = NOW()
      WHERE id = $(id)
    `;
    await db.none(sqlUpdate, Object.assign({}, student, value));

    res.json({ id: id });
  }
);

// Delete student by id
// TODO: Incluir validação de params
router.delete('/student/:id', async (req, res, next) => {
  const id = req.params.id;
  const sql = "DELETE FROM students WHERE id = $1 RETURNING id";
  const student = await db.oneOrNone(sql, id);

  if (!student) {
    return res.status(404).json({
      message: 'Student not found'
    });
  }

  res.json({ id: id });
});

// TODO: Substituir por fila
router.get('/load', async (req, res, next) => {
  const sql = `
    SELECT
      id,
      file_name
    FROM imports 
    WHERE generated_at IS NULL
    ORDER BY created_at
    LIMIT 1
  `;
  const file = await db.oneOrNone(sql);

  if (!file) {
    return res.status(404).json({
      message: 'Import not found'
    });
  }

  var buf = XLSX.readFile(path.join(process.env.UPLOADS_PATH, file.file_name));
  res.send('ok')
});

export default router;


