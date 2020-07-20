"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullTypes = void 0;
const getFullType_1 = require("./getFullType");
function getFullTypes(types) {
    const schemas = {};
    for (const type of types) {
        if (type.name.startsWith('__') === false) {
            const schema = getFullType_1.getFullType(type);
            schemas[type.name] = schema;
        }
    }
    return schemas;
}
exports.getFullTypes = getFullTypes;
