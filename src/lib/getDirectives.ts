import { SchemaDirectives, SchemaDirective } from "../GraphqlApiSchema"
import { GraphQLDirective } from "./GraphqlISchema"
import { getInputValues } from "./getInputValues"

export function getDirectives(types: GraphQLDirective[]|null):
{ directives?: SchemaDirectives
  directiveList?: string[]
} {
  if(types && types.length > 0) {
    const schemas: SchemaDirectives = {}
    const schemaList: string[] = []

    for(const type of types) {
      schemaList.push(type.name)
      const schema = {} as SchemaDirective
      schemas[type.name] = schema

      schema.name = type.name
      schema.description = type.description ?? undefined
      schema.locations = type.locations ?? undefined

      const args = getInputValues(type.args)
      schema.args = args.inputValues
      schema.argList = args.inputList
    }
    return {
      directives: schemas,
      directiveList: schemaList,
    }
  }
  return {
    directives: undefined,
    directiveList: undefined,
  }
}
