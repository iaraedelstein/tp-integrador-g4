CREATE DATABASE IF NOT EXISTS Tp01;

USE Tp01;
DROP TABLE IF EXISTS libros;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS personas;

/*
De la persona a prestar los libros el nombre, apellido, email y alias. El email debe ser unico. 
Todos los datos son requeridos.
*/

CREATE TABLE personas (
id_persona int (11) AUTO_INCREMENT,
email varchar (100) ,
nombre varchar (100) NOT NULL,
apellido varchar (100) NOT NULL,
alias varchar (100) NOT NULL,
PRIMARY KEY (id_persona),
unique (email),
CONSTRAINT CHK_nombre CHECK (length(trim(nombre))>0),
CONSTRAINT CHK_apellido CHECK (length(trim(apellido))>0),
CONSTRAINT CHK_alias CHECK (length(trim(alias))>0)
);
DROP TRIGGER IF exists TRG_personas;

DELIMITER $$
CREATE TRIGGER TRG_personas_ins
BEFORE INSERT ON personas
FOR EACH ROW
BEGIN
  IF length(trim(NEW.nombre))=0
    THEN
      SET NEW.nombre = NULL;
  ELSEIF length(trim(NEW.apellido))=0
    THEN
      SET NEW.apellido = NULL;
   ELSEIF length(trim(NEW.alias))=0
    THEN
      SET NEW.alias = NULL;
  END IF;
END;
CREATE TRIGGER TRG_personas_upd
BEFORE UPDATE ON personas
FOR EACH ROW
BEGIN
  IF length(trim(NEW.nombre))=0
    THEN
      SET NEW.nombre = NULL;
  ELSEIF length(trim(NEW.apellido))=0
    THEN
      SET NEW.apellido = NULL;
   ELSEIF length(trim(NEW.alias))=0
    THEN
      SET NEW.alias = NULL;
  END IF;
END$$
DELIMITER ;	
	   
INSERT INTO personas (email ,nombre ,apellido ,alias) VALUES 
('mauroslopez@gmail.com','MAURO', 'LOPEZ', 'malop'),
('benicio@gmail.com','Benicio', 'Laudo', 'bencho'),
('ivan@gmail.com','Iván', 'Pérez', 'ivi')
;

/*
De los generos de los libros, solo los nombres, el campo nunca puede ser vacio o nulo 
y no pueden repetirse las categorias.
*/


CREATE TABLE categorias (
categoria varchar (100) ,
PRIMARY KEY (categoria)
);

INSERT INTO categorias (categoria) VALUES 
('Historia'),
('Novela'), 
('Cuentos'), 
('Ciencia ficción'),
('Relato')
;
/*
De los libros, el nombre, una descripcion, su categoria y la persona a la cual se le ha prestado el libro. 
Para representar que un libro se encuentra en la biblioteca se puede utilizar cualquiera de las siguientes 
estrategias: null para libros en la biblioteca en el campo de persona_id, que el usuario se encuentre ingresado 
como una persona mas.
*/

CREATE TABLE libros (
nombre varchar (100) ,
descripcion varchar (500) ,
categoria varchar (100) NOT NULL,
id_persona int (12),
PRIMARY KEY (nombre),
FOREIGN KEY (categoria) REFERENCES categorias (categoria),
FOREIGN KEY (id_persona) REFERENCES personas (id_persona)
);

INSERT INTO libros (nombre, descripcion, categoria,id_persona ) VALUES 
('El guardián entre el centeno','Una novela de viaje iniciático', 'Novela', '1'),
('Ficciones','Cuentos laberínticos', 'Cuentos', '2'),
('Crónicas marcianas','Transcurre en el momento en que la tierra conquista Merte', 'Ciencia ficción', NULL)
;
