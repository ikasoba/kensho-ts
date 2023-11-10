export type JsonPrimitiveType = string | number | boolean | null;
export type TypeName =
  | "string"
  | "integer"
  | "number"
  | "boolean"
  | "object"
  | "null"
  | "any"
  | "unknown";

export type TypeMap = {
  string: string;
  integer: number;
  number: number;
  boolean: boolean;
  null: null;
  object: object;
  any: any;
  unknown: unknown;
};

export type FormatNames = "date-time";

export type Union2Intersection<U> =
  (U extends infer T ? (_: T) => any : never) extends (_: infer T) => any ? T
    : never;

export type Simplify<T> = { [K in keyof T]: T[K] };

export const omit = <O extends object, U extends (keyof O)[]>(
  obj: O,
  key: U,
): Omit<O, U[number]> => {
  const keys = Reflect.ownKeys(obj).filter((x) => !key.some((y) => x == y));
  const res: any = {};

  for (const k of keys) {
    res[k] = (obj as any)[k];
  }

  return res;
};
