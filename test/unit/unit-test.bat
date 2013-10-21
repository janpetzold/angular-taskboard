@echo off

REM Windows script for running unit tests
REM
REM Requirements:
REM - NodeJS (http://nodejs.org/)
REM - Karma (npm install -g karma)
REM - PhantomJS (npm install -g phantomjs)

set BASE_DIR=%~dp0
set PHANTOMJS_BIN=C:\Users\jpetzold\AppData\Roaming\npm\node_modules\phantomjs\lib\phantom\phantomjs.exe
karma start "%BASE_DIR%\..\karma-unit.conf.js" %*
