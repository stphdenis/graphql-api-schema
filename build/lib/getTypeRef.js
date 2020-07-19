"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objectToRef_1 = require("./objectToRef");
function getTypeRef(type) {
    const schema = {
        isList: false,
        isNullable: true,
    };
    let currentType = type;
    while (currentType) {
        switch (currentType.kind) {
            case 'LIST':
                schema.isList = true;
                break;
            case 'NON_NULL':
                schema.isNullable = false;
                break;
            default:
                if (currentType.ofType !== null) {
                    throw new Error(`kind ${currentType.kind} is treated by `);
                }
                if (currentType.name === null) {
                    throw new Error(`type name not defined`);
                }
                //schema.of = { name: currentType.name }
                objectToRef_1.addTypeToRef(schema, currentType.name);
                if (currentType.ofType === null) {
                    return { schema, name: currentType.name };
                }
        }
        currentType = currentType.ofType;
    }
    throw new Error('Could never comme here');
}
exports.getTypeRef = getTypeRef;
