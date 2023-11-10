import {
  ArrayType,
  LiteralType,
  ObjectProperties,
  ObjectType,
  OptionalType,
  PrimitiveType,
  RangeType,
  StringWithFormat,
  StringWithRegex,
  TupleType,
  UnionType,
  ValidatorNode,
} from "./node.ts";
import { JsonPrimitiveType } from "./utils/utils.ts";

export function $object(): PrimitiveType<"object">;
export function $object<T extends ObjectProperties>(
  properties: T,
): ObjectType<T>;
export function $object<T extends ObjectProperties>(
  properties?: T,
): PrimitiveType<"object"> | ObjectType<T> {
  if (properties == null) {
    return {
      type: "object",
    };
  } else {
    return {
      type: "object",
      properties,
    };
  }
}

export function $array<T extends ValidatorNode>(type: T): ArrayType<T> {
  return {
    type: "array",
    items: type,
  };
}

export function $tuple<T extends ValidatorNode[]>(...type: T): TupleType<T> {
  return {
    type: "array",
    prefixItems: type,
  };
}

export function $opt<T extends ValidatorNode>(type: T): OptionalType<T> {
  return {
    ...type,
    required: false,
  };
}

export function $range<T extends PrimitiveType<"integer" | "number">>(
  type: T,
  minimum?: number,
  maximum?: number,
): RangeType<T> {
  return {
    ...type,
    minimum,
    maximum,
  };
}

export function $regexp(
  regex: RegExp | string,
): StringWithRegex {
  if (regex instanceof RegExp) {
    regex = regex.source;
  }

  return {
    type: "string",
    pattern: regex,
  };
}

export function $const<T extends JsonPrimitiveType>(value: T): LiteralType<T> {
  return {
    const: value,
  };
}

export function $extends<
  X extends ObjectProperties,
  Y extends ObjectProperties,
>(x: ObjectType<X>, y: ObjectType<Y>): ObjectType<X & Y> {
  return {
    type: "object",
    properties: {
      ...x.properties,
      ...y.properties,
    },
  };
}

export function $union<T extends ValidatorNode[]>(
  ...types: T
): UnionType<T[number]> {
  return {
    oneOf: types,
  };
}

export const $string: PrimitiveType<"string"> = {
  type: "string",
};

export const $integer: PrimitiveType<"integer"> = {
  type: "integer",
};

export const $number: PrimitiveType<"number"> = {
  type: "number",
};

export const $boolean: PrimitiveType<"boolean"> = {
  type: "boolean",
};

export const $null: PrimitiveType<"null"> = {
  type: "null",
};

export const $any: PrimitiveType<"any"> = {
  type: "any",
};

export const $unknown: PrimitiveType<"unknown"> = {
  type: "unknown",
};

export const $dateTime: StringWithFormat<"date-time"> = {
  type: "string",
  format: "date-time",
};
