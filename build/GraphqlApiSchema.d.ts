import { GraphQLSchema } from 'graphql';
export interface SchemaTypeRef {
    isNullable: boolean;
    isList: boolean;
    of: SchemaFullType;
}
export interface SchemaTypeRefs {
    [key: string]: SchemaTypeRef;
}
export interface SchemaInputValue {
    name: string;
    description?: string;
    type: SchemaTypeRef;
    defaultValue: any | null;
}
export interface SchemaInputValues {
    [key: string]: SchemaInputValue;
}
export interface SchemaField {
    name: string;
    description?: string;
    args?: SchemaInputValues;
    argList?: string[];
    type: SchemaTypeRef;
    isDeprecated: boolean;
    deprecationReason?: string;
}
export interface SchemaFields {
    [key: string]: SchemaField;
}
export interface SchemaEnumValue {
    name: string;
    description?: string;
    isDeprecated: boolean;
    deprecationReason?: string;
}
export interface SchemaEnumValues {
    [key: string]: SchemaEnumValue;
}
export interface SchemaFullType {
    kind: 'OBJECT' | 'SCALAR' | 'ENUM' | 'INPUT_OBJECT' | 'INTERFACE';
    name: string;
    description?: string;
    fields?: SchemaFields;
    fieldList?: string[];
    inputFields?: SchemaInputValues;
    inputFieldList?: string[];
    interfaces?: SchemaTypeRefs;
    interfaceList?: string[];
    enumValues?: SchemaEnumValues;
    enumList?: string[];
    possibleTypes?: SchemaTypeRefs;
    possibleTypeList?: string[];
}
export interface SchemaFullTypes {
    [key: string]: SchemaFullType;
}
export interface SchemaDirective {
    name: string;
    description?: string;
    locations?: string[];
    args?: SchemaInputValues;
    argList?: string[];
}
export interface SchemaDirectives {
    [key: string]: SchemaDirective;
}
export interface ApiSchema {
    queryTypeName: string;
    mutationTypeName: string;
    subscriptionTypeName: string;
    types: SchemaFullTypes;
    directives?: SchemaDirectives;
    directiveList?: string[];
}
export interface GraphqlApiSchemaOptions {
    dirName: string;
    fileName: string;
    jsonSpace?: number;
}
export declare class GraphqlApiSchema {
    private static graphqlApiSchema;
    private static get instance();
    static get apiSchema(): ApiSchema | undefined;
    static setGraphqlSchema(graphQLSchema: GraphQLSchema): void;
    private _apiSchema?;
    private _jsonApiSchema?;
    private _jsonSpace?;
    private _fileName?;
    private _filePath?;
    /**
     * constructor
     */
    constructor(options: GraphqlApiSchemaOptions);
    setGraphqlSchema(graphQLSchema: GraphQLSchema): void;
    get apiSchema(): ApiSchema | undefined;
    private readFile;
    private writeFile;
    private jsonReplacer;
}
//# sourceMappingURL=GraphqlApiSchema.d.ts.map