"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = require("../../database/connection");
const router = (0, express_1.Router)();
// GET /api/health
// Returns 200 { status: 'ok' } when the database is reachable.
// Returns 503 { status: 'unavailable' } when the database cannot be reached.
// Never throws: all failures are caught inside checkDatabaseConnectivity.
router.get('/', async (_req, res) => {
    const isUp = await (0, connection_1.checkDatabaseConnectivity)();
    if (isUp) {
        res.status(200).json({ status: 'ok' });
    }
    else {
        res.status(503).json({ status: 'unavailable' });
    }
});
exports.default = router;
