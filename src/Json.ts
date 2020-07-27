import * as cycle from 'cycle'

interface ParseOptions {
  /**
   * Parse `{ "anyKey": { "$set": [...] } }`
   * 
   * default: '$set'
   */
  setSchema?: '$set'|false
  /**
   * Keys to consider a value as a Set.
   * 
   * A key can't begin by '$'
   */
  setStringKeys?: string[]|null
  /**
   * Keys to consider a value as a Set.
   * 
   * Ex: /^\w*Set|\w*-set$/ => 'xxxSet' et 'xxx-set'
   * 
   * A key can't begin by '$'
   */
  setRegexKeys?: RegExp|null,

  /**
   * Parse `{ "anyKey": { "$map": [...] } }`
   * 
   * default: '$map'
   */
  mapSchema?: '$map'|false
  /**
   * Keys to consider a value as a Map.
   * 
   * A key can't begin by '$'
   */
  mapStringKeys?: string[]|null
  /**
   * Keys to consider a value as a Map.
   * 
   * Ex: /^\w*Map|\w*-map$/ => 'xxxMap' et 'xxx-map'
   * 
   * A key can't begin by '$'
   */
  mapRegexKeys?: RegExp|null,

  /**
   * '$Date' => { "anyKey": { "$date": "..." } }
   * 
   * 'JSON&UTC' => { "anyKey": "2020-07-27T09:49:00.947Z" }
   * 
   * 'JSON&UTC' => { "anyKey": "Mon, 27 Jul 2020 09:50:51 GMT" }
   * 
   * default: ['$date', 'JSON&UTC']
   */
  dateSchema?: ('$date'|'JSON&UTC')[]
  /**
   * Keys to consider a value as a Date.
   * 
   * A key can't begin by '$'
   */
  dateStringKeys?: string[]|null
  /**
   * Keys to consider a value as a Date.
   * 
   * Ex: /^\w*Date|\w*-date$/ => '*Date' et '*-date'
   * 
   * A key can't begin by '$'
   */
  dateRegexKeys?: RegExp|null,
  /**
   * If dateType = "Date" then
   * 
   * Parse to `{ "anyKey": new Date("...") }`
   * 
   * If dateType = "String" then
   * 
   * Parse to `{ "anyKey": "..." }`
   */
  dateType?: "String"|"Date"
}
interface StringifyOptions {
  setSchema?: '$set'|'array'
  mapSchema?: '$map'|'array'
  dateSchema?: '$date'|false
  dateFormat?: 'JSON' // ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
             | 'UTC', // "HTTP-date" from RFC 7231 (Ddd, JJ Mmm YYYY HH:mm:ss GMT)
}
export interface JsonOptions {
  parse?: ParseOptions
  stringify?: StringifyOptions
}

interface Options {
  parse: Required<ParseOptions>
  stringify: Required<StringifyOptions>
}

const defaultJsonOptions: Options = {
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

type Reviver = (this: any, key: string, value: any) => any
type Replacer = (this: any, key: string, value: any) => any

export class Json {
  private static _json: Json = new Json()
  static parse(text: string, reviver?: Reviver): any {
    return this._json.parse(text, reviver)
  }
  static setOptions(options: JsonOptions) {
    this._json.setOptions(options)
  }
  static stringify(value: any, replacer?: Replacer|null, space?: string|number): string {
    return this._json.stringify(value, replacer, space)
  }

  #options: Options
  constructor(options?: JsonOptions) {
    this.#options = defaultJsonOptions
    if (options) {
      this.setOptions(options)
    }
  }

  setOptions(options: JsonOptions) {
    Object.assign(this.#options.parse, options.parse)
    Object.assign(this.#options.stringify, options.stringify)
  }

  stringify(value: any, replacer?: Replacer|null, space?: string|number): string {
    return JSON.stringify(value, this.replacer(replacer), space)
  }

  private replacer(replace?: Replacer|null): (this: any, key: string, value: any) => any {
    const that = this
    /**
     * Eliminate recursion referencing the types
     */
    function replacer(this: any, key: string, value: any): any {
      const options = that.#options.stringify
      if (value instanceof Set) {
        if (options.setSchema === '$set') {
          return { $set: [...value] }
        } else { // options.setSchema === 'array'
          return [...value]
        }
      }
      if (value instanceof Map) {
        if (options.mapSchema === '$map') {
          return { $map: [...value] }
        } else { // options.mapSchema === 'array'
          return [...value]
        }
      }
      if (options.dateSchema === '$date' && value instanceof Date) {
        if (options.dateFormat === 'JSON') {
          return { $date: value.toJSON() }
        } else { // options.dateFormat === 'UTC'
          return { $date: value.toUTCString() }
        }
      }
      return value
    }

    if (replace) {
      return function replacerHelper(this: any, key: string, value: any) {
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
    return cycle.retrocycle(JSON.parse(text, this.reviver(reviver)))
  }

  private reviver(revive?: Reviver): Reviver {
    const that = this
    function reviver(this: any, key: string, value: any) {
      if (key && value &&
        typeof value === 'object' &&
        value instanceof Array === false
      ) {
        const options = that.#options.parse
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

    if (revive) {
      return function reviverHelper(this: any, key: string, value: any) {
        const data = revive.call(this, key, value)
        if (data !== value) {
          return data
        }
        return reviver.call(this, key, value)
      }
    }
    return reviver
  }
}
