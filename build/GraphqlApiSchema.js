"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLApiSchema = void 0;
const process = require("process");
const path = require("path");
const fs = require("fs");
const cycle = require("cycle");
const graphql_1 = require("graphql");
const IQuery_1 = require("./lib/IQuery");
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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const iSchemaResult = graphql_1.graphqlSync(graphQLSchema, IQuery_1.IQuery);
        const iSchemaData = iSchemaResult.data;
        if (iSchemaResult.errors) {
            throw new Error(iSchemaResult.errors.toString());
        }
        if (iSchemaData === undefined || iSchemaData === null) {
            throw new Error('iSchemaData not defined');
        }
        const iSchema = iSchemaData.__schema;
        this._apiSchema.queryTypeName = (_b = (_a = iSchema.queryType) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Query';
        this._apiSchema.mutationTypeName = (_d = (_c = iSchema.mutationType) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : 'Mutation';
        this._apiSchema.subscriptionTypeName = (_f = (_e = iSchema.subscriptionType) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : 'Subscription';
        const types = getFullTypes_1.getFullTypes(iSchema.types);
        this._apiSchema.types = types.types;
        this._apiSchema.typeList = types.typeList;
        const directives = getDirectives_1.getDirectives(iSchema.directives);
        this._apiSchema.directives = (_g = directives.directives) !== null && _g !== void 0 ? _g : {};
        this._apiSchema.directiveList = (_h = directives.directiveList) !== null && _h !== void 0 ? _h : [];
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
