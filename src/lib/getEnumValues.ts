import { SchemaEnumValue } from "../ApiSchema"

import { GraphQLEnumValue } from "./ISchema"

export function getEnumValues(enumValues: GraphQLEnumValue[]|null)
: Map<string, SchemaEnumValue>
{
  const schemas = new Map<string, SchemaEnumValue>()
  if(enumValues && enumValues.length > 0) {
    for(const type of enumValues) {
      const schema = {
        name: type.name,
        description: type.description ?? undefined,
        isDeprecated: type.isDeprecated ?? false,
        deprecationReason: type.deprecationReason ?? undefined,
      }
      schemas.set(schema.name, schema)
    }
  }
  return schemas
}
