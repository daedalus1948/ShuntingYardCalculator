const Stack = require('./stack.js');

// shunting yard algorithm (generic function support not implemented)
module.exports = class RPNBuilder { // Reverse polish notation

    static postfixNotation(tokenset) {

        let output = new Stack(); // result stack will contain postfix RPN tokenset
        let operators = new Stack(); // stack of operators
        
        for (let i = 0; i<tokenset.length; i++) {
            
            let currentToken = tokenset[i];

            if (currentToken.type == "number") {
                output.push(currentToken);
            }
            if (currentToken.type == "operator") {
                while ( // if left, pop operators of bigger|same precedence, if right pop operators of bigger precedence
                    (!operators.empty() && operators.last().type!=="parenthesis") && // only operators, no parentheses
                    ((operators.last().precedence >= currentToken.precedence && currentToken.associativity == "left") ||
                    (operators.last().precedence > currentToken.precedence && currentToken.associativity == "right"))
                ) {
                    output.push(operators.pop()); // pop the operators from the stack in a loop
                }
                operators.push(currentToken); // if/after the while loop is finished, add the current token
            }
            if (currentToken.type == "parenthesis") {
                if (currentToken.value == "(") {
                    operators.push(currentToken);
                }
                if (currentToken.value == ")") {
                    while (!operators.empty() && operators.last().value !== "(") {
                        output.push(operators.pop());
                    }
                    operators.pop(); // pop the encountered "("
                }
        
            }
        }
        while (!operators.empty()) { // pop the remaining operators, if any
            output.push(operators.pop());
        }
        return output;
    }

    static RPNstring(RPNarray) {
        return RPNarray.map((e)=>e.value).join('');
    }
}
