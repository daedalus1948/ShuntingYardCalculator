// calculates the expression, if there is not a single number left, expression not valid

module.exports = class RPNEvaluator {

    static calculate(operator, a, b) {

        const table = {
            "+": (a,b)=>(a+b),
            "-": (a,b)=>(a-b),
            "/": (a,b)=>(a/b),
            "*": (a,b)=>(a*b),
            "^": (a,b)=>(a**b),
            "#": (a)=>(-a) // unary minus
        }
        return table[operator](a,b);
    }

    static eval(rpn) { // returns result object {status: "valid"|"invalid", result: int|null}

        let numberStack = [];

        let i = 0;
        while (i!=rpn.tokens.length) {
            if (rpn.tokens[i].type=="number") {
                numberStack.push(Number(rpn.tokens[i].value));
            }
            if (rpn.tokens[i].type=="operator") {
                let result;
                if (rpn.tokens[i].value=="#") { // unary operator
                    let operandSingle = numberStack.pop();
                    result = RPNEvaluator.calculate(rpn.tokens[i].value, operandSingle, "");
                }
                else { // binary operator
                    let operandRight = numberStack.pop();
                    let operandLeft = numberStack.pop();
                    result = RPNEvaluator.calculate(rpn.tokens[i].value, operandLeft, operandRight);
                }
                numberStack.push(result);
            }
            i++;
        }
        return numberStack[0]!==undefined ? {status:"valid", result: numberStack[0]} : {status:"invalid", result: null};
    }
}