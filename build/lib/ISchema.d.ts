export declare const IQuery = "\nquery IntrospectionQuery {\n  __schema {\n    queryType { name }\n    mutationType { name }\n    subscriptionType { name }\n    types {\n      ...FullType\n    }\n    directives {\n      name\n      description\n      locations\n      args {\n        ...InputValue\n      }\n    }\n  }\n}\n\nfragment FullType on __Type {\n  kind\n  name\n  description\n  fields(includeDeprecated: true) {\n    name\n    description\n    args {\n      ...InputValue\n    }\n    type {\n      ...TypeRef\n    }\n    isDeprecated\n    deprecationReason\n  }\n  inputFields {\n    ...InputValue\n  }\n  interfaces {\n    ...TypeRef\n  }\n  enumValues(includeDeprecated: true) {\n    name\n    description\n    isDeprecated\n    deprecationReason\n  }\n  possibleTypes {\n    ...TypeRef\n  }\n}\n\nfragment InputValue on __InputValue {\n  name\n  description\n  type { ...TypeRef }\n  defaultValue\n}\n\nfragment TypeRef on __Type {\n  kind\n  name\n  ofType {\n    kind\n    name\n    ofType {\n      kind\n      name\n      ofType {\n        kind\n        name\n        ofType {\n          kind\n          name\n          ofType {\n            kind\n            name\n            ofType {\n              kind\n              name\n              ofType {\n                kind\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n";
export interface GraphQLTypeRef {
    kind: 'OBJECT' | 'LIST' | 'INTERFACE' | 'NON_NULL' | 'INPUT_OBJECT' | 'SCALAR' | 'ENUM';
    name: string | null;
    ofType: GraphQLTypeRef | null;
}
export interface GraphQLInputValue {
    name: string;
    description: string | null;
    type: GraphQLTypeRef;
    defaultValue: any | null;
}
export interface GraphQLField {
    name: string;
    description: string | null;
    args: GraphQLInputValue[] | null;
    type: GraphQLTypeRef;
    isDeprecated: boolean | null;
    deprecationReason: string | null;
}
export interface GraphQLEnumValue {
    name: string;
    description: string | null;
    isDeprecated: boolean | null;
    deprecationReason: string | null;
}
export interface GraphQLFullType {
    kind: 'OBJECT' | 'SCALAR' | 'ENUM' | 'INPUT_OBJECT' | 'INTERFACE';
    name: string;
    description: string | null;
    fields: GraphQLField[] | null;
    inputFields: GraphQLInputValue[] | null;
    interfaces: GraphQLTypeRef[] | null;
    enumValues: GraphQLEnumValue[] | null;
    possibleTypes: GraphQLTypeRef[] | null;
}
export interface GraphQLDirective {
    name: string;
    description: string | null;
    locations: string[] | null;
    args: GraphQLInputValue[] | null;
}
export interface GraphqlISchema {
    queryType: {
        name: string;
    } | null;
    mutationType: {
        name: string;
    } | null;
    subscriptionType: {
        name: string;
    } | null;
    types: GraphQLFullType[];
    directives: GraphQLDirective[];
}
//# sourceMappingURL=ISchema.d.ts.map