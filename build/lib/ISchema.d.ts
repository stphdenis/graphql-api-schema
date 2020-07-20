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
export interface ISchema {
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