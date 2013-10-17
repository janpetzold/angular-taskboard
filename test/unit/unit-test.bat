@echo off

REM Windows script for running e2e tests
REM You have to run server and capture some browser first
REM
REM Requirements:
REM - NodeJS (http://nodejs.org/)
REM - Karma (npm install -g karma)

set BASE_DIR=%~dp0
set CHROME_BIN=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
set PHANTOMJS_BIN=C:\Users\jpetzold\AppData\Roaming\npm\node_modules\phantomjs\lib\phantom\phantomjs.exe
karma start "%BASE_DIR%\..\karma-unit.conf.js" %*
