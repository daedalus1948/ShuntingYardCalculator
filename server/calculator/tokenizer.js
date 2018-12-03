const Lexer = require('./lexer.js');

module.exports = class Tokenizer {

    static buildTokenSet(exp = "") {
        let tokens = [];
        let number = '';

        for (let i = 0; i<exp.length; i++) {
            if (["+", "-", "*", "/", "^", "(", ")"].includes(exp[i])) {
                if (number) { // we have finished building the number, add it to stack
                    tokens.push(Lexer.createToken("number", number)); 
                    number = ''; // restart number
                }
                // check if unary minus is at the beginning of the expression or operators precede unary minus (with the exception of closing bracket)
                if (exp[i]=="-" && (tokens.length==0 || ((tokens.length) && ["+", "-", "*", "/", "^", "("].includes(tokens[tokens.length-1].value)))) {
                    tokens.push(Lexer.createToken("#", "#")); // unary minus adition
                }
                else { // binary operator
                    tokens.push(Lexer.createToken(exp[i], exp[i]));
                }
            }
            if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."].includes(exp[i])) {
                number += exp[i]; // build number
            }
        }
        if (number) { // if there is a number left, add it to the end
            tokens.push(Lexer.createToken("number", number)); 
        }
        return tokens;
    }
}
