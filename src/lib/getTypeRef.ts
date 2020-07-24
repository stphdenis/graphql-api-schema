import { SchemaTypeRef } from "../ApiSchema"
import { GraphQLTypeRef } from "./ISchema"
import { addTypeToRef } from "./TypesToRef"

export function getTypeRef(type: GraphQLTypeRef):
{ schema: SchemaTypeRef,
  name: string,
} {
  const schema = {
    isList: false,
    isNullable: true,
  } as SchemaTypeRef
  let currentType: GraphQLTypeRef|null = type
  while (currentType) {
    switch(currentType.kind) {
      case 'LIST':
        schema.isList = true
        break
      case 'NON_NULL':
        schema.isNullable = false
        break
      default:
        if(currentType.ofType !== null) {
          throw new Error(`kind ${currentType.kind} is treated by `)
        }
        if(currentType.name === null) {
          throw new Error(`type name not defined`)
        }
        //schema.of = { name: currentType.name }
        addTypeToRef(schema, currentType.name)
        if(currentType.ofType === null) {
          return {
            schema,
            name: currentType.name,
          }
        }
    }
    currentType = currentType.ofType
  }
  throw new Error('Should never comme here')
}
