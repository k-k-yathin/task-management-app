"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authService_1 = require("../services/authService");
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
exports.authController = {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const result = await authService_1.authService.register(name, email, password);
            res.cookie('token', result.token, cookieOptions);
            res.status(201).json({ user: result.user, token: result.token });
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService_1.authService.login(email, password);
            res.cookie('token', result.token, cookieOptions);
            res.json({ user: result.user, token: result.token });
        }
        catch (error) {
            next(error);
        }
    },
    async logout(_req, res) {
        res.clearCookie('token', cookieOptions);
        res.json({ message: 'Logged out successfully' });
    },
    async me(req, res, next) {
        try {
            const user = await authService_1.authService.getProfile(req.user.userId);
            res.json({ user });
        }
        catch (error) {
            next(error);
        }
    },
};
