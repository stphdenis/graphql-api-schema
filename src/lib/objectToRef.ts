import {
  SchemaTypeRef,
  SchemaFullTypes,
  ApiSchema
} from "../GraphqlApiSchema"

let refsToRefer = new Array<{typeRef: SchemaTypeRef, name: string}>()
export function resetTypesToRef() {
  refsToRefer = []
}

export function addTypeToRef(typeRef: SchemaTypeRef, name: string) {
  refsToRefer.push({typeRef, name})
}

export function refTypesToRef(apiSchema: ApiSchema): void {
  const schemaTypes: SchemaFullTypes = apiSchema.types
  refsToRefer.forEach(ref => {
    ref.typeRef.of = schemaTypes[ref.name]
  })
  refsToRefer = []
}
