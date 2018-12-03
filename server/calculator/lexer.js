// "#" unary minus, must not pop any operator from the stack (hence the abritrarily high precedence)

module.exports = class Lexer {
    
    static createToken(type, value) {
        
        let symbolSet = {
            "+": { type:"operator", precedence: 1, associativity: "left"},
            "-": { type:"operator", precedence: 1, associativity: "left"},
            "*": { type:"operator", precedence: 2, associativity: "left"},
            "/": { type:"operator", precedence: 2, associativity: "left"},
            "^": { type:"operator", precedence: 3, associativity: "right"},
            "#": { type:"operator", precedence: 999, associativity: "left"}, // unary minus
            "(": { type:"parenthesis", precedence: null, associativity: null},
            ")": { type:"parenthesis", precedence: null, associativity: null},
            "number": {type:"number", precedence: null, associativity: null}
        };

        if (symbolSet[type]) {
            let token = symbolSet[type];
            token.value = value;
            return token;
        }
        else {
            throw Error("symbolset does not support this token type!");
        }

    }
}

