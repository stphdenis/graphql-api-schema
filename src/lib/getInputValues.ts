import { SchemaInputValues, SchemaInputValue } from "../GraphqlApiSchema"
import { GraphQLInputValue } from "./GraphqlISchema"
import { getTypeRef } from "./getTypeRef"

export function getInputValues(types: GraphQLInputValue[]|null):
{ inputValues?: SchemaInputValues,
  inputList?: string[]
} {
  if(types && types.length > 0) {
    const schemas: SchemaInputValues = {}
    const schemaList: string[] = []

    for(const type of types) {
      schemaList.push(type.name)
      const schema = {} as SchemaInputValue
      schemas[type.name] = schema

      schema.name = type.name
      schema.description = type.description ?? undefined
      schema.type = getTypeRef(type.type).schema
      schema.defaultValue = type.defaultValue
    }
    return {inputValues: schemas, inputList: schemaList}
  }
  return {inputValues: undefined, inputList: undefined}
}
