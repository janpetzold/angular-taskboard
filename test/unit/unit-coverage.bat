@echo off

REM Windows script for running e2e tests
REM You have to run server and capture some browser first
REM
REM Requirements:
REM - NodeJS (http://nodejs.org/)
REM - Karma (npm install -g karma)
REM - Karma Coverage (npm install -g karma-coverage)

set BASE_DIR=%~dp0
set PHANTOMJS_BIN=C:\Users\jpetzold\AppData\Roaming\npm\node_modules\phantomjs\lib\phantom\phantomjs.exe
karma start "%BASE_DIR%\..\karma-unit-coverage.conf.js" %*
