"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("./errorHandler");
const authenticate = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.token;
        let token;
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        else if (cookieToken) {
            token = cookieToken;
        }
        if (!token) {
            throw new errorHandler_1.AppError('Authentication required', 401);
        }
        req.user = (0, jwt_1.verifyToken)(token);
        next();
    }
    catch {
        next(new errorHandler_1.AppError('Invalid or expired token', 401));
    }
};
exports.authenticate = authenticate;
