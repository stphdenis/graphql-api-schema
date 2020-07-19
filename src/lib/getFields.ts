import { SchemaFields, SchemaField } from "../GraphqlApiSchema"
import { GraphQLField } from "./GraphqlISchema"
import { getTypeRef } from "./getTypeRef"
import { getInputValues } from "./getInputValues"

export function getFields(types: GraphQLField[]|null):
{ fields?: SchemaFields
  fieldList?: string[]
} {
  if(types && types.length > 0) {
    const schemas: SchemaFields = {}
    const schemaList: string[] = []

    for(const type of types) {
      schemaList.push(type.name)
      const schema = {} as SchemaField
      schemas[type.name] = schema

      schema.name = type.name
      schema.description = type.description ?? undefined
      schema.isDeprecated = type.isDeprecated ?? false
      schema.deprecationReason = type.deprecationReason ?? undefined
      schema.type = getTypeRef(type.type).schema

      const args = getInputValues(type.args)
      schema.args = args.inputValues
      schema.argList = args.inputList
    }
    return {
      fields: schemas,
      fieldList: schemaList
    }
  }
  return {
    fields: undefined,
    fieldList: undefined
  }
}
