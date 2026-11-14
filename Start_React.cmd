@echo off
cd /d "%~dp0lab_2_react"
if not exist node_modules call npm.cmd ci
if errorlevel 1 goto finish
call npm.cmd run dev
:finish
pause
