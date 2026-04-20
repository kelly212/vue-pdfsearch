@echo off

REM Descobre o PID usando a porta 60580
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :60580') do (
    echo Matando PID %%a na porta 60580
    taskkill /F /PID %%a >nul 2>&1
)

REM Limpa o lixo do Netlify
call rmdir /s /q .netlify

REM Builda
call npm run build

REM Sobe o dev
call npx netlify dev --dir=dist --port=60580
