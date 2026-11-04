"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSchema = exports.requestIdSchema = exports.listRequestsQuerySchema = exports.createRequestSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("./types");
exports.createRequestSchema = zod_1.z
    .object({
    title: zod_1.z
        .string()
        .trim()
        .min(3, 'Title must be 3 to 100 characters')
        .max(100, 'Title must be 3 to 100 characters'),
    description: zod_1.z
        .string()
        .min(1, 'Description is required')
        .max(1000, 'Description must be 1 to 1000 characters'),
    category: zod_1.z.enum(types_1.CATEGORIES, {
        error: `Category must be one of: ${types_1.CATEGORIES.join(', ')}`,
    }),
    priority: zod_1.z.enum(types_1.PRIORITIES, {
        error: `Priority must be one of: ${types_1.PRIORITIES.join(', ')}`,
    }),
})
    .strict(); // rejects unknown fields
exports.listRequestsQuerySchema = zod_1.z.object({
    status: zod_1.z
        .enum(types_1.STATUSES, {
        error: `Status must be one of: ${types_1.STATUSES.join(', ')}`,
    })
        .optional(),
});
// PostgreSQL integer is 32-bit signed. Reject values above the max so the
// database never receives an out-of-range value that would cause a 500.
const PG_INT_MAX = 2_147_483_647;
exports.requestIdSchema = zod_1.z.coerce
    .number()
    .int('id must be an integer')
    .positive('id must be a positive integer')
    .max(PG_INT_MAX, 'id must be a valid integer');
// Body schema for PATCH /api/requests/:id/status
exports.updateStatusSchema = zod_1.z
    .object({
    status: zod_1.z.enum(types_1.STATUSES, {
        error: `status must be one of: ${types_1.STATUSES.join(', ')}`,
    }),
})
    .strict();
