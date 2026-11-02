"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequest = createRequest;
exports.listRequests = listRequests;
exports.getRequest = getRequest;
const app_error_1 = require("../../errors/app-error");
const schema_1 = require("./schema");
const service = __importStar(require("./service"));
async function createRequest(req, res, next) {
    try {
        const parsed = schema_1.createRequestSchema.safeParse(req.body);
        if (!parsed.success) {
            const details = parsed.error.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            }));
            throw new app_error_1.AppError(400, 'VALIDATION_ERROR', 'Invalid input', details);
        }
        const request = service.createRequest(parsed.data);
        res.status(201).json(request);
    }
    catch (err) {
        next(err);
    }
}
async function listRequests(req, res, next) {
    try {
        const parsed = schema_1.listRequestsQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            throw new app_error_1.AppError(400, 'VALIDATION_ERROR', 'Invalid status filter');
        }
        const requests = service.listRequests(parsed.data.status);
        res.status(200).json(requests);
    }
    catch (err) {
        next(err);
    }
}
async function getRequest(req, res, next) {
    try {
        const parsed = schema_1.requestIdSchema.safeParse(req.params);
        if (!parsed.success) {
            throw new app_error_1.AppError(400, 'VALIDATION_ERROR', 'id must be a positive integer');
        }
        const request = service.getRequest(parsed.data.id);
        res.status(200).json(request);
    }
    catch (err) {
        next(err);
    }
}
