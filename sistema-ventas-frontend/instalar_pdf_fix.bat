@echo off
echo ========================================
echo  SOLUCION PDF - LISTA DE COMPRAS
echo  Instalando dependencias necesarias...
echo ========================================
echo.

echo [1/3] Verificando Node.js y npm...
node --version
npm --version
echo.

echo [2/3] Instalando jsPDF...
npm install jspdf@^2.5.1
echo.

echo [3/3] Instalando dependencias del proyecto...
npm install
echo.

echo ========================================
echo  INSTALACION COMPLETADA
echo ========================================
echo.
echo Para ejecutar el proyecto:
echo   npm start
echo.
echo Para verificar que PDF funciona:
echo   1. Abrir http://localhost:4200
echo   2. Ir a Lista de Compras
echo   3. Buscar mensaje en consola:
echo      "✅ jsPDF disponible para generar PDFs"
echo.
echo Si hay problemas, revisar el archivo:
echo   PDF_FIX_README.md
echo.
pause
