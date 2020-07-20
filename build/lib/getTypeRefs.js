"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeRefs = void 0;
const getTypeRef_1 = require("./getTypeRef");
function getTypeRefs(types) {
    if (types && types.length > 0) {
        const schemas = {};
        const schemaList = [];
        for (const type of types) {
            const ref = getTypeRef_1.getTypeRef(type);
            schemaList.push(ref.name);
            schemas[ref.name] = ref.schema;
        }
        return {
            typeRefs: schemas,
            typeRefList: schemaList
        };
    }
    return {
        typeRefs: undefined,
        typeRefList: undefined,
    };
}
exports.getTypeRefs = getTypeRefs;
