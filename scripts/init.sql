-- CREATE
CREATE DATABASE IF NOT EXISTS bookshare_db;
USE bookshare_db;
DROP TABLE IF EXISTS libro;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS persona;

-- PERSONA
CREATE TABLE persona (
  id int (11) PRIMARY KEY AUTO_INCREMENT,
  email varchar (100) NOT NULL unique,
  nombre varchar (255) NOT NULL,
  apellido varchar (255) NOT NULL,
  alias varchar (100) NOT NULL,
  CONSTRAINT CHK_nombre CHECK (length(trim(nombre)) > 0),
  CONSTRAINT CHK_apellido CHECK (length(trim(apellido)) > 0),
  CONSTRAINT CHK_alias CHECK (length(trim(alias)) > 0)
);

INSERT INTO persona (email, nombre, apellido, alias)
VALUES (
    'MAURO.LOPEZ@GMAIL.COM',
    'MAURO',
    'LOPEZ',
    'MAURO.LOPEZ'
  ),
  (
    'BENICIO.LAUDO@GMAIL.COM',
    'BENICIO',
    'LAUDO',
    'BENICIO.LAUDO'
  ),
  (
    'IVAN.PEREZ@GMAIL.COM',
    'IVAN',
    'PEREZ',
    'IVAN.PEREZ'
  );

-- CATEGORIAS
CREATE TABLE categoria (
  id int (11) PRIMARY KEY AUTO_INCREMENT,
  nombre varchar (255) NOT NULL unique
);

INSERT INTO categoria (nombre)
VALUES ('AVENTURA'),
  ('POLICIAL'),
  ('CIENCIA FICCION');

-- LIBROS
CREATE TABLE libro (
  id int (11) PRIMARY KEY AUTO_INCREMENT,
  nombre varchar (255) NOT NULL,
  descripcion varchar (500) NOT NULL,
  id_categoria int (11) NOT NULL,
  id_persona int (11),
  FOREIGN KEY (id_categoria) REFERENCES categoria (id),
  FOREIGN KEY (id_persona) REFERENCES persona (id)
);

INSERT INTO libro (nombre, descripcion, id_categoria, id_persona)
VALUES (
    'LOS TRES MOSQUETEROS',
    'NOVELA DEL ESCRITOR ALEJANDRO DUMAS',
    1,
    1
  ),
  ('ESTUDIO EN ESCARLATA',
   'NOVELA DE MISTERIO ESCRITA POR ARCHUR CONAN DOYLE', 2, 2),
  (
    'CRÓNICAS MARCIANAS',
    'LIBRO DE RAY BRADBURY. NARRA LA LLEGADA A MARTE Y LA COLONIZACIÓN DEL PLANETA',
    3,
    NULL
  );

/*
-- DROP TRIGGER IF exists TRG_personas;
 DELIMITER $$
 CREATE TRIGGER TRG_personas_ins
 BEFORE INSERT ON persona
 FOR EACH ROW
 BEGIN
 IF length(trim(NEW.nombre))=0
 THEN
 SET NEW.nombre = "sin_nombre";
 ELSEIF length(trim(NEW.apellido))=0
 THEN
 SET NEW.apellido = "sin_apellido";
 ELSEIF length(trim(NEW.alias))=0
 THEN
 SET NEW.alias = "sin_alias";
 END IF;
 END;
 
 CREATE TRIGGER TRG_personas_upd
 BEFORE UPDATE ON persona
 FOR EACH ROW
 BEGIN
 IF length(trim(NEW.nombre))=0
 THEN
 SET NEW.nombre = "sin_nombre";
 ELSEIF length(trim(NEW.apellido))=0
 THEN
 SET NEW.apellido = "sin_apellido";
 ELSEIF length(trim(NEW.alias))=0
 THEN
 SET NEW.alias = "sin_alias";
 END IF;
 END$$
 DELIMITER ;	
 */