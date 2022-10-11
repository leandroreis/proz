import express from 'express';
import path from 'path';
import Joi from 'joi';
import * as cpf from "@fnando/cpf";

import db from '../../database/postgres.js'

const router = express.Router();

router.get('/student/xlsx/:id', async (req, res, next) => {
  const id = req.params.id;
  const sql = "select * from imports where id = $1";
  const file = await db.oneOrNone(sql, [id]);

  if (!file) {
    return res.status(404).json({
      message: 'XLSX not found'
    });
  }

  res.json(file);
});

router.post('/student/xlsx', async (req, res, next) => {
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

router.get('/student', async (req, res, next) => {
  const sql = "select * from students";
  const result = await db.query(sql, []);
  res.json(result);
});

router.get('/student/:id', async (req, res, next) => {
  const id = req.params.id;
  const sql = "select * from students where id = $1";
  const student = await db.oneOrNone(sql, [id]);

  if (!student) {
    return res.status(404).json({
      message: 'Student not found'
    });
  }

  res.json(student);
});

// PUT /api/v1/student/:id
router.put('/student/:id', async (req, res, next) => {
  const schema = Joi.object({
    gender_id: Joi.string()
      .allow('Masculino', 'Feminino'),

    marital_status_id: Joi.string()
      .allow('SOLTEIRO(A)', 'CASADO(A)'),

    name: Joi.string()
      .alphanum()
      .min(3)
      .max(255),

    email: Joi.string()
      .max(255)
      .email(),

    doc_cpf: Joi.string()
      .pattern(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/)
      .custom((value, helpers) => {
        if (!cpf.isValid(value)) {
          throw new Error('the cpf is invalid');
        }
        return value;
      }),

    doc_rg: Joi.string()
      .pattern(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\-[0-9]{1}$/),

    birth_date: Joi.date()
      .less('now'),
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(404).json(error.details);
  }

  const id = req.params.id;
  const sqlSelect = "select * from students where id = $1";
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
});

// DELETE /api/v1/student/:id
router.delete('/student/:id', async (req, res, next) => {
  const id = req.params.id;
  res.json('DELETE /student/:id ' + id);
});

export default router;


