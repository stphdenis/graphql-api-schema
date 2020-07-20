"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectives = void 0;
const getInputValues_1 = require("./getInputValues");
function getDirectives(types) {
    var _a, _b, _c, _d;
    if (types && types.length > 0) {
        const schemas = {};
        const schemaList = [];
        for (const type of types) {
            schemaList.push(type.name);
            const schema = {};
            schemas[type.name] = schema;
            schema.name = type.name;
            schema.description = (_a = type.description) !== null && _a !== void 0 ? _a : undefined;
            schema.locations = (_b = type.locations) !== null && _b !== void 0 ? _b : [];
            const args = getInputValues_1.getInputValues(type.args);
            schema.args = (_c = args.inputValues) !== null && _c !== void 0 ? _c : {};
            schema.argList = (_d = args.inputList) !== null && _d !== void 0 ? _d : [];
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
