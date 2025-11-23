-- ==========================================
-- VERIFICACIÓN RÁPIDA DE DATOS
-- ==========================================

-- Verificar que las bases de datos existan
SHOW DATABASES LIKE 'jea%';

-- Verificar proveedores
USE jeaproveedor;
SELECT COUNT(*) as 'Proveedores Activos' FROM proveedor WHERE estado = true;
SELECT id, nombre, ruc FROM proveedor WHERE estado = true LIMIT 3;

-- Verificar formas de pago
USE jeapagos;
SELECT COUNT(*) as 'Formas de Pago' FROM forma_pago;
SELECT * FROM forma_pago LIMIT 5;

-- Verificar productos
USE jeacatalogo;
SELECT COUNT(*) as 'Productos Activos' FROM producto WHERE estado = true;
SELECT id, nombre, codigo FROM producto WHERE estado = true LIMIT 3;

-- Verificar compras existentes
USE jeacompra;
SELECT COUNT(*) as 'Compras Registradas' FROM compra;
SELECT id, serie, numero, proveedor_id, formapago_id, total FROM compra LIMIT 5;

-- ==========================================
-- RESULTADOS ESPERADOS
-- ==========================================
-- Proveedores Activos: 5
-- Formas de Pago: 8  
-- Productos Activos: 10
-- Compras: Puede variar
