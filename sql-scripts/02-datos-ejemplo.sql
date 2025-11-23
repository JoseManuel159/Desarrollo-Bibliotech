-- ==========================================
-- DATOS DE EJEMPLO PARA TESTING
-- Sistema de Ventas - Proveedores, Formas de Pago y Productos
-- ==========================================

-- ==========================================
-- PROVEEDORES DE EJEMPLO
-- ==========================================

USE jeaproveedor;

-- Insertar proveedores de ejemplo
INSERT INTO proveedor (ruc, nombre, telefono, direccion, correo, estado) VALUES
('20123456789', 'Distribuidora Los Andes SAC', '987654321', 'Av. Los Incas 123, Lima', 'ventas@losandes.com', true),
('20987654321', 'Comercial San Martín EIRL', '912345678', 'Jr. San Martín 456, Arequipa', 'comercial@sanmartin.com', true),
('20555666777', 'Importadora del Norte SRL', '998877665', 'Av. América Norte 789, Trujillo', 'info@norteimport.com', true),
('20333444555', 'Mayorista Central SAC', '955443322', 'Av. Colonial 321, Lima', 'mayorista@central.com', true),
('20111222333', 'Proveedor Cusco EIRL', '933221100', 'Av. El Sol 654, Cusco', 'ventas@cuscoprov.com', true);

-- Verificar inserción
SELECT * FROM proveedor WHERE estado = true;

-- ==========================================
-- FORMAS DE PAGO DE EJEMPLO
-- ==========================================

USE jeapagos;

-- Insertar formas de pago de ejemplo
INSERT INTO forma_pago (nombre) VALUES
('Efectivo'),
('Transferencia Bancaria'),
('Cheque'),
('Tarjeta de Crédito'),
('Tarjeta de Débito'),
('Depósito Bancario'),
('Letra de Cambio'),
('Pagaré');

-- Verificar inserción
SELECT * FROM forma_pago;

-- ==========================================
-- CATEGORÍAS Y PRODUCTOS DE EJEMPLO
-- ==========================================

USE jeacatalogo;

-- Insertar categorías de ejemplo
INSERT INTO categoria (nombre, descripcion, estado) VALUES
('Electrónicos', 'Productos electrónicos y tecnológicos', true),
('Oficina', 'Artículos de oficina y papelería', true),
('Hogar', 'Productos para el hogar', true),
('Construcción', 'Materiales de construcción', true),
('Alimentación', 'Productos alimenticios', true);

-- Insertar productos de ejemplo
INSERT INTO producto (codigo, nombre, descripcion, costo_compra, precio_venta, cantidad, categoria_id, estado, fecha_creacion) VALUES
('PROD001', 'Laptop HP Pavilion', 'Laptop HP Pavilion 15.6 pulgadas', 2500.00, 3200.00, 10, 1, true, NOW()),
('PROD002', 'Mouse Inalámbrico Logitech', 'Mouse inalámbrico con receptor USB', 45.00, 75.00, 50, 1, true, NOW()),
('PROD003', 'Papel Bond A4', 'Resma de papel bond A4 500 hojas', 12.00, 18.00, 100, 2, true, NOW()),
('PROD004', 'Silla Oficina Ergonómica', 'Silla ergonómica para oficina con respaldo alto', 280.00, 450.00, 25, 2, true, NOW()),
('PROD005', 'Microondas LG 20L', 'Horno microondas LG 20 litros', 320.00, 480.00, 15, 3, true, NOW()),
('PROD006', 'Cemento Portland', 'Saco de cemento Portland 42.5kg', 28.00, 35.00, 200, 4, true, NOW()),
('PROD007', 'Aceite Vegetal 1L', 'Aceite vegetal marca premium 1 litro', 8.50, 12.00, 80, 5, true, NOW()),
('PROD008', 'Teclado Mecánico RGB', 'Teclado mecánico gaming con iluminación RGB', 180.00, 280.00, 30, 1, true, NOW()),
('PROD009', 'Cuaderno Espiral A4', 'Cuaderno espiral 100 hojas cuadriculado', 6.00, 10.00, 150, 2, true, NOW()),
('PROD010', 'Taladro Percutor Bosch', 'Taladro percutor profesional 650W', 450.00, 680.00, 12, 4, true, NOW());

-- Verificar inserción
SELECT p.*, c.nombre as categoria_nombre 
FROM producto p 
JOIN categoria c ON p.categoria_id = c.id 
WHERE p.estado = true;

-- ==========================================
-- USUARIOS DE EJEMPLO (AUTENTICACIÓN)
-- ==========================================

USE jeaauth;

-- Insertar usuarios de ejemplo (contraseña: admin123)
INSERT INTO usuario (username, password, email, activo) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye0vVwOUFHLmM9jrLY7Dm3U5QFNuSTU1K', 'admin@sistema.com', true),
('vendedor', '$2a$10$N9qo8uLOickgx2ZMRZoMye0vVwOUFHLmM9jrLY7Dm3U5QFNuSTU1K', 'vendedor@sistema.com', true),
('compras', '$2a$10$N9qo8uLOickgx2ZMRZoMye0vVwOUFHLmM9jrLY7Dm3U5QFNuSTU1K', 'compras@sistema.com', true);

-- Verificar inserción
SELECT username, email, activo FROM usuario WHERE activo = true;

-- ==========================================
-- RESUMEN DE DATOS INSERTADOS
-- ==========================================

SELECT 'RESUMEN DE DATOS INSERTADOS:' as info;

SELECT 
    (SELECT COUNT(*) FROM jeaproveedor.proveedor WHERE estado = true) as proveedores_activos,
    (SELECT COUNT(*) FROM jeapagos.forma_pago) as formas_pago,
    (SELECT COUNT(*) FROM jeacatalogo.categoria WHERE estado = true) as categorias_activas,
    (SELECT COUNT(*) FROM jeacatalogo.producto WHERE estado = true) as productos_activos,
    (SELECT COUNT(*) FROM jeaauth.usuario WHERE activo = true) as usuarios_activos;

-- ==========================================
-- INSTRUCCIONES DE USO
-- ==========================================

SELECT 'DATOS DE EJEMPLO INSERTADOS EXITOSAMENTE' as resultado;
SELECT 'Ahora puedes probar el formulario de compras en http://localhost:4200' as instrucciones;
SELECT 'Credenciales: admin / admin123' as login;
