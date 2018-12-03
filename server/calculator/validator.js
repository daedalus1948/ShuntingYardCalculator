// validator should probably return all the error messages in an array in the future

module.exports = function validator(src) { // accepts a list of tokens from the tokenset
    // if empty src string
    if (src.length == 0) {
        throw new Error("no expression supplied");
    }
    // round 1 check - balanced parenthesis (if balanced RPN cannot produce an expression containing them)
    let open = 0;
    let close = 0;
    for (let i = 0; i<src.length; i++) {
        if (src[i].value == "(") { open += 1; }
        if (src[i].value == ")") { close += 1; }
    }

    if (open != close) {
        throw new Error("parentheses balance error");
    }
    // round 2 operator check (check if binary operator has two operands around, and unary on the left)
    for (let i = 0; i<src.length; i++) {
        if (src[i].type =="operator") { // if operators
            if (src[i].value == "#") { // if unary operator check
                if (!src[i+1] || !["number", "parenthesis"].includes(src[i+1].type)) { // if following is undefined or not number/parenthesis
                    throw new Error("unary operator error");
                }
            }
            else if ( // else binary operator
                (i==0||i==src.length-1) || // binary operator cannot start nor end an expression
                !["number", "parenthesis"].includes(src[i-1].type) || // if previous is not a number/parenthesis
                !["number", "parenthesis"].includes(src[i+1].type) && src[i+1].value !== "#" ) { // if following is not number/parenthesis/unary-minus
                    throw new Error("binary operator error");
            }
        }
    }
    // round 3 check numbers floats
    for (let i = 0; i<src.length; i++) {
        if (src[i].type =="number") {
            let dots = 0;
            for (let h = 0; h<src[i].value.length; h++) {
                if (src[i].value[h]==".") {
                    dots++;
                    if (dots > 1 || h==0 || h==src[i].value.length-1) { // if more dots than one or if the number starts or ends with dots, throw error
                        throw new Error("malformed floating number");
                    }
                }
            }
        }
    }
    return true;
}

