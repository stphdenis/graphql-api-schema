import { SchemaDirectives, SchemaDirective } from "../ApiSchema"
import { GraphQLDirective } from "./ISchema"
import { getInputValues } from "./getInputValues"

export function getDirectives(types: GraphQLDirective[]|null):
{ directives: SchemaDirectives
  directivesMap: Map<string, SchemaDirective>
} {
  const schemas: SchemaDirectives = {}
  const schemasMap = new Map<string, SchemaDirective>()
  if(types && types.length > 0) {
    for(const type of types) {
      const schema = {} as SchemaDirective
      schema.name = type.name
      schema.description = type.description ?? undefined
      schema.locations = type.locations ?? []
      
      const args = getInputValues(type.args)
      schema.args = args.inputValues
      schema.argList = [...args.inputValuesMap.keys()]
      schema.argsMap = args.inputValuesMap

      schemas[schema.name] = schema
      schemasMap.set(schema.name, schema)
    }
  }
  return {
    directives: schemas,
    directivesMap: schemasMap,
  }
}
