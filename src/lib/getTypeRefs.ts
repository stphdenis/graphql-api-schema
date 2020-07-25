import { SchemaTypeRef } from '../ApiSchema'

import { GraphQLTypeRef } from './ISchema'
import { getTypeRef } from './getTypeRef'

export function getTypeRefs(typeRefs: GraphQLTypeRef[]|null)
: Map<string, SchemaTypeRef>
{
  const schemas: Map<string, SchemaTypeRef> = new Map()
  if(typeRefs && typeRefs.length > 0) {
    for(const type of typeRefs) {
      const schema = getTypeRef(type)
      schemas.set(schema.name, schema.typeRef)
    }
  }
  return schemas
}
