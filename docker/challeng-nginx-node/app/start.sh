#!/bin/sh

npm install

dockerize -wait tcp://mysqldb:3306 -timeout 20s

npm run start
