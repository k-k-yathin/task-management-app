"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("./errorHandler");
const validate = (validations) => {
    return async (req, _res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const message = errors
                .array()
                .map((e) => (typeof e === 'object' && 'msg' in e ? e.msg : String(e)))
                .join(', ');
            next(new errorHandler_1.AppError(message, 400));
            return;
        }
        next();
    };
};
exports.validate = validate;
