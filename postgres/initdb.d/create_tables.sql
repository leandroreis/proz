DROP TABLE IF EXISTS "imports";
DROP TABLE IF EXISTS "genders";
DROP TABLE IF EXISTS "marital_statuses";
DROP TABLE IF EXISTS "students";

CREATE TABLE "imports" (
  "id" SERIAL PRIMARY KEY,
  "file_name" varchar(10) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "generated_success" BOOLEAN,
  "generated_at" TIMESTAMP
);

CREATE TABLE "genders" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(20) NOT NULL
);

CREATE TABLE "marital_statuses" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(20) NOT NULL
);

CREATE TABLE "students" (
  "id" SERIAL PRIMARY KEY,
  "import_id" INT NOT NULL,
  "gender_id" INT NOT NULL,
  "marital_status_id" INT NOT NULL,
  "name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "doc_cpf" varchar(14) NOT NULL,
  "doc_rg" varchar(10) NOT NULL,
  "birth_date" DATE NOT NULL,
  "updated_at" TIMESTAMP,

  CONSTRAINT "fk_import"
  FOREIGN KEY("import_id") 
  REFERENCES "imports"("id"),

  CONSTRAINT "fk_gender"
  FOREIGN KEY("gender_id") 
  REFERENCES "genders"("id"),

  CONSTRAINT "fk_marital_status"
  FOREIGN KEY("marital_status_id") 
  REFERENCES "marital_statuses"("id")
);