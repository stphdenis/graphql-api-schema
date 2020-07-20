import * as process from 'process'
import * as path from 'path'
import * as fs from 'fs'
import * as cycle from 'cycle'

import { GraphQLSchema, graphqlSync } from 'graphql'

import { IQuery } from './lib/ISchema'
import { getFullTypes } from './lib/getFullTypes'
import { getDirectives } from './lib/getDirectives'
import { refTypesToRef } from './lib/objectToRef'

import { ApiSchema } from './ApiSchema'

export interface GraphQLApiSchemaOptions {
  /**
   * 
   */
  graphQLSchema?: GraphQLSchema

  /**
   * Write a JSON file each time `apiSchema` is modified
   * (`fileName` mandatory if informed)
   */
  dirName?: string
  /**
   * Write a JSON file each time `apiSchema` is modified
   * (`dirName` mandatory if informed)
   */
  fileName?: string
  /** `space` parameter of JSON.stringify */
  jsonSpace?: number
}

export class GraphQLApiSchema {
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
    return this.instance.apiSchema
  }

  /**
   * Replace the `graphQLSchema` with an other one
   * to modify `apiSchema`
   */
  static setGraphqlSchema(graphQLSchema: GraphQLSchema): void {
    this.instance.setGraphqlSchema(graphQLSchema)
  }

  /**
   * Creating with static init we have the possibility
   * to use this class from anywhere via static calls
   */
  static init(options: GraphQLApiSchemaOptions): GraphQLApiSchema {
    if(this.graphqlApiSchema === undefined) {
      this.graphqlApiSchema = new GraphQLApiSchema(options)
      return this.graphqlApiSchema
    }
    throw new Error('apiSchema allready defined')
  }

  private _apiSchema: ApiSchema
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
    this._apiSchema = {} as ApiSchema
    this._jsonApiSchema = '{}'

    this.readFile()

    if(options.graphQLSchema) {
      this.setGraphqlSchema(options.graphQLSchema)
    }
  }

  /**
   * Replace the `graphQLSchema` with an other one to modify `apiSchema`
   */
  public setGraphqlSchema(graphQLSchema: GraphQLSchema) {
    const iSchema = graphqlSync(graphQLSchema, IQuery).data?.__schema

    this._apiSchema.queryTypeName = iSchema.queryType?.name ?? 'Query'
    this._apiSchema.mutationTypeName = iSchema.mutationType?.name ?? 'Mutation'
    this._apiSchema.subscriptionTypeName = iSchema.subscriptionType?.name ?? 'Subscription'

    this._apiSchema.types = getFullTypes(iSchema.types)

    const directives = getDirectives(iSchema.directives)
    this._apiSchema.directives = directives.directives
    this._apiSchema.directiveList = directives.directiveList

    refTypesToRef(this._apiSchema)

    const jsonApiSchema = JSON.stringify(this._apiSchema, this.jsonReplacer, this._jsonSpace)
    if(jsonApiSchema !== this._jsonApiSchema) {
      this._jsonApiSchema = jsonApiSchema
      this.writeFile()
    }
  }

  /**
   * The `apiSchema` made from `graphQLSchema`
   */
  public get apiSchema(): ApiSchema {
    return this._apiSchema
  }

  private readFile() {
    if(this._filePath) {
      try {
        this._jsonApiSchema = fs.readFileSync(this._filePath).toLocaleString()
        this._apiSchema = cycle.retrocycle(JSON.parse(this._jsonApiSchema))
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

  /**
   * Eliminate recursion referencing the types
   */
  private jsonReplacer(key: string, value: any) {
    if(key && key === 'of') {
      return { $ref: `$[\"types\"][\"${value.name}\"]` }
    }
    return value
  }
}
