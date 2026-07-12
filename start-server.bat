@echo off
echo 🚀 Запуск Jurassic Excel сервера...
echo.
echo 📁 Папка: %cd%
echo.
echo 🌐 Сервер будет доступен по адресу: http://localhost:8000
echo.
echo ⏹️  Для остановки нажми Ctrl+C
echo.
echo ========================================
echo.

python -m http.server 8000

pause
