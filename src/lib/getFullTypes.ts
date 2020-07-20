import { SchemaFullTypes } from "../ApiSchema"
import { GraphQLFullType } from "./ISchema"
import { getFullType } from "./getFullType"

export function getFullTypes(types: GraphQLFullType[]): SchemaFullTypes {
  const schemas: SchemaFullTypes = {}
  for(const type of types) {
    if(type.name.startsWith('__') === false) {
      const schema = getFullType(type)
      schemas[type.name] = schema
    }
  }
  return schemas
}
