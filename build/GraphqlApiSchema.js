"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLApiSchema = void 0;
const process = require("process");
const path = require("path");
const fs = require("fs");
const cycle = require("cycle");
const graphql_1 = require("graphql");
const ISchema_1 = require("./lib/ISchema");
const getFullTypes_1 = require("./lib/getFullTypes");
const getDirectives_1 = require("./lib/getDirectives");
const objectToRef_1 = require("./lib/objectToRef");
class GraphQLApiSchema {
    constructor(options) {
        this._jsonSpace = options.jsonSpace;
        if (options.dirName && options.fileName) {
            this._fileName = options.fileName;
            this._filePath = path.join(process.cwd(), options.dirName, options.fileName);
        }
        else if (options.dirName !== undefined || options.fileName !== undefined) {
            throw new Error('Both "dirName" and "fileName have to be defined or not');
        }
        this._apiSchema = {};
        this._jsonApiSchema = '{}';
        this.readFile();
        if (options.graphQLSchema) {
            this.setGraphqlSchema(options.graphQLSchema);
        }
    }
    /**
     * Instance of the static `apiSchema`
     */
    static get instance() {
        if (this.graphqlApiSchema === undefined) {
            throw new Error('apiSchema not defined');
        }
        return this.graphqlApiSchema;
    }
    /**
     * The `apiSchema` made from `graphQLSchema` or from a ***JSON file*** if allready there
     */
    static get apiSchema() {
        return this.instance.apiSchema;
    }
    /**
     * Replace the `graphQLSchema` with an other one
     * to modify `apiSchema`
     */
    static setGraphqlSchema(graphQLSchema) {
        this.instance.setGraphqlSchema(graphQLSchema);
    }
    /**
     * Creating with static init we have the possibility
     * to use this class from anywhere via static calls
     */
    static init(options) {
        if (this.graphqlApiSchema === undefined) {
            this.graphqlApiSchema = new GraphQLApiSchema(options);
            return this.graphqlApiSchema;
        }
        throw new Error('apiSchema allready defined');
    }
    /**
     * Replace the `graphQLSchema` with an other one to modify `apiSchema`
     */
    setGraphqlSchema(graphQLSchema) {
        var _a, _b, _c, _d, _e, _f, _g;
        const iSchema = (_a = graphql_1.graphqlSync(graphQLSchema, ISchema_1.IQuery).data) === null || _a === void 0 ? void 0 : _a.__schema;
        this._apiSchema.queryTypeName = (_c = (_b = iSchema.queryType) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : 'Query';
        this._apiSchema.mutationTypeName = (_e = (_d = iSchema.mutationType) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : 'Mutation';
        this._apiSchema.subscriptionTypeName = (_g = (_f = iSchema.subscriptionType) === null || _f === void 0 ? void 0 : _f.name) !== null && _g !== void 0 ? _g : 'Subscription';
        this._apiSchema.types = getFullTypes_1.getFullTypes(iSchema.types);
        const directives = getDirectives_1.getDirectives(iSchema.directives);
        this._apiSchema.directives = directives.directives;
        this._apiSchema.directiveList = directives.directiveList;
        objectToRef_1.refTypesToRef(this._apiSchema);
        const jsonApiSchema = JSON.stringify(this._apiSchema, this.jsonReplacer, this._jsonSpace);
        if (jsonApiSchema !== this._jsonApiSchema) {
            this._jsonApiSchema = jsonApiSchema;
            this.writeFile();
        }
    }
    /**
     * The `apiSchema` made from `graphQLSchema`
     */
    get apiSchema() {
        return this._apiSchema;
    }
    readFile() {
        if (this._filePath) {
            try {
                this._jsonApiSchema = fs.readFileSync(this._filePath).toLocaleString();
                this._apiSchema = cycle.retrocycle(JSON.parse(this._jsonApiSchema));
            }
            catch (_a) {
                console.info(`file ${this._fileName} not already defined`);
            }
        }
    }
    writeFile() {
        if (this._filePath) {
            if (this._jsonApiSchema === '{}') {
                throw new Error('jsonApiSchema not defined');
            }
            fs.writeFileSync(this._filePath, this._jsonApiSchema);
        }
    }
    /**
     * Eliminate recursion referencing the types
     */
    jsonReplacer(key, value) {
        if (key && key === 'of') {
            return { $ref: `$[\"types\"][\"${value.name}\"]` };
        }
        return value;
    }
}
exports.GraphQLApiSchema = GraphQLApiSchema;
