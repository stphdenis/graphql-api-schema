import {
  SchemaTypeRef,
  SchemaFullType,
  ApiSchema
} from "../ApiSchema"

export class TypesToRef {
  static refsToRefer = new Array<{typeRef: SchemaTypeRef, name: string}>()
  static reset() {
    this.refsToRefer = []
  }
  
  static add(typeRef: SchemaTypeRef, name: string) {
    this.refsToRefer.push({typeRef, name})
  }
  
  static ref(apiSchema: ApiSchema): void {
    this.refsToRefer.forEach(ref => {
      ref.typeRef.of = apiSchema.types.get(ref.name) as SchemaFullType
    })
    this.refsToRefer = []
  }
}
/*
let refsToRefer = new Array<{typeRef: SchemaTypeRef, name: string}>()
export function resetTypesToRef() {
  refsToRefer = []
}

export function addTypeToRef(typeRef: SchemaTypeRef, name: string) {
  refsToRefer.push({typeRef, name})
}

export function refTypesToRef(apiSchema: ApiSchema): void {
  refsToRefer.forEach(ref => {
    ref.typeRef.of = apiSchema.types.get(ref.name) as SchemaFullType
  })
  refsToRefer = []
}
*/