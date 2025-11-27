CREATE DATABASE IF NOT EXISTS deudas_clientes
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE deudas_clientes;

CREATE TABLE deudas (
  id_deuda          VARCHAR(15)   NOT NULL,
  id_cliente        VARCHAR(15)   NOT NULL,
  nombre_cliente    VARCHAR(60)   NOT NULL,
  correo            VARCHAR(60)   NOT NULL,
  monto_deuda       DECIMAL(20,2) NOT NULL,
  fecha_vencimiento DATE          NOT NULL,
  PRIMARY KEY (id_deuda),
  INDEX idx_cliente (id_cliente),
  INDEX idx_fecha_venc (fecha_vencimiento)
);


USE deudas_clientes;
TRUNCATE TABLE deudas;
SELECT * FROM deudas;


