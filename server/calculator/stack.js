module.exports = class Stack {

    constructor() {
        this.tokens = [];
    }

    length() {
        return this.tokens.length;
    }

    push(token) {
        this.tokens.push(token);
    }
    
    pop() {
        return this.tokens.pop();
    }

    empty() {
        return !this.tokens.length;
    }
    
    last() {
        return this.tokens[this.tokens.length-1];
    }

    map(cb) {
        return this.tokens.map(cb);
    }
};