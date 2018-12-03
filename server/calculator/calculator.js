const Tokenizer = require('./tokenizer.js');
const validator = require('./validator.js');
const RPNBuilder = require('./rpnbuilder.js');
const RPNEvaluator = require('./rpnevaluator.js');

/*
    1) build a tokenSet out of a supplied string - "3    - 22 ( 7 * - 5) / ((2-3)*4)"
    2) validate the tokenSet so that it adheres to the rules of a simple arithmetic expression
    3) build a reverse polish postfix notation out of the valid tokenset
    4) evaluate the RPN tokenset to produce the correct result
*/

class Calculator {

    constructor(validator, tokenizer, parser, evaluator) {
        this.tokenizer = tokenizer;
        this.validator = validator;
        this.parser = parser;
        this.evaluator = evaluator;
    }

    calculate(expression) { // returns result object {result: "valid"|"invalid", value: int|null}
        let tokenSet = this.tokenizer.buildTokenSet(expression);
        this.validator(tokenSet); // throws
        let RPNrepresentation = this.parser.postfixNotation(tokenSet);
        let result = this.evaluator.eval(RPNrepresentation);
        return result;
    }  
}

module.exports = {
    RPNCalculator: new Calculator(validator, Tokenizer, RPNBuilder, RPNEvaluator),
    CalculatorConstructor: Calculator
};