import { SchemaTypeRefs } from '../ApiSchema'
import { GraphQLTypeRef } from './ISchema'
import { getTypeRef } from './getTypeRef'

export function getTypeRefs(types: GraphQLTypeRef[]|null):
{ typeRefs?: SchemaTypeRefs,
  typeRefList?: string[],
} {
  if(types && types.length > 0) {
    const schemas: SchemaTypeRefs = {}
    const schemaList: string[] = []
    for(const type of types) {
      const ref = getTypeRef(type)
      schemaList.push(ref.name)
      schemas[ref.name] = ref.schema
      //schemaList.push(schema.of.name)
      //schemas[schema.of.name] = schema
    }
    return {
      typeRefs: schemas,
      typeRefList: schemaList
    }
  }
  return {
    typeRefs: undefined,
    typeRefList: undefined,
  }
}
