import * as process from 'process'
import * as path from 'path'
import * as fs from 'fs'

import { GraphQLSchema, graphqlSync } from 'graphql'

import { IQuery } from './lib/IQuery'
import { ISchema } from './lib/ISchema'
import { getFullTypes } from './lib/getFullTypes'
import { getDirectives } from './lib/getDirectives'
import { TypesToRef } from './lib/TypesToRef'

import { ApiSchema, SchemaField } from './ApiSchema'
import Json from 'json-map-cycle'

/**
 * Options for GraphQLApiSchema constructor's class.
 */
export interface GraphQLApiSchemaOptions {
  /**
   * Hydrate `apiSchema` as initialisation.
   */
  graphqlSchema?: GraphQLSchema
  /**
   * Based on project root.
   * 
   * Mandatory if `fileName` is defined.
   */
  dirName?: string
  /**
   * Write a JSON file each time `apiSchema` is modified.
   * 
   * Hydrate `apiSchema` at initialisation time if `graphQLSchema` is undefined.
   * 
   * Mandatory if `dirName` is defined.
   */
  fileName?: string
  /** `space` parameter of `JSON.stringify`. */
  jsonSpace?: number
}

interface PrivateOptions extends GraphQLApiSchemaOptions {
  isStatic: boolean
}

export class GraphQLApiSchema {
  private static _apiSchema: ApiSchema = {} as ApiSchema

  private static graphqlApiSchema: GraphQLApiSchema

  /**
   * Instance of the static `apiSchema`
   */
  private static get instance(): GraphQLApiSchema {
    if(this.graphqlApiSchema === undefined) {
      throw new Error('apiSchema not defined')
    }
    return this.graphqlApiSchema
  }

  /**
   * The `apiSchema` made from `graphQLSchema` or from a ***JSON file*** if allready there
   */
  static get apiSchema(): ApiSchema {
    return this._apiSchema
  }

  /**
   * Replace the `graphQLSchema` with an other one
   * to modify `apiSchema`
   */
  static setGraphQLSchema(graphqlSchema: GraphQLSchema): void {
    this.instance.setGraphQLSchema(graphqlSchema)
  }

  /**
   * Creating with static init we have the possibility
   * to use this class from anywhere via static calls
   */
  static init(options: GraphQLApiSchemaOptions): GraphQLApiSchema {
    if(this.graphqlApiSchema === undefined) {
      (options as PrivateOptions).isStatic = true
      this.graphqlApiSchema = new GraphQLApiSchema(options)
      return this.graphqlApiSchema
    }
    throw new Error('apiSchema allready defined')
  }

  private _apiSchema?: ApiSchema
  private _jsonApiSchema: string
  private _jsonSpace?: number
  private _fileName?: string
  private _filePath?: string

  public constructor(options: GraphQLApiSchemaOptions) {
    this._jsonSpace = options.jsonSpace
    if(options.dirName && options.fileName) {
      this._fileName = options.fileName
      this._filePath = path.join(process.cwd(), options.dirName, options.fileName)
    } else if (options.dirName !== undefined || options.fileName !== undefined) {
      throw new Error('Both "dirName" and "fileName have to be defined or not')
    }
    if((options as PrivateOptions).isStatic === false) {
      this._apiSchema = {} as ApiSchema
    }
    this._jsonApiSchema = '{}'

    this.readFile()

    if(options.graphqlSchema) {
      this.setGraphQLSchema(options.graphqlSchema)
    }
  }

  /**
   * Replace the `graphQLSchema` with an other one to modify `apiSchema`
   */
  public setGraphQLSchema(graphqlSchema: GraphQLSchema) {
    const iSchemaResult = graphqlSync(graphqlSchema, IQuery)
    const iSchemaData = iSchemaResult.data
    if (iSchemaResult.errors) {
      throw new Error(iSchemaResult.errors.toString());
    }
    if (iSchemaData === undefined || iSchemaData === null) {
      throw new Error('iSchemaData not defined')
    }
    const iSchema: ISchema = iSchemaData.__schema

    const apiSchema = this.apiSchema

    apiSchema.queryTypeName = iSchema.queryType?.name ?? 'Query'
    apiSchema.mutationTypeName = iSchema.mutationType?.name ?? 'Mutation'
    apiSchema.subscriptionTypeName = iSchema.subscriptionType?.name ?? 'Subscription'

    apiSchema.directives = getDirectives(iSchema.directives)
    apiSchema.types = getFullTypes(iSchema.types)
    apiSchema.queries = apiSchema.types.get(apiSchema.queryTypeName)?.fields as Map<string, SchemaField>
    apiSchema.mutations = apiSchema.types.get(apiSchema.mutationTypeName)?.fields as Map<string, SchemaField>
    apiSchema.subscriptions = apiSchema.types.get(apiSchema.subscriptionTypeName)?.fields as Map<string, SchemaField>

    TypesToRef.ref(apiSchema)

    function replacer(this: any, key: string, value: any): any {
      if(key && key === 'of') {
        return { $ref: `$[\"types\"][\"${value.name}\"]` }
      }
    }

    const jsonApiSchema = Json.stringify(apiSchema, replacer, this._jsonSpace)
    if(jsonApiSchema !== this._jsonApiSchema) {
      this._jsonApiSchema = jsonApiSchema
      this.writeFile()
    }
  }

  /**
   * The `apiSchema` made from `graphQLSchema`
   */
  public get apiSchema(): ApiSchema {
    return this._apiSchema ?? GraphQLApiSchema._apiSchema
  }

  private readFile() {
    if(this._filePath) {
      try {
        this._jsonApiSchema = fs.readFileSync(this._filePath).toLocaleString()
        const apiSchema = Json.parse(this._jsonApiSchema)
        if(this._apiSchema) {
          Object.assign(this._apiSchema, apiSchema)
        } else {
          Object.assign(GraphQLApiSchema._apiSchema, apiSchema)
        }
      } catch {
        console.info(`file ${this._fileName} not already defined`)
      }
    }
  }

  private writeFile() {
    if(this._filePath) {
      if(this._jsonApiSchema === '{}') {
        throw new Error('jsonApiSchema not defined');
      }
      fs.writeFileSync(
        this._filePath,
        this._jsonApiSchema,
      )
    }
  }

}
export const apiSchema = GraphQLApiSchema.apiSchema
