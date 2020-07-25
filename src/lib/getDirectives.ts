import { SchemaDirective } from "../ApiSchema"

import { GraphQLDirective } from "./ISchema"
import { getInputValues } from "./getInputValues"

export function getDirectives(directives: GraphQLDirective[]|null)
: Map<string, SchemaDirective>
{
  const schemas = new Map<string, SchemaDirective>()
  if(directives && directives.length > 0) {
    for(const directive of directives) {
      const schema = {
        name: directive.name,
        description: directive.description ?? undefined,
        locations: directive.locations ?? [],
        args: getInputValues(directive.args),
      }
      schemas.set(schema.name, schema)
    }
  }
  return schemas
}
