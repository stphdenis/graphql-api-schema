import { GraphQLSchema, graphqlSync } from 'graphql'

import { introspectionQuery } from './lib/GraphqlISchema'
import { getFullTypes } from './lib/getFullTypes'
import { getDirectives } from './lib/getDirectives'
import { refTypesToRef } from './lib/objectToRef'

import * as process from 'process'
import * as path from 'path'
import * as fs from 'fs'
import * as cycle from 'cycle'

export interface SchemaTypeRef {
  isNullable: boolean
  isList: boolean
  of: SchemaFullType
}
export interface SchemaTypeRefs {
  [key: string]: SchemaTypeRef
}

export interface SchemaInputValue {
  name: string
  description?: string
  type: SchemaTypeRef
  defaultValue: any|null
}
export interface SchemaInputValues {
  [key: string]: SchemaInputValue
}

export interface SchemaField {
  name: string
  description?: string
  args?: SchemaInputValues
  argList?: string[]
  type: SchemaTypeRef
  isDeprecated: boolean
  deprecationReason?: string
}
export interface SchemaFields {
  [key: string]: SchemaField
}

export interface SchemaEnumValue {
  name: string
  description?: string
  isDeprecated: boolean
  deprecationReason?: string
}
export interface SchemaEnumValues {
  [key: string]: SchemaEnumValue
}

export interface SchemaFullType {
  kind: 'OBJECT'|'SCALAR'|'ENUM'|'INPUT_OBJECT'|'INTERFACE'
  name: string
  description?: string
  fields?: SchemaFields
  fieldList?: string[]
  inputFields?: SchemaInputValues
  inputFieldList?: string[]
  interfaces?: SchemaTypeRefs
  interfaceList?: string[]
  enumValues?: SchemaEnumValues
  enumList?: string[]
  possibleTypes?: SchemaTypeRefs
  possibleTypeList?: string[]
}
export interface SchemaFullTypes {
  [key: string]: SchemaFullType
}

export interface SchemaDirective {
  name: string
  description?: string
  locations?: string[]
  args?: SchemaInputValues
  argList?: string[]
}
export interface SchemaDirectives {
  [key: string]: SchemaDirective
}

export interface ApiSchema {
  queryTypeName: string
  mutationTypeName: string
  subscriptionTypeName: string
  types: SchemaFullTypes
  directives?: SchemaDirectives
  directiveList?: string[]
}

export interface GraphqlApiSchemaOptions {
  dirName: string
  fileName: string
  jsonSpace?: number
}

export class GraphqlApiSchema {
  private static graphqlApiSchema: GraphqlApiSchema
  private static get instance(): GraphqlApiSchema {
    if(this.graphqlApiSchema === undefined) {
      throw new Error('apiSchema not defined')
    }
    return this.graphqlApiSchema
  }
  static get apiSchema(): ApiSchema|undefined {
    return this.instance.apiSchema
  }
  static setGraphqlSchema(graphQLSchema: GraphQLSchema): void {
    this.instance.setGraphqlSchema(graphQLSchema)
  }

  private _apiSchema?: ApiSchema
  private _jsonApiSchema?: string
  private _jsonSpace?: number
  private _fileName?: string
  private _filePath?: string

  /**
   * constructor
   */
  public constructor(options: GraphqlApiSchemaOptions) {
    if(GraphqlApiSchema.graphqlApiSchema === undefined) {
      GraphqlApiSchema.graphqlApiSchema = this
    } else {
      throw new Error('GraphqlApiSchema allready created')
    }

    this._jsonSpace = options.jsonSpace
    if(options.dirName && options.fileName) {
      this._fileName = options.fileName
      this._filePath = path.join(process.cwd(), options.dirName, options.fileName)
    }

    this.readFile()
  }

  public setGraphqlSchema(graphQLSchema: GraphQLSchema) {
    this._apiSchema = {} as ApiSchema
    const iSchema = graphqlSync(graphQLSchema, introspectionQuery).data?.__schema

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

  public get apiSchema(): ApiSchema|undefined {
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
      if(this._jsonApiSchema === undefined) {
        throw new Error('jsonApiSchema not defined');
      }
      fs.writeFileSync(
        this._filePath,
        this._jsonApiSchema,
      )
    }
  }

  private jsonReplacer(key: string, value: any) {
    if(key && key === 'of') {
      return { $ref: `$[\"types\"][\"${value.name}\"]` }
    }
    return value
  }
}
