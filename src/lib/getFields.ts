import { SchemaFields, SchemaField } from "../ApiSchema"
import { GraphQLField } from "./ISchema"
import { getTypeRef } from "./getTypeRef"
import { getInputValues } from "./getInputValues"

export function getFields(types: GraphQLField[]|null):
{ fields: SchemaFields
  fieldsMap: Map<string, SchemaField>
} {
  const schemas: SchemaFields = {}
  const schemasMap = new Map<string, SchemaField>()
  if(types && types.length > 0) {
    for(const type of types) {
      const schema = {} as SchemaField
      schema.name = type.name
      schema.description = type.description ?? undefined
      schema.isDeprecated = type.isDeprecated ?? false
      schema.deprecationReason = type.deprecationReason ?? undefined
      schema.type = getTypeRef(type.type).schema
      
      const args = getInputValues(type.args)
      schema.args = args.inputValues
      schema.argsMap = args.inputValuesMap

      schemas[type.name] = schema
      schemasMap.set(schema.name, schema)
    }
  }
  return {
    fields: schemas,
    fieldsMap: schemasMap,
  }
}
