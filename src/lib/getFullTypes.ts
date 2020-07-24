import { SchemaFullTypes, SchemaFullType } from "../ApiSchema"
import { GraphQLFullType } from "./ISchema"
import { getFullType } from "./getFullType"

export function getFullTypes(types: GraphQLFullType[]):
{ types: SchemaFullTypes
  typesMap: Map<string, SchemaFullType>,
} {
  const schemas: SchemaFullTypes = {}
  const schemasMap: Map<string, SchemaFullType> = new Map()

  for(const type of types) {
    if(type.name.startsWith('__') === false) {
      const schema = getFullType(type)

      schemas[schema.name] = schema
      schemasMap.set(schema.name, schema)
    }
  }
  return {
    types: schemas,
    typesMap: schemasMap,
  }
}
