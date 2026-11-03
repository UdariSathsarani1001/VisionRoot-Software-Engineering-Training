"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const environment_1 = require("./config/environment");
const connection_1 = require("./database/connection");
const server = app_1.default.listen(environment_1.env.port, () => {
    console.log(`Backend running on port ${environment_1.env.port}`);
});
// Graceful shutdown: close the database pool so the process exits cleanly.
function shutdown(signal) {
    console.log(`[server] Received ${signal}. Shutting down…`);
    server.close(async () => {
        await connection_1.pool.end();
        console.log('[server] Database pool closed. Exiting.');
        process.exit(0);
    });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
