import { SchemaEnumValues, SchemaEnumValue } from "../ApiSchema"
import { GraphQLEnumValue } from "./ISchema"

export function getEnumValues(types: GraphQLEnumValue[]|null):
{ enumValues: SchemaEnumValues,
  enumValuesMap: Map<string, SchemaEnumValue>,
} {
  const schemas: SchemaEnumValues = {}
  const schemasMap = new Map<string, SchemaEnumValue>()
  if(types && types.length > 0) {
    for(const type of types) {
      const schema = {} as SchemaEnumValue
      schema.name = type.name
      schema.description = type.description ?? undefined
      schema.isDeprecated = type.isDeprecated ?? false
      schema.deprecationReason = type.deprecationReason ?? undefined
      
      schemas[schema.name] = schema
      schemasMap.set(schema.name, schema)
    }
  }
  return {
    enumValues: schemas,
    enumValuesMap: schemasMap,
  }
}
