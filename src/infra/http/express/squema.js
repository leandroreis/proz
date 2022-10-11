import Joi from 'joi';
import { isValid } from "@fnando/cpf";

const idParam = Joi.object({
  id: Joi.number().integer(),
});

const updateStudentBody = Joi.object({
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
      if (!isValid(value)) {
        throw new Error('the cpf is invalid');
      }
      return value;
    }),

  doc_rg: Joi.string()
    .pattern(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\-[0-9]{1}$/),

  birth_date: Joi.date()
    .less('now'),
});

export default {
  idParam,
  updateStudentBody
}