-- eliminamos la base actual (si existe)
DROP DATABASE IF EXISTS base_nest_bd;

-- creamos la nueva base
CREATE DATABASE base_nest_bd ENCODING 'UTF-8';

-- configuramos la zona horaria (solo es necesario si utilizamos docker)
ALTER ROLE postgres SET TIMEZONE TO 'America/La_Paz';

-- nos conectamos a la nueva base
\c base_nest_bd;

-- creamos los esquemas correspondientes
CREATE SCHEMA proyecto;
CREATE SCHEMA usuarios;
CREATE SCHEMA parametricas;
