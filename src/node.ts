import { FormatNames, JsonPrimitiveType, TypeName } from "./utils/utils.ts";

export interface LiteralType<
  T extends JsonPrimitiveType,
> {
  type?: undefined;
  const: T;
}

export interface PrimitiveType<T extends TypeName> {
  type: T;
}

export type RangeType<T extends PrimitiveType<"integer" | "number">> =
  & T
  & {
    minimum?: number;
    maximum?: number;
  };

export interface StringWithFormat<T extends FormatNames> {
  type: "string";
  format: T;
}

export interface StringWithRegex {
  type: "string";
  pattern: string;
}

export interface UnionType<T extends ValidatorNode> {
  type?: undefined;
  oneOf: T[];
}

export interface ArrayType<T extends ValidatorNode> {
  type: "array";
  items: T;
}

export interface TupleType<T extends ValidatorNode[]> {
  type: "array";
  prefixItems: T;
}

export type OptionalType<T extends ValidatorNode> = T & {
  required: false;
};

export type ObjectProperties = Record<string, ValidatorNode>;

export interface ObjectType<
  T extends ObjectProperties,
> {
  type: "object";
  properties: T;
}

type _ValidatorNode =
  | LiteralType<JsonPrimitiveType>
  | PrimitiveType<TypeName>
  | UnionType<ValidatorNode>
  | ArrayType<ValidatorNode>
  | TupleType<ValidatorNode[]>
  | ObjectType<Record<string | number | symbol, ValidatorNode>>
  | StringWithFormat<FormatNames>
  | RangeType<PrimitiveType<"integer" | "number">>
  | StringWithRegex;

export type ValidatorNode =
  | _ValidatorNode
  | OptionalType<_ValidatorNode>;
