"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getEnumValues(types) {
    var _a, _b, _c;
    if (types && types.length > 0) {
        const schemas = {};
        const schemaList = [];
        for (const type of types) {
            schemaList.push(type.name);
            const schema = {};
            schemas[type.name] = schema;
            schema.name = type.name;
            schema.description = (_a = type.description, (_a !== null && _a !== void 0 ? _a : undefined));
            schema.isDeprecated = (_b = type.isDeprecated, (_b !== null && _b !== void 0 ? _b : false));
            schema.deprecationReason = (_c = type.deprecationReason, (_c !== null && _c !== void 0 ? _c : undefined));
        }
        return { enumValues: schemas, enumList: schemaList };
    }
    return { enumValues: undefined, enumList: undefined };
}
exports.getEnumValues = getEnumValues;
