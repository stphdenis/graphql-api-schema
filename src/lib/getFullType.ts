import { SchemaFullType } from "../ApiSchema"
import { GraphQLFullType } from "./ISchema"
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
  schema.fieldList = [...fields.fieldsMap.keys()]
  schema.fieldsMap = fields.fieldsMap

  const inputFields = getInputValues(type.inputFields)
  schema.inputFields = inputFields.inputValues
  schema.inputFieldList = [...inputFields.inputValuesMap.keys()]
  schema.inputFieldsMap = inputFields.inputValuesMap

  const interfaces = getTypeRefs(type.interfaces)
  schema.interfaces = interfaces.typeRefs
  schema.interfaceList = [...interfaces.typeRefsMap.keys()]
  schema.interfacesMap = interfaces.typeRefsMap

  const enumValues = getEnumValues(type.enumValues)
  schema.enumValues = enumValues.enumValues
  schema.enumList = [...enumValues.enumValuesMap.keys()]
  schema.enumValuesMap = enumValues.enumValuesMap

  const possibleTypes = getTypeRefs(type.possibleTypes)
  schema.possibleTypes = possibleTypes.typeRefs
  schema.possibleTypeList = [...possibleTypes.typeRefsMap.keys()]
  schema.possibleTypesMap = possibleTypes.typeRefsMap

  return schema
}
