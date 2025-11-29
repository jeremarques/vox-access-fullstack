@echo off
REM Script para iniciar o VoxAccess no Windows

echo Iniciando VoxAccess...
echo.

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Erro: Python nao encontrado. Instale Python 3.9+
    pause
    exit /b 1
)

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo Erro: Node.js nao encontrado. Instale Node.js 18+
    pause
    exit /b 1
)

REM Iniciar backend
echo Iniciando backend...
cd backend

REM Criar venv se nao existir
if not exist "venv" (
    echo Criando ambiente virtual...
    python -m venv venv
)

REM Ativar venv
call venv\Scripts\activate.bat

REM Instalar dependencias se necessario
if not exist "venv\.installed" (
    echo Instalando dependencias do backend...
    pip install -r requirements.txt
    type nul > venv\.installed
)

REM Iniciar backend
start "VoxAccess Backend" cmd /k "python main.py"

cd ..

timeout /t 3 /nobreak >nul

REM Iniciar frontend
echo Iniciando frontend...
cd frontend

REM Instalar dependencias se necessario
if not exist "node_modules" (
    echo Instalando dependencias do frontend...
    call npm install
)

REM Iniciar frontend
start "VoxAccess Frontend" cmd /k "npm run dev"

cd ..

echo.
echo VoxAccess esta rodando!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo.
echo Feche as janelas do terminal para parar os servidores
pause

