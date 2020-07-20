"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullTypes = void 0;
const getFullType_1 = require("./getFullType");
function getFullTypes(types) {
    const schemas = {};
    const schemaList = [];
    for (const type of types) {
        if (type.name.startsWith('__') === false) {
            schemaList.push(type.name);
            const schema = getFullType_1.getFullType(type);
            schemas[type.name] = schema;
        }
    }
    return {
        types: schemas,
        typeList: schemaList,
    };
}
exports.getFullTypes = getFullTypes;
