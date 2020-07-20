"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refTypesToRef = exports.addTypeToRef = exports.resetTypesToRef = void 0;
let refsToRefer = new Array();
function resetTypesToRef() {
    refsToRefer = [];
}
exports.resetTypesToRef = resetTypesToRef;
function addTypeToRef(typeRef, name) {
    refsToRefer.push({ typeRef, name });
}
exports.addTypeToRef = addTypeToRef;
function refTypesToRef(apiSchema) {
    const schemaTypes = apiSchema.types;
    refsToRefer.forEach(ref => {
        ref.typeRef.of = schemaTypes[ref.name];
    });
    refsToRefer = [];
}
exports.refTypesToRef = refTypesToRef;
