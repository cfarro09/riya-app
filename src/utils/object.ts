export const isEmpty = (object: any) => {
  return Object.keys(object).length === 0 && object.constructor === Object
}

export const getEnumNames = (e: any): string[] => {
  let vals = _getEnumObjValues(e)
  return vals.filter((v) => typeof v === 'string') as string[]
}

export const getEnumValues = <T extends number>(e: any): T[] => {
  let vals = _getEnumObjValues(e)
  return vals.filter((v) => typeof v === 'number') as T[]
}

const _getEnumObjValues = (e: any): (number | string)[] => {
  let keys = Object.keys(e)
  return keys.map((k) => e[k])
}

export const parseEnumValue = (type: any, val: string, shouldThrow: boolean = true): any => {
  let cleanVal = val.trim()
  if (type == null || type == undefined)
    throw new Error("Called parseEnumValue but didn't pass a type")
  let res = type[cleanVal]
  if (shouldThrow && (res == null || res == undefined))
    throw new Error(
      'Could not parse value ' +
        cleanVal.toString() +
        '. Valid values are ' +
        getEnumNames(type).toString()
    )
  return res
}
