import { SchemaFullTypes } from "../ApiSchema"
import { GraphQLFullType } from "./ISchema"
import { getFullType } from "./getFullType"

export function getFullTypes(types: GraphQLFullType[]):
{ types: SchemaFullTypes
  typeList: string[]
} {
  const schemas: SchemaFullTypes = {}
  const schemaList: string[] = []

  for(const type of types) {
    if(type.name.startsWith('__') === false) {
      schemaList.push(type.name)
      const schema = getFullType(type)
      schemas[type.name] = schema
    }
  }
  return {
    types: schemas,
    typeList: schemaList,
  }
}
