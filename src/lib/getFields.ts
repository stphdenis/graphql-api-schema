import { SchemaField } from "../ApiSchema"

import { GraphQLField } from "./ISchema"
import { getTypeRef } from "./getTypeRef"
import { getInputValues } from "./getInputValues"

export function getFields(fields: GraphQLField[]|null)
: Map<string, SchemaField>
{
  const schemas = new Map<string, SchemaField>()
  if(fields && fields.length > 0) {
    for(const type of fields) {
      const schema = {
        name: type.name,
        description: type.description ?? undefined,
        isDeprecated: type.isDeprecated ?? false,
        deprecationReason: type.deprecationReason ?? undefined,
        type: getTypeRef(type.type).typeRef,
        args: getInputValues(type.args),
      }
      schemas.set(schema.name, schema)
    }
  }
  return schemas
}
