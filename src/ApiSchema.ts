export interface SchemaTypeRef {
  isNullable: boolean
  isList: boolean
  of: SchemaFullType
}
export interface SchemaTypeRefs {
  [key: string]: SchemaTypeRef
}

export interface SchemaInputValue {
  name: string
  description?: string
  type: SchemaTypeRef
  defaultValue: any|null
}
export interface SchemaInputValues {
  [key: string]: SchemaInputValue
}

export interface SchemaField {
  name: string
  description?: string
  argsMap: Map<string, SchemaInputValue>
  args: SchemaInputValues
  argList: string[]
  type: SchemaTypeRef
  isDeprecated: boolean
  deprecationReason?: string
}
export interface SchemaFields {
  [key: string]: SchemaField
}

export interface SchemaEnumValue {
  name: string
  description?: string
  isDeprecated: boolean
  deprecationReason?: string
}
export interface SchemaEnumValues {
  [key: string]: SchemaEnumValue
}

export interface SchemaFullType {
  kind: 'OBJECT'|'SCALAR'|'ENUM'|'INPUT_OBJECT'|'INTERFACE'
  name: string
  description?: string

  fieldsMap: Map<string, SchemaField>
  fields: SchemaFields
  fieldList: string[]

  inputFieldsMap: Map<string, SchemaInputValue>
  inputFields: SchemaInputValues
  inputFieldList: string[]

  interfacesMap: Map<string, SchemaTypeRef>
  interfaces: SchemaTypeRefs
  interfaceList: string[]

  enumValuesMap: Map<string, SchemaEnumValue>
  enumValues: SchemaEnumValues
  enumList: string[]

  possibleTypesMap: Map<string, SchemaTypeRef>
  possibleTypes: SchemaTypeRefs
  possibleTypeList: string[]
}
export interface SchemaFullTypes {
  [key: string]: SchemaFullType
}

export interface SchemaDirective {
  name: string
  description?: string
  locations: string[]

  argsMap: Map<string, SchemaInputValue>
  args: SchemaInputValues
  argList: string[]
}
export interface SchemaDirectives {
  [key: string]: SchemaDirective
}

export interface ApiSchema {
  queryTypeName: string
  mutationTypeName: string
  subscriptionTypeName: string

  typesMap: Map<string, SchemaFullType>
  types: SchemaFullTypes
  typeList: string[]

  directivesMap: Map<string, SchemaDirective>
  directives: SchemaDirectives
  directiveList: string[]
}
