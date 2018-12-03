const assert = require('assert');

const Lexer = require('./lexer.js');
const Tokenizer = require('./tokenizer.js');
const validator = require('./validator.js');
const RPNBuilder = require('./rpnbuilder.js');
const RPNEvaluator = require('./rpnevaluator.js');
const { RPNCalculator } = require('./calculator.js');

const tester = (msg, fn) => {
    try {
        fn(); // throws error if assertion fails
        console.log('\x1b[32m%s\x1b[0m', `  ${msg} - OK`);
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', `  ${msg} - ERROR / actual:${error.actual} - expected:${error.expected}`);
    }
};

// TOKENIZER TEST SUITE
// check how many tokens are produced
console.log('\x1b[34m%s\x1b[0m', "TOKENIZER");

tester("number of expression tokens should be 19", ()=>{
    let sourceTest = "-( -3 + - 4.00 ) * ( -2 / -1 ) - -5 ";
    let result = Tokenizer.buildTokenSet(sourceTest);
    assert.equal(result.length, 19);
});

tester("number of expression tokens should be 1", ()=>{
    let sourceTest = "-"; 
    let result = Tokenizer.buildTokenSet(sourceTest);
    assert.equal(result.length, 1);
});

tester("number of expression tokens should be 6", ()=>{
    let sourceTest = "-4.2662562567+0/2"; 
    let result = Tokenizer.buildTokenSet(sourceTest);
    assert.equal(result.length, 6);
});
tester("number of expression tokens should be 18", ()=>{
    let sourceTest = "((((((3(3.22((((())))"; 
    let result = Tokenizer.buildTokenSet(sourceTest);
    assert.equal(result.length, 18);
});

tester("number of expression tokens should be 4", ()=>{
    let sourceTest = "----"; 
    let result = Tokenizer.buildTokenSet(sourceTest);
    assert.equal(result.length, 4);
});

tester("number of expression tokens should be 0", ()=>{
    let sourceTest = ""; 
    let result = Tokenizer.buildTokenSet(sourceTest);
    assert.equal(result.length, 0);
});

tester("Tokenizer should be called with default value of empty string", ()=>{
    let result = Tokenizer.buildTokenSet();
    return result;
});

// LEXER TEST SUITE
console.log('\x1b[34m%s\x1b[0m', "LEXER");

tester("Lexer produces a number token", ()=>{
    let token = Lexer.createToken("number", "1234.4224590");
    assert.equal(token.type, "number");
});

tester("Lexer produces an operator token", ()=>{
    let token = Lexer.createToken("*","*");
    assert.equal(token.type, "operator");
});

tester("Lexer produces a parenthesis token", ()=>{
    let token = Lexer.createToken("(","(");
    assert.equal(token.type, "parenthesis");
});

tester("Lexer does not recognize token and throws error", ()=>{
    assert.throws(()=>Lexer.createToken("|","|"));
});

//VALIDATOR SUITE
console.log('\x1b[34m%s\x1b[0m', "VALIDATOR");

tester("validator succesfully validates `-( -3 + - 40.0 ) * ( -2 / -1 ) - -5 + (-3)`",()=>{
    let source = "-( -3 + - 40.0 ) * ( -2 / -1 ) - -5 + (-3)";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.equal(validator(tokenSet), true);
});

tester("validator succesfully validates `-( -3 + - 57893.0/2*3 )`",()=>{
    let source = "-( -3 + - 57893.0/2*3 )";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.equal(validator(tokenSet), true);
});

tester("validator succesfully validates `-1`",()=>{
    let source = "-1";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.equal(validator(tokenSet), true);
});

tester("validator unsuccesfully validates empty input, throws error",()=>{
    let source = "";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.throws(()=>validator(tokenSet), {message:"no expression supplied"});
});

tester("validator detects parentheses unbalanced error 1",()=>{
    let source = "(";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.throws(()=>validator(tokenSet), {message:"parentheses balance error"});
});

tester("validator detects parentheses unbalanced error 2",()=>{
    let source = "(((((((()";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.throws(()=>validator(tokenSet), {message:"parentheses balance error"});
});

tester("validator detects unary operator error 1",()=>{
    let source = "-+";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.throws(()=>validator(tokenSet), {message:"unary operator error"});
});

