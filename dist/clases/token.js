"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
class Token {
    constructor() {
    }
    static getJwtToken(payload) {
        return jwt.sign({ usuario: payload }, this.seed, { expiresIn: this.caducidad });
    }
    static comprobarToken(userToken) {
        return new Promise((resolve, reject) => {
            jwt.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    reject();
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
Token.seed = 'seed-de-mi-test-backend';
Token.caducidad = '30d';
exports.default = Token;
