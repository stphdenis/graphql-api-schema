import { GraphQLSchema } from 'graphql';
import { ApiSchema } from './ApiSchema';
export interface GraphQLApiSchemaOptions {
    /**
     *
     */
    graphQLSchema?: GraphQLSchema;
    /**
     * Write a JSON file each time `apiSchema` is modified
     * (`fileName` mandatory if informed)
     */
    dirName?: string;
    /**
     * Write a JSON file each time `apiSchema` is modified
     * (`dirName` mandatory if informed)
     */
    fileName?: string;
    /** `space` parameter of JSON.stringify */
    jsonSpace?: number;
}
export declare class GraphQLApiSchema {
    private static graphqlApiSchema;
    /**
     * Instance of the static `apiSchema`
     */
    private static get instance();
    /**
     * The `apiSchema` made from `graphQLSchema` or from a ***JSON file*** if allready there
     */
    static get apiSchema(): ApiSchema;
    /**
     * Replace the `graphQLSchema` with an other one
     * to modify `apiSchema`
     */
    static setGraphqlSchema(graphQLSchema: GraphQLSchema): void;
    /**
     * Creating with static init we have the possibility
     * to use this class from anywhere via static calls
     */
    static init(options: GraphQLApiSchemaOptions): GraphQLApiSchema;
    private _apiSchema;
    private _jsonApiSchema;
    private _jsonSpace?;
    private _fileName?;
    private _filePath?;
    constructor(options: GraphQLApiSchemaOptions);
    /**
     * Replace the `graphQLSchema` with an other one to modify `apiSchema`
     */
    setGraphqlSchema(graphQLSchema: GraphQLSchema): void;
    /**
     * The `apiSchema` made from `graphQLSchema`
     */
    get apiSchema(): ApiSchema;
    private readFile;
    private writeFile;
    /**
     * Eliminate recursion referencing the types
     */
    private jsonReplacer;
}
//# sourceMappingURL=GraphQLApiSchema.d.ts.map