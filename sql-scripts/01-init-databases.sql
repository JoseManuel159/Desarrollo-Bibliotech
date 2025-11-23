-- ==========================================
-- SCRIPT DE INICIALIZACIÓN - DOCKER MySQL
-- Sistema de Ventas - Creación de BDs e Datos Iniciales
-- ==========================================

-- Crear las bases de datos necesarias
CREATE DATABASE IF NOT EXISTS jeaauth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS jeacatalogo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS jeacliente CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS jesinventario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS jeaventa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS jeacompra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS jeapagos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS jeaproveedor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Mostrar las bases de datos creadas
SHOW DATABASES;

-- ==========================================
-- DATOS INICIALES PARA INVENTARIO
-- (Las tablas se crean automáticamente con JPA)
-- ==========================================

USE jesinventario;

-- Esperar a que JPA cree las tablas, luego insertar datos
-- (Este script se ejecuta al inicializar el contenedor MySQL)

-- ==========================================
-- DATOS INICIALES PARA CATÁLOGO
-- ==========================================

USE jeacatalogo;

-- Las tablas se crean automáticamente con JPA
-- Insertar categorías de ejemplo después de que se creen las tablas

-- ==========================================
-- CONFIGURACIÓN DE USUARIOS
-- ==========================================

-- Crear usuario específico para la aplicación (opcional)
-- CREATE USER 'ventasapp'@'%' IDENTIFIED BY 'ventasapp123';

-- Otorgar permisos a todas las bases de datos
-- GRANT ALL PRIVILEGES ON jeaauth.* TO 'ventasapp'@'%';
-- GRANT ALL PRIVILEGES ON jeacatalogo.* TO 'ventasapp'@'%';
-- GRANT ALL PRIVILEGES ON jeacliente.* TO 'ventasapp'@'%';
-- GRANT ALL PRIVILEGES ON jesinventario.* TO 'ventasapp'@'%';
-- GRANT ALL PRIVILEGES ON jeaventa.* TO 'ventasapp'@'%';
-- GRANT ALL PRIVILEGES ON jeacompra.* TO 'ventasapp'@'%';
-- GRANT ALL PRIVILEGES ON jeapagos.* TO 'ventasapp'@'%';
-- GRANT ALL PRIVILEGES ON jeaproveedor.* TO 'ventasapp'@'%';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- ==========================================
-- VERIFICACIÓN
-- ==========================================

SELECT 'Bases de datos creadas exitosamente para Sistema de Ventas' AS mensaje;
