import { GraphQLTypeRef } from './ISchema'
import { getTypeRef } from './getTypeRef'

import { SchemaTypeRefs, SchemaTypeRef } from '../ApiSchema'

export function getTypeRefs(types: GraphQLTypeRef[]|null):
{ typeRefs: SchemaTypeRefs,
  typeRefsMap: Map<string, SchemaTypeRef>,
} {
  const schemas: SchemaTypeRefs = {}
  const schemasMap: Map<string, SchemaTypeRef> = new Map()
  if(types && types.length > 0) {
    for(const type of types) {
      const schema = getTypeRef(type)

      schemas[schema.name] = schema.schema
      schemasMap.set(schema.name, schema.schema)
    }
  }
  return {
    typeRefs: schemas,
    typeRefsMap: schemasMap,
  }
}
