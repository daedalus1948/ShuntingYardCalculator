const express = require('express');
const bodyParser = require('body-parser');
const { RPNCalculator } = require('./calculator/calculator.js');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => { // allow cors
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post('/calculate/', (req, res) => { // calculate whatever expression you receive
    let calculation;
    try {
        calculation = RPNCalculator.calculate(req.body.expression); // May be CPU intensive, consider using workers
        calculation.result = calculation.result.toString(); // if Infinity Object, then it needs to be stringified to 'Infinity'
    }
    catch (error) {
        calculation = {status: "invalid", result: null};
    }
    console.log(calculation);
    res.json({...calculation, expression: req.body.expression});
});

module.exports = app;