tester("validator detects unary operator error 2",()=>{
    let source = "-";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.throws(()=>validator(tokenSet), {message:"unary operator error"});
});

tester("validator detects binary operator error",()=>{
    let source = "3+2-4/222-+9";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.throws(()=>validator(tokenSet), {message:"binary operator error"});
});

tester("validator accepts floating number",()=>{
    let source = "90.267262";
    let tokenSet = Tokenizer.buildTokenSet(source);
    validator(tokenSet);
});

tester("validator detects malformed floating number 1",()=>{
    let source = "4.222423.233.22";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.throws(()=>validator(tokenSet), {message:"malformed floating number"});
});

tester("validator detects malformed floating number 2",()=>{
    let source = ".9822";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.throws(()=>validator(tokenSet), {message:"malformed floating number"});
});

tester("validator detects malformed floating number 3",()=>{
    let source = "728937892.";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.throws(()=>validator(tokenSet), {message:"malformed floating number"});
});

tester("validator detects malformed floating number 4",()=>{
    let source = "22878293.7892.";
    let tokenSet = Tokenizer.buildTokenSet(source);
    assert.throws(()=>validator(tokenSet), {message:"malformed floating number"});
});

//RPNBuilder
console.log('\x1b[34m%s\x1b[0m', "RPNBUILDER");

tester("RPNBuilder builds a correct reverse polish notation 1",()=>{
    let source = "(7+2)/4*(8-2)";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let RPNstring = RPNBuilder.RPNstring(reversePolishNotation);
    assert.equal("72+4/82-*", RPNstring);
});

tester("RPNBuilder builds a correct reverse polish notation 2",()=>{
    let source = "(((((111/22*(3+2)/87.888*(8-(22-2)))))))";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let RPNstring = RPNBuilder.RPNstring(reversePolishNotation);
    assert.equal("11122/32+*87.888/8222--*", RPNstring);
});

tester("RPNBuilder builds a correct reverse polish notation 3",()=>{
    let source = "-(-3+-4)/(99*(22--6))/3/2/1-7-8--9";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let RPNstring = RPNBuilder.RPNstring(reversePolishNotation);
    assert.equal("3#4#+#99226#-*/3/2/1/7-8-9#-", RPNstring);
});

tester("RPNBuilder builds a correct reverse polish notation 4",()=>{
    let source = "((-( -3 + - 40.0 )) * ( -2 / -1 ) - -5 + (-3))";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let RPNstring = RPNBuilder.RPNstring(reversePolishNotation);
    assert.equal('3#40.0#+#2#1#/*5#-3#+', RPNstring);
});

tester("RPNBuilder builds a correct reverse polish notation 5",()=>{
    let source = "8 + 3 * 4 / 9 - 3 - 9 + 1000.7262 / 8 / 2 / 3 - 90 * 2";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let RPNstring = RPNBuilder.RPNstring(reversePolishNotation);
    assert.equal('834*9/+3-9-1000.72628/2/3/+902*-', RPNstring);
});

//RPNEVALUATOR
console.log('\x1b[34m%s\x1b[0m', "RPNEVALUATOR");

tester("RPNEvaluator correctly evaluates RPNstring 1",()=>{
    let source = "(7+2)/4*(8-2)";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let result = RPNEvaluator.eval(reversePolishNotation);
    assert.equal(eval(source), result.result);
});

tester("RPNEvaluator correctly evaluates RPNstring 2",()=>{
    let source = "2+2";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let result = RPNEvaluator.eval(reversePolishNotation);
    assert.equal(eval(source), result.result);
});


tester("RPNEvaluator correctly evaluates RPNstring 3",()=>{
    let source = "(((3/2+(1-77))-22)*3)-(3/3/3/2)+1-(-22)";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let result = RPNEvaluator.eval(reversePolishNotation);
    assert.equal(eval(source), result.result);
});

tester("RPNEvaluator correctly evaluates RPNstring 4",()=>{
    let source = "(-2*(-3/(4+1)*11.22)-0.8872)";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let result = RPNEvaluator.eval(reversePolishNotation);
    assert.equal(eval(source), result.result);
});

tester("RPNEvaluator correctly evaluates RPNstring 5",()=>{
    let source = "2^3";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let result = RPNEvaluator.eval(reversePolishNotation);
    assert.equal(eval(2**3), result.result);
});

