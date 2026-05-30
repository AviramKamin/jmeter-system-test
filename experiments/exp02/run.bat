@echo off
setlocal

echo ========================================
echo Backend System Validation Lab
echo Experiment 02 - Retry Amplification
echo ========================================

set PROJECT_ROOT=C:\Users\אבירם\Desktop\jmeter project
set JMETER_BIN=C:\jmeter\bin
set TEST_PLAN=%PROJECT_ROOT%\jmeter\testplans\retry_amplification_validation.jmx
set RESULT_FILE=%PROJECT_ROOT%\jmeter\results\retry_amplification.jtl
set REPORT_DIR=%PROJECT_ROOT%\jmeter\results\retry_amplification_report

echo.
echo [1/5] Starting backend API service...

start "Backend API" cmd /k "cd /d "%PROJECT_ROOT%" && py services\api\app.py"

echo.
echo Waiting for backend startup...
timeout /t 5 >nul

echo.
echo [2/5] Checking backend health...

powershell -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:5000/health' -UseBasicParsing | Out-Null; exit 0 } catch { exit 1 }"

if errorlevel 1 (
    echo Backend health check failed.
    echo Make sure Flask started correctly.
    pause
    exit /b 1
)

echo Backend is healthy.

echo.
echo [3/5] Removing previous report directory if it exists...

if exist "%REPORT_DIR%" (
    rmdir /S /Q "%REPORT_DIR%"
)

echo.
echo [4/5] Running JMeter retry amplification validation...

cd /d "%JMETER_BIN%"

jmeter -n ^
-t "%TEST_PLAN%" ^
-l "%RESULT_FILE%"

if errorlevel 1 (
    echo JMeter execution failed.
    pause
    exit /b 1
)

echo.
echo [5/5] Generating HTML report...

jmeter -g "%RESULT_FILE%" -o "%REPORT_DIR%"

if errorlevel 1 (
    echo Report generation failed.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Experiment 02 completed successfully.
echo ========================================

echo.
echo Result file:
echo %RESULT_FILE%

echo.
echo HTML report:
echo %REPORT_DIR%\index.html

echo.
pause
endlocal