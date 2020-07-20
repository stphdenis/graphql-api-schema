import { SchemaEnumValues, SchemaEnumValue } from "../ApiSchema"
import { GraphQLEnumValue } from "./ISchema"

export function getEnumValues(types: GraphQLEnumValue[]|null):
{ enumValues?: SchemaEnumValues,
  enumList?: string[]
} {
  if(types && types.length > 0) {
    const schemas: SchemaEnumValues = {}
    const schemaList: string[] = []

    for(const type of types) {
      schemaList.push(type.name)
      const schema = {} as SchemaEnumValue

      schemas[type.name] = schema
      schema.name = type.name
      schema.description = type.description ?? undefined
      schema.isDeprecated = type.isDeprecated ?? false
      schema.deprecationReason = type.deprecationReason ?? undefined
    }
    return { enumValues: schemas, enumList: schemaList }
  }
  return { enumValues: undefined, enumList: undefined }
}
