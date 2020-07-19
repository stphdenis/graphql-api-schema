export const introspectionQuery = `
query IntrospectionQuery {
  __schema {
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types {
      ...FullType
    }
    directives {
      name
      description
      locations
      args {
        ...InputValue
      }
    }
  }
}

fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}

fragment InputValue on __InputValue {
  name
  description
  type { ...TypeRef }
  defaultValue
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}
`

export interface GraphQLTypeRef {
  kind: 'OBJECT'|'LIST'|'INTERFACE'|'NON_NULL'|'INPUT_OBJECT'|'SCALAR'|'ENUM',
  name: string|null
  ofType: GraphQLTypeRef|null
}

export interface GraphQLInputValue {
  name: string
  description: string|null
  type: GraphQLTypeRef
  defaultValue: any|null
}

export interface GraphQLField {
  name: string
  description: string|null
  args: GraphQLInputValue[]|null
  type: GraphQLTypeRef
  isDeprecated: boolean|null
  deprecationReason: string|null
}

export interface GraphQLEnumValue {
  name: string
  description: string|null
  isDeprecated: boolean|null
  deprecationReason: string|null
}

export interface GraphQLFullType {
  kind: 'OBJECT'|'SCALAR'|'ENUM'|'INPUT_OBJECT'|'INTERFACE'
  name: string
  description: string|null
  fields: GraphQLField[]|null
  inputFields: GraphQLInputValue[]|null
  interfaces: GraphQLTypeRef[]|null
  enumValues: GraphQLEnumValue[]|null
  possibleTypes: GraphQLTypeRef[]|null
}

export interface GraphQLDirective {
  name: string
  description: string|null
  locations: string[]|null
  args: GraphQLInputValue[]|null
}

export interface GraphqlISchema {
  queryType: { name: string }|null
  mutationType: { name: string }|null
  subscriptionType: { name: string }|null
  types: GraphQLFullType[]
  directives: GraphQLDirective[]
}
