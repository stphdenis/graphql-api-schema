export interface SchemaTypeRef {
  isNullable: boolean
  isList: boolean
  of: SchemaFullType
}

export interface SchemaInputValue {
  name: string
  description?: string
  type: SchemaTypeRef
  defaultValue: any|null
}

export interface SchemaField {
  name: string
  description?: string
  args: Map<string, SchemaInputValue>
  type: SchemaTypeRef
  isDeprecated: boolean
  deprecationReason?: string
}

export interface SchemaEnumValue {
  name: string
  description?: string
  isDeprecated: boolean
  deprecationReason?: string
}

export interface SchemaFullType {
  kind: 'OBJECT'|'SCALAR'|'ENUM'|'INPUT_OBJECT'|'INTERFACE'
  name: string
  description?: string

  fields: Map<string, SchemaField>
  inputFields: Map<string, SchemaInputValue>
  interfaces: Map<string, SchemaTypeRef>
  enumValues: Map<string, SchemaEnumValue>
  possibleTypes: Map<string, SchemaTypeRef>
}

export interface SchemaDirective {
  name: string
  description?: string
  locations: string[]

  args: Map<string, SchemaInputValue>
}

export interface ApiSchema {
  queryTypeName: string
  mutationTypeName: string
  subscriptionTypeName: string

  types: Map<string, SchemaFullType>
  directives: Map<string, SchemaDirective>
}
