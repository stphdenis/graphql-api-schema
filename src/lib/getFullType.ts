import { SchemaFullType } from "../GraphqlApiSchema"
import { GraphQLFullType } from "./GraphqlISchema"
import { getTypeRefs } from "./getTypeRefs"
import { getInputValues } from "./getInputValues"
import { getFields } from "./getFields"
import { getEnumValues } from "./getEnumValues"

export function getFullType(type: GraphQLFullType): SchemaFullType {
  const schema = {} as SchemaFullType

  schema.kind = type.kind
  schema.name = type.name
  schema.description = type.description ?? undefined

  const fields = getFields(type.fields)
  schema.fields = fields.fields
  schema.fieldList = fields.fieldList

  const inputFields = getInputValues(type.inputFields)
  schema.inputFields = inputFields.inputValues
  schema.inputFieldList = inputFields.inputList

  const interfaces = getTypeRefs(type.interfaces)
  schema.interfaces = interfaces.typeRefs
  schema.interfaceList = interfaces.typeRefList

  const enumValues = getEnumValues(type.enumValues)
  schema.enumValues = enumValues.enumValues
  schema.enumList = enumValues.enumList

  const possibleTypes = getTypeRefs(type.possibleTypes)
  schema.possibleTypes = possibleTypes.typeRefs
  schema.possibleTypeList = possibleTypes.typeRefList

  return schema
}
