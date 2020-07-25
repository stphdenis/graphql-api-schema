import { SchemaTypeRef } from "../ApiSchema"

import { GraphQLTypeRef } from "./ISchema"
import { TypesToRef } from "./TypesToRef"

export function getTypeRef(type: GraphQLTypeRef):
{ typeRef: SchemaTypeRef,
  name: string,
} {
  const typeRef = {
    isList: false,
    isNullable: true,
  } as SchemaTypeRef
  let currentType: GraphQLTypeRef|null = type
  while (currentType) {
    switch(currentType.kind) {

      case 'LIST':
        typeRef.isList = true
        break

      case 'NON_NULL':
        typeRef.isNullable = false
        break

      default:
        if(currentType.ofType !== null) {
          throw new Error(`kind ${currentType.kind} is treated by `)
        }
        if(currentType.name === null) {
          throw new Error(`type name not defined`)
        }
        TypesToRef.add(typeRef, currentType.name)
        if(currentType.ofType === null) {
          return {
            typeRef: typeRef,
            name: currentType.name,
          }
        }
    }
    currentType = currentType.ofType
  }
  throw new Error('Should never comme here')
}
