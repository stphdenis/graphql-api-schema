import { SchemaInputValue } from "../ApiSchema"

import { GraphQLInputValue } from "./ISchema"
import { getTypeRef } from "./getTypeRef"

export function getInputValues(inputValues: GraphQLInputValue[]|null): Map<string, SchemaInputValue> {
  const schemas = new Map<string, SchemaInputValue>()
  if(inputValues && inputValues.length > 0) {
    for(const inputValue of inputValues) {
      const schema = {
        name: inputValue.name,
        description: inputValue.description ?? undefined,
        type: getTypeRef(inputValue.type).typeRef,
        defaultValue: inputValue.defaultValue,
      }      
      schemas.set(schema.name, schema)
    }
  }
  return schemas
}
