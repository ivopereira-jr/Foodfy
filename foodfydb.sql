/* 
caso for necessario 
DROP SCHEMA public CASCADE;
CREATE SCHEMA public; 
*/

CREATE DATABASE foodfy;

/* tables */
CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" INT,
  "title" TEXT,
  "ingredients" TEXT[],
  "steps" TEXT[],
  "information" TEXT,
  "created_at" TIMESTAMP DEFAULT (now()),
  "updated_at" TIMESTAMP DEFAULT (now())
);
/* Obs.: Você consegue armazenar vetores (arrays) no Postgres utilizando o [] no fim do campo. */

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "path" TEXT NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" INT REFERENCES recipes(id),
  "file_id" INT REFERENCES files(id)
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "created_at" TIMESTAMP DEFAULT (now()),
  "file_id" INT REFERENCES files(id)
);

-- create procedure
CREATE FUNCTION trigger_set_TIMESTAMP()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- auto updated_at recipes
CREATE TRIGGER set_TIMESTAMP
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_TIMESTAMP()


CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "reset_token" TEXT,
  "reset_token_expires" TEXT,
  "is_admin" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT(now()),
  "updated_at" TIMESTAMP DEFAULT(now())
);  

ALTER TABLE "recipes" ADD COLUMN user_id INT;

--forein key users / recipes
ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");


-- auto updated_at users
CREATE TRIGGER set_TIMESTAMP
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_TIMESTAMP()


/* express session */
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

/*--reset tables--*/
DELETE FROM recipe_files;
DELETE FROM recipes;
DELETE FROM chefs;
DELETE FROM users;
DELETE FROM session;
DELETE FROM files;


/*--restart sequence auto_increment from tables ids--*/
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
