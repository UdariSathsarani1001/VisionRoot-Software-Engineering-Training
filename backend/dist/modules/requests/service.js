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
exports.updateRequestStatus = updateRequestStatus;
const app_error_1 = require("../../errors/app-error");
const repository = __importStar(require("./repository"));
// Allowed status transitions. The service owns this rule (NFR-09).
const ALLOWED_TRANSITIONS = {
    OPEN: 'IN_PROGRESS',
    IN_PROGRESS: 'RESOLVED',
    RESOLVED: 'CLOSED',
};
async function createRequest(input) {
    return repository.create(input);
}
async function listRequests(status) {
    return repository.findAll(status);
}
async function getRequest(id) {
    const request = await repository.findById(id);
    if (!request) {
        throw new app_error_1.AppError(404, 'NOT_FOUND', 'Request not found');
    }
    return request;
}
async function updateRequestStatus(id, newStatus) {
    // Load the current request first so we can give a meaningful 404 or
    // transition error before touching the database.
    const current = await repository.findById(id);
    if (!current) {
        throw new app_error_1.AppError(404, 'NOT_FOUND', 'Request not found');
    }
    const allowed = ALLOWED_TRANSITIONS[current.status];
    if (allowed !== newStatus) {
        throw new app_error_1.AppError(400, 'INVALID_TRANSITION', `Cannot change status from ${current.status} to ${newStatus}`);
    }
    // Pass the expected current status so the UPDATE is atomic: if another
    // request changes the status concurrently the WHERE clause will not match.
    const updated = await repository.updateStatus(id, newStatus, current.status);
    if (!updated) {
        // The row was modified between our SELECT and UPDATE — re-fetch and report.
        const fresh = await repository.findById(id);
        if (!fresh) {
            throw new app_error_1.AppError(404, 'NOT_FOUND', 'Request not found');
        }
        throw new app_error_1.AppError(400, 'INVALID_TRANSITION', `Cannot change status from ${fresh.status} to ${newStatus}`);
    }
    return updated;
}
