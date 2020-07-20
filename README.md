# graphql-api-schema

Generates objects from GraphQLSchema to give simple way to navigate into with `typescript`.

## Examples

```ts
import { apiSchema } from 'graphql-api-schema'

// List of directives
apiSchema.directiveList // => [ 'include', 'skip', 'deprecated' ]

// args of directive skip
apiSchema.directives?.['skip'].argList // => [ 'if' ]
```

`apiSchema.directives?.['skip'].args?.['if']` gives :

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

## Init

```ts
import { GraphqlApiSchema } from 'graphql-api-schema'
new GraphqlApiSchema()
```

