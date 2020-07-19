"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getTypeRef_1 = require("./getTypeRef");
function getInputValues(types) {
    var _a;
    if (types && types.length > 0) {
        const schemas = {};
        const schemaList = [];
        for (const type of types) {
            schemaList.push(type.name);
            const schema = {};
            schemas[type.name] = schema;
            schema.name = type.name;
            schema.description = (_a = type.description, (_a !== null && _a !== void 0 ? _a : undefined));
            schema.type = getTypeRef_1.getTypeRef(type.type).schema;
            schema.defaultValue = type.defaultValue;
        }
        return { inputValues: schemas, inputList: schemaList };
    }
    return { inputValues: undefined, inputList: undefined };
}
exports.getInputValues = getInputValues;