tester("RPNEvaluator correctly evaluates RPNstring 6",()=>{
    let source = "2^2^3";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let result = RPNEvaluator.eval(reversePolishNotation);
    assert.equal(eval(2**2**3), result.result);
});

tester("RPNEvaluator correctly evaluates RPNstring 7",()=>{
    let source = "((1-3)*((2^2^3-77^2)/2-3*(-4^2)))";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let result = RPNEvaluator.eval(reversePolishNotation);
    assert.equal(eval(((1-3)*((2**2**3-77**2)/2-3*((-4)**2)))), result.result);
});

tester("RPNEvaluator correctly evaluates RPNstring 8",()=>{
    let source = "-3^3";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let result = RPNEvaluator.eval(reversePolishNotation);
    assert.equal(eval((-3)**3), result.result);
});

tester("RPNEvaluator correctly evaluates RPNstring 9",()=>{
    let source = "-3^3^2^2^2-3^2";
    let tokenset = Tokenizer.buildTokenSet(source);
    let reversePolishNotation = RPNBuilder.postfixNotation(tokenset);
    let result = RPNEvaluator.eval(reversePolishNotation);
    assert.equal(eval((-3)**3**2**2**2-3**2), result.result);
});

//Calculator
console.log('\x1b[34m%s\x1b[0m', "RPNCALCULATOR");


tester("RPNCalculator throws no expression supplied error with undefined argument",()=>{
    assert.throws(()=>RPNCalculator.calculate(undefined), {message:"no expression supplied"});
});

tester("RPNCalculator throws no expression supplied error",()=>{
    assert.throws(()=>RPNCalculator.calculate(""), {message:"no expression supplied"});
});

tester("RPNCalculator throws parentheses balance error",()=>{
    assert.throws(()=>RPNCalculator.calculate("    (  "), {message:"parentheses balance error"});
    assert.throws(()=>RPNCalculator.calculate("   ( (  "), {message:"parentheses balance error"});
    assert.throws(()=>RPNCalculator.calculate("  (())  (  "), {message:"parentheses balance error"});
    assert.throws(()=>RPNCalculator.calculate("    )  "), {message:"parentheses balance error"});
});

tester("RPNCalculator throws malformed floating number error", ()=>{
    assert.throws(()=>RPNCalculator.calculate("    .2112 "), {message:"malformed floating number"});
    assert.throws(()=>RPNCalculator.calculate(" 221..29820 "), {message:"malformed floating number"});
    assert.throws(()=>RPNCalculator.calculate("    45522. "), {message:"malformed floating number"});
    assert.throws(()=>RPNCalculator.calculate("    2.8789.2.2 "), {message:"malformed floating number"});

});

tester("RPNCalculator throws operator error",()=>{
    assert.throws(()=>RPNCalculator.calculate("   +  "), {message:"binary operator error"});
    assert.throws(()=>RPNCalculator.calculate("   ++ "), {message:"binary operator error"});
    assert.throws(()=>RPNCalculator.calculate(" -/*  "), {message:"unary operator error"});
    assert.throws(()=>RPNCalculator.calculate("  2+3-  "), {message:"binary operator error"});
});

tester("RPNCalculator calculates a correct result 1",()=>{
    let source = "       ( - 2     + 3/3/  3 /3/3/2 ^ 4 - ( - 22 + (1-77.2753672))    )";
    assert.equal(eval(       ( - 2     + 3/3/  3 /3/3/2 ** 4 - ( - 22 + (1-77.2753672))    )), RPNCalculator.calculate(source).result);
});

tester("RPNCalculator calculates a correct result 2",()=>{
    let source = "-3^3^2^2^2-3^2";
    assert.equal(eval((-3)**3**2**2**2-3**2), RPNCalculator.calculate(source).result);
});

tester("RPNCalculator calculates a correct result 3",()=>{
    let source = "(((-4*2/11.2424/88.22)-7)   -9.082222^  2)";
    assert.equal(eval((((-4*2/11.2424/88.22)-7)   -9.082222**  2)), RPNCalculator.calculate(source).result);
});

tester("RPNCalculator calculates a correct result 3",()=>{
    let source = "10 - 10";
    assert.equal(eval(10 - 10), RPNCalculator.calculate(source).result);
});



