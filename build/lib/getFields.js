"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFields = void 0;
const getTypeRef_1 = require("./getTypeRef");
const getInputValues_1 = require("./getInputValues");
function getFields(types) {
    var _a, _b, _c, _d, _e;
    if (types && types.length > 0) {
        const schemas = {};
        const schemaList = [];
        for (const type of types) {
            schemaList.push(type.name);
            const schema = {};
            schemas[type.name] = schema;
            schema.name = type.name;
            schema.description = (_a = type.description) !== null && _a !== void 0 ? _a : undefined;
            schema.isDeprecated = (_b = type.isDeprecated) !== null && _b !== void 0 ? _b : false;
            schema.deprecationReason = (_c = type.deprecationReason) !== null && _c !== void 0 ? _c : undefined;
            schema.type = getTypeRef_1.getTypeRef(type.type).schema;
            const args = getInputValues_1.getInputValues(type.args);
            schema.args = (_d = args.inputValues) !== null && _d !== void 0 ? _d : {};
            schema.argList = (_e = args.inputList) !== null && _e !== void 0 ? _e : [];
        }
        return {
            fields: schemas,
            fieldList: schemaList
        };
    }
    return {
        fields: undefined,
        fieldList: undefined
    };
}
exports.getFields = getFields;
