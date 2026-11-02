"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const zod_1 = require("zod");
const app_error_1 = require("../errors/app-error");
function buildErrorBody(code, message, details) {
    const body = { code, message };
    if (details && details.length > 0) {
        body.details = details;
    }
    return { error: body };
}
// Central error handler — must have four parameters for Express to recognise it.
function errorHandler(err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) {
    if (err instanceof app_error_1.AppError) {
        res
            .status(err.statusCode)
            .json(buildErrorBody(err.code, err.message, err.details));
        return;
    }
    if (err instanceof zod_1.ZodError) {
        const details = err.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        res
            .status(400)
            .json(buildErrorBody('VALIDATION_ERROR', 'Invalid input', details));
        return;
    }
    // Malformed JSON from Express body-parser lands here as a SyntaxError.
    if (err instanceof SyntaxError && 'body' in err) {
        res
            .status(400)
            .json(buildErrorBody('VALIDATION_ERROR', 'Malformed JSON body'));
        return;
    }
    // Unexpected error — log safely, return nothing internal.
    console.error('[error]', err instanceof Error ? err.message : 'Unknown error');
    res
        .status(500)
        .json(buildErrorBody('INTERNAL_ERROR', 'An unexpected error occurred'));
}
function notFoundHandler(_req, res) {
    res.status(404).json(buildErrorBody('NOT_FOUND', 'Route not found'));
}
