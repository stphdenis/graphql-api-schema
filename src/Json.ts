import * as cycle from 'cycle'

export type Reviver = (key: string, value: any, reviver?: Reviver) => any

export interface JsonOptions {
  parse: {
    /** Interprete { "anyKey": { "$set": [...] } } as a set */
    setSchema: '$set'|false
    /**
     * Keys to consider a value as a Set.
     * 
     * Can't be '$set' if mapSchema === '$set'
     */
    setKeys: string[]|null

    /** Interprete { "anyKey": { "$map": [...] } } as a map */
    mapSchema: '$map'|false
    /**
     * Keys to consider a value as a Map.
     * 
     * Can't be '$map' if mapSchema === '$map'
     */
    mapKeys: string[]|null

    /** Interprete { "anyKey": { "$date": "..." } } as a date */
    dateSchema: '$date'|false
    /**
     * Keys to consider a value as a Date.
     * 
     * Can't be '$date' if dateSchema === '$date'
     */
    dateKeys: string[]|null
    /** Date convertion */
    dateType: "String"|"Date"
  }
  stringify: {
    setSchema: '$set'|'array'
    mapSchema: '$map'|'array'
    dateSchema: '$date'|false
    dateFormat: 'JSON' // ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
              | 'UTC', // "HTTP-date" from RFC 7231 (Ddd, JJ Mmm YYYY HH:mm:ss GMT)
  }
}

const defaultJsonOptions: JsonOptions = {
  parse: {
    dateSchema: false,
    dateKeys: null,
    dateType: "Date",
    
    setSchema: '$set',
    setKeys: null,
    
    mapSchema: '$map',
    mapKeys: null,
  },
  stringify: {
    dateSchema: false,
    dateFormat: 'JSON',

    setSchema: '$set',

    mapSchema: '$map',
  },
}

type Replacer = ((this: any, key: string, value: any) => any)
              | null
                     
export class Json {
  private static _json: Json = new Json()
  static parse(text: string, reviver?: Reviver): any {
    return this._json.parse(text, reviver)
  }
  static setOptions(options: JsonOptions) {
    this._json.setOptions(options)
  }
  static stringify(value: any, replacer?: Replacer, space?: string|number): string {
    return this._json.stringify(value, replacer, space)
  }

  #options: JsonOptions
  constructor(options?: JsonOptions) {
    this.#options = defaultJsonOptions
    if (options) {
      Object.assign(this.#options.parse, options.parse)
      Object.assign(this.#options.stringify, options.stringify)
    }
  }

  setOptions(options: JsonOptions) {
    Object.assign(
      this.#options.parse,
      options.parse,
    )
    Object.assign(
      this.#options.stringify,
      options.stringify,
    )
  }

  stringify(value: any, replacer?: Replacer, space?: string|number): string {
    return JSON.stringify(value, this.replacer(replacer), space)
  }

  replacer(replace?: Replacer): (this: any, key: string, value: any) => any {
    const that = this
    /**
     * Eliminate recursion referencing the types
     */
    function replacer(key: string, value: any): any {
      const options = that.#options.stringify
      if(key && key === 'of') {
        return { $ref: `$[\"types\"][\"${value.name}\"]` }
      }
      if (value instanceof Set) {
        if (options.setSchema === '$set') {
          return { $set: [...value] }
        } else {
          return [...value]
        }
      }
      if (value instanceof Map) {
        if (options.mapSchema === '$map') {
          return { $map: [...value] }
        } else {
          return [...value]
        }
      }
      if (options.dateSchema === '$date' && value instanceof Date) {
        if (options.dateFormat === 'JSON') {
          return { $date: value.toJSON() }
        } else {
          return { $date: value.toUTCString() }
        }
      }
      return value
    }

    if (replace) {
      return function replacerHelper(key: string, value: any) {
        const data = replace.call(this, key, value)
        if (data !== value) {
          return data
        }
        return replacer.call(this, key, value)
      }
    }
    return replacer
  }


  parse(text: string, reviver?: Reviver) {
    return cycle.retrocycle(JSON.parse(text, reviver ?? this.reviver))
  }

  reviver(key: string, value: any) {
    if (key && value &&
      typeof value === 'object' &&
      value instanceof Array === false
    ) {
      const options = this.#options.parse
      if (options.setSchema === '$set' && value['$set']) return new Set(value['$set'])
      if (options.setKeys?.includes(key)) return new Set(value)

      if (options.mapSchema === '$map' && value['$map']) return new Map(value['$map'])
      if (options.mapKeys?.includes(key)) return new Map(value)

      if (options.dateSchema === '$date' && value['$date']) {
        if (options.dateType === 'Date') {
          return new Date(value['$date'])
        } else {
          return value['$date']
        }
      }
      if (options.dateKeys?.includes(key)) {
        if (options.dateType === 'Date') {
          return new Date(value)
        } else {
          return value
        }
      }


      if (options.dateType === 'Date') {
        if (options.dateSchema === '$date' && value['$date']) {
          return new Date(value['$date'])
        }
        if (options.dateKeys?.includes(key)) {
          return new Date(value)
        }
        if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {// TODO: A terminer !!!!!!
          return new Date(value)
        }
      } else {
        if (options.dateSchema === '$date' && value['$date']) {
          return value['$date']
        }
        return value
      }

    }
    return value
  }
}
