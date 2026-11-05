"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const environment_1 = require("./config/environment");
const error_handler_1 = require("./middleware/error-handler");
const request_logger_1 = require("./middleware/request-logger");
const routes_1 = __importDefault(require("./modules/health/routes"));
const routes_2 = __importDefault(require("./modules/requests/routes"));
const app = (0, express_1.default)();
// Security headers — sets X-Content-Type-Options, removes X-Powered-By and more.
// Registered first so every response carries the headers.
app.use((0, helmet_1.default)());
// CORS — must come before routes so preflight OPTIONS requests are answered.
app.use((0, cors_1.default)({
    origin: environment_1.env.corsOrigin,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));
// Structured request logging — before routes so all requests are captured.
app.use(request_logger_1.requestLogger);
// Parse JSON bodies. Cap at 10 kb — enough for any valid request payload.
// Oversized bodies raise an error with status 413, caught by errorHandler.
// Malformed JSON produces a SyntaxError, also caught by errorHandler.
app.use(express_1.default.json({ limit: '10kb' }));
// Routes
app.use('/api/health', routes_1.default);
app.use('/api/requests', routes_2.default);
// Unknown routes — must come after all registered routes.
app.use(error_handler_1.notFoundHandler);
// Central error handler — must be last and must have four parameters.
app.use(error_handler_1.errorHandler);
exports.default = app;
