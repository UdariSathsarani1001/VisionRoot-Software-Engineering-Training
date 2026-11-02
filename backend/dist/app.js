"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_handler_1 = require("./middleware/error-handler");
const routes_1 = __importDefault(require("./modules/health/routes"));
const routes_2 = __importDefault(require("./modules/requests/routes"));
const app = (0, express_1.default)();
// Parse JSON bodies. Malformed JSON produces a SyntaxError caught by errorHandler.
app.use(express_1.default.json());
// Routes
app.use('/api/health', routes_1.default);
app.use('/api/requests', routes_2.default);
// Unknown routes — must come after all registered routes.
app.use(error_handler_1.notFoundHandler);
// Central error handler — must be last and must have four parameters.
app.use(error_handler_1.errorHandler);
exports.default = app;
