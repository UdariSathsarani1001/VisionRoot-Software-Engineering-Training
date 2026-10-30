"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findAll = findAll;
exports.findById = findById;
// In-memory store. Data is lost on server restart. Persistence arrives on Day 06.
const store = [];
let nextId = 1;
function nowIso() {
    return new Date().toISOString();
}
function create(input) {
    const now = nowIso();
    const request = {
        id: nextId++,
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority,
        status: 'OPEN',
        created_at: now,
        updated_at: now,
    };
    store.push(request);
    return request;
}
function findAll(status) {
    const results = status
        ? store.filter((r) => r.status === status)
        : [...store];
    // Newest first.
    return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
function findById(id) {
    return store.find((r) => r.id === id);
}
