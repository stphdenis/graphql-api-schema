# graphql-api-schema

Generates a simple schema from GraphQLSchema to give simple way to navigate into with `typescript`.

Can generate and update a JSON file each time `apiSchema` is modified by a new `graphQLSchema`.

The JSON file hydrate `apiSchema` at initialisation when `graphQLSchema` is not given.

## Examples

```ts
import { apiSchema } from 'graphql-api-schema'

// List of directives
apiSchema.directiveList // => [ 'include', 'skip', 'deprecated' ]

// Args of directive 'skip'
apiSchema.directives['skip'].argList // => [ 'if' ]
```

`apiSchema.directives['skip'].args['if']` gives :

```js
 {
  name: 'if',
  description: 'Skipped when true.',
  type: {
    isList: false,
    isNullable: false,
    of: {
      kind: 'SCALAR',
      name: 'Boolean',
      description: 'The `Boolean` scalar type represents `true` or `false`.'
    }
  },
  defaultValue: null
}
```

## Initialisation

```ts
import { GraphQLApiSchema } from 'graphql-api-schema'
GraphQLApiSchema.init({
  // From root of project
  dirName: 'src'
  // File not modified if not different
  fileName: 'apiSchema.json'
  // Same parameter as for JSON.stringify
  jsonSpaces: 2
})
```

File generation is optional.
