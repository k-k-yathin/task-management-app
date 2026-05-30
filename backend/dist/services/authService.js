"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("../middleware/errorHandler");
const SALT_ROUNDS = 12;
exports.authService = {
    async register(name, email, password) {
        const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new errorHandler_1.AppError('Email already registered', 409);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const user = await prisma_1.prisma.user.create({
            data: { name, email, password: hashedPassword },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email });
        return { user, token };
    },
    async login(email, password) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid email or password', 401);
        }
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            throw new errorHandler_1.AppError('Invalid email or password', 401);
        }
        const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
            token,
        };
    },
    async getProfile(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        return user;
    },
};
