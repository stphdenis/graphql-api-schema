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
    setStringKeys: string[]|null
    /**
     * Keys to consider a value as a Set.
     * Ex: /^\w*Set|\w*-set$/ => '*Set' et '*-set'
     * 
     * Can't be '$set' if mapSchema === '$set'
     */
    setRegexKeys: RegExp|null,

    /** Interprete { "anyKey": { "$map": [...] } } as a map */
    mapSchema: '$map'|false
    /**
     * Keys to consider a value as a Map.
     * 
     * Can't be '$map' if mapSchema === '$map'
     */
    mapStringKeys: string[]|null
    /**
     * Keys to consider a value as a Map.
     * Ex: /^\w*Map|\w*-map$/ => '*Map' et '*-map'
     * 
     * Can't be '$map' if mapSchema === '$map'
     */
    mapRegexKeys: RegExp|null,

    /**
     * '$Date' => { "anyKey": { "$date": "..." } }
     * 'JSON&UTC' => { "anyKey": "2020-07-27T09:49:00.947Z" }
     * 'JSON&UTC' => { "anyKey": "Mon, 27 Jul 2020 09:50:51 GMT" }
     */
    dateSchema: ('$date'|'JSON&UTC')[]
    /**
     * Keys to consider a value as a Date.
     * 
     * Can't be '$date' if dateSchema === '$date'
     */
    dateStringKeys: string[]|null
    /**
     * Keys to consider a value as a Date.
     * Ex: /^\w*Date|\w*-date$/ => '*Date' et '*-date'
     * 
     * Can't be '$date' if dateSchema === '$date'
     */
    dateRegexKeys: RegExp|null,
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
    dateSchema: ['$date', 'JSON&UTC'],
    dateStringKeys: null,
    dateRegexKeys: null,
    dateType: "Date",
    
    setSchema: '$set',
    setStringKeys: null,
    setRegexKeys: null,
    
    mapSchema: '$map',
    mapStringKeys: null,
    mapRegexKeys: null,
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
      if (options.setStringKeys?.includes(key)) return new Set(value)
      if (options.setRegexKeys?.test(key)) return new Set(value)

      if (options.mapSchema === '$map' && value['$map']) return new Map(value['$map'])
      if (options.mapStringKeys?.includes(key)) return new Map(value)
      if (options.mapRegexKeys?.test(key)) return new Map(value)

      if (options.dateType === 'Date') {
        if (options.dateSchema.includes('$date') && value['$date']) {
          return new Date(value['$date'])
        }
        if (options.dateStringKeys?.includes(key)) {
          return new Date(value)
        }
        if (options.dateRegexKeys?.test(key)) {
          return new Date(value)
        }
        // YYYY-MM-DDTHH:mm:ss.sssZ | Ddd, JJ Mmm YYYY HH:mm:ss GMT
        if (options.dateSchema.includes('JSON&UTC') &&
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$|^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(value)
        ) {
          return new Date(value)
        }
      } else {
        if (options.dateSchema.includes('$date') && value['$date']) {
          return value['$date']
        }
      }
    }
    return value
  }
}
