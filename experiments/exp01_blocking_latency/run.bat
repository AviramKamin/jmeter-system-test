@echo off

echo ========================================
echo Backend System Validation Lab
echo Experiment 01 - Blocking Latency
echo ========================================

echo.
echo [1/4] Starting backend API service...

start cmd /k "cd /d C:\Users\אבירם\Desktop\jmeter project && py services\api\app.py"

echo.
echo Waiting for backend startup...
timeout /t 5 >nul

echo.
echo [2/4] Running JMeter test plan...

cd /d C:\jmeter\bin

jmeter -n ^
-t "C:\Users\אבירם\Desktop\jmeter project\jmeter\testplans\blocking_latency_validation.jmx"
-l "C:\Users\אבירם\Desktop\jmeter project\jmeter\results\slow_only.jtl"

echo.
echo [3/4] Generating HTML report...

jmeter -g ^
"C:\Users\אבירם\Desktop\jmeter project\jmeter\results\slow_only.jtl" ^
-o ^
"C:\Users\אבירם\Desktop\jmeter project\jmeter\results\slow_only_report"

echo.
echo [4/4] Experiment completed.

echo.
echo Report location:
echo C:\Users\אבירם\Desktop\jmeter project\jmeter\results\slow_only_report\index.html

echo.
pause