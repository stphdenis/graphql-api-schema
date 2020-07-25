import { SchemaFullType } from "../ApiSchema"

import { GraphQLFullType } from "./ISchema"
import { getFields } from "./getFields"
import { getInputValues } from "./getInputValues"
import { getEnumValues } from "./getEnumValues"
import { getTypeRefs } from "./getTypeRefs"

export function getFullTypes(fullTypes: GraphQLFullType[])
: Map<string, SchemaFullType>
{
  const schemas: Map<string, SchemaFullType> = new Map()
  for(const fullType of fullTypes) {
    if(fullType.name.startsWith('__') === false) {
      const schema = {
        kind: fullType.kind,
        name: fullType.name,
        description: fullType.description ?? undefined,
      
        fields: getFields(fullType.fields),
        inputFields: getInputValues(fullType.inputFields),
        interfaces: getTypeRefs(fullType.interfaces),
        enumValues: getEnumValues(fullType.enumValues),
        possibleTypes: getTypeRefs(fullType.possibleTypes),
      }
      schemas.set(schema.name, schema)
    }
  }
  return schemas
}
