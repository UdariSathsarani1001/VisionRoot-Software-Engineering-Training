"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.checkDatabaseConnectivity = checkDatabaseConnectivity;
const pg_1 = require("pg");
const environment_1 = require("../config/environment");
const request_logger_1 = require("../middleware/request-logger");
// One shared pool for the entire application.
exports.pool = new pg_1.Pool({ connectionString: environment_1.env.databaseUrl });
// Log idle-client errors so a background failure does not crash the process.
// Never log the connection string or any credential.
exports.pool.on('error', (err) => {
    request_logger_1.logger.error({ type: err.constructor.name }, `[database] Unexpected idle client error: ${err.message}`);
});
/**
 * Verify that the database is reachable.
 * Returns true on success, false on any failure.
 * Never throws.
 */
async function checkDatabaseConnectivity() {
    try {
        await exports.pool.query('SELECT 1');
        return true;
    }
    catch {
        return false;
    }
}
