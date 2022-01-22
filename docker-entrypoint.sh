#!/bin/sh

echo "Waiting for MongoDB to start..."
./wait-for mongo_db:27017 

echo "Starting the server..."
npm run start:dev