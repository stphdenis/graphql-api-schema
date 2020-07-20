"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphqlApiSchema = void 0;
const graphql_1 = require("graphql");
const GraphqlISchema_1 = require("./lib/GraphqlISchema");
const getFullTypes_1 = require("./lib/getFullTypes");
const getDirectives_1 = require("./lib/getDirectives");
const objectToRef_1 = require("./lib/objectToRef");
const process = require("process");
const path = require("path");
const fs = require("fs");
const cycle = require("cycle");
class GraphqlApiSchema {
    /**
     * constructor
     */
    constructor(options) {
        if (GraphqlApiSchema.graphqlApiSchema === undefined) {
            GraphqlApiSchema.graphqlApiSchema = this;
        }
        else {
            throw new Error('GraphqlApiSchema allready created');
        }
        this._jsonSpace = options.jsonSpace;
        if (options.dirName && options.fileName) {
            this._fileName = options.fileName;
            this._filePath = path.join(process.cwd(), options.dirName, options.fileName);
        }
        this.readFile();
    }
    static get instance() {
        if (this.graphqlApiSchema === undefined) {
            throw new Error('apiSchema not defined');
        }
        return this.graphqlApiSchema;
    }
    static get apiSchema() {
        return this.instance.apiSchema;
    }
    static setGraphqlSchema(graphQLSchema) {
        this.instance.setGraphqlSchema(graphQLSchema);
    }
    setGraphqlSchema(graphQLSchema) {
        var _a, _b, _c, _d, _e, _f, _g;
        this._apiSchema = {};
        const iSchema = (_a = graphql_1.graphqlSync(graphQLSchema, GraphqlISchema_1.introspectionQuery).data) === null || _a === void 0 ? void 0 : _a.__schema;
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
            if (this._jsonApiSchema === undefined) {
                throw new Error('jsonApiSchema not defined');
            }
            fs.writeFileSync(this._filePath, this._jsonApiSchema);
        }
    }
    jsonReplacer(key, value) {
        if (key && key === 'of') {
            return { $ref: `$[\"types\"][\"${value.name}\"]` };
        }
        return value;
    }
}
exports.GraphqlApiSchema = GraphqlApiSchema;
