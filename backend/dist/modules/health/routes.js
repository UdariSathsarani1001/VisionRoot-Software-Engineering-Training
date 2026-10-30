"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET /api/health
// Returns 200 without a database check today. The 503 case is added on Day 06.
router.get('/', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
exports.default = router;
