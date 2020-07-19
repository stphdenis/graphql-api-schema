"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getInputValues_1 = require("./getInputValues");
function getDirectives(types) {
    var _a, _b;
    if (types && types.length > 0) {
        const schemas = {};
        const schemaList = [];
        for (const type of types) {
            schemaList.push(type.name);
            const schema = {};
            schemas[type.name] = schema;
            schema.name = type.name;
            schema.description = (_a = type.description, (_a !== null && _a !== void 0 ? _a : undefined));
            schema.locations = (_b = type.locations, (_b !== null && _b !== void 0 ? _b : undefined));
            const args = getInputValues_1.getInputValues(type.args);
            schema.args = args.inputValues;
            schema.argList = args.inputList;
        }
        return {
            directives: schemas,
            directiveList: schemaList,
        };
    }
    return {
        directives: undefined,
        directiveList: undefined,
    };
}
exports.getDirectives = getDirectives;
