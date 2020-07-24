import { SchemaInputValues, SchemaInputValue } from "../ApiSchema"
import { GraphQLInputValue } from "./ISchema"
import { getTypeRef } from "./getTypeRef"

export function getInputValues(types: GraphQLInputValue[]|null):
{ inputValues: SchemaInputValues,
  inputValuesMap: Map<string, SchemaInputValue>,
} {
  const schemas: SchemaInputValues = {}
  const schemasMap = new Map<string, SchemaInputValue>()
  if(types && types.length > 0) {
    for(const type of types) {
      const schema = {} as SchemaInputValue
      schema.name = type.name
      schema.description = type.description ?? undefined
      schema.type = getTypeRef(type.type).schema
      schema.defaultValue = type.defaultValue
      
      schemas[schema.name] = schema
      schemasMap.set(schema.name, schema)
    }
  }
  return {
    inputValues: schemas,
    inputValuesMap: schemasMap,
  }
}
