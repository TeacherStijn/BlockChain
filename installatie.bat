echo Dit script PER server uitvoeren! (vanuit de /server directory)
pause
npm cache clean
npm init
echo PACKAGE.json entry adden onder "scripts":
echo "start": "node --use_strict src/app/server.js --port 8001",
pause
npm install express body-parser cors crypto-js mongodb mongoose --save