import {
  ArrayType,
  LiteralType,
  ObjectProperties,
  ObjectType,
  OptionalType,
  PrimitiveType,
  StringWithFormat,
  StringWithRegex,
  TupleType,
  UnionType,
  ValidatorNode,
} from "./node.ts";
import { ValidatedString } from "./utils/ValidatedString.ts";
import { Simplify, TypeMap } from "./utils/utils.ts";

export type ExcludeOptionalKey<T extends ObjectProperties> = {
  [K in keyof T]: T[K] extends OptionalType<ValidatorNode> ? never : K;
}[keyof T];

export type ExtractOptionalKey<T extends ObjectProperties> = {
  [K in keyof T]: T[K] extends OptionalType<ValidatorNode> ? K : never;
}[keyof T];

export type InferObject<T extends ObjectProperties> = Simplify<
  & {
    [K in ExcludeOptionalKey<T>]: K extends keyof T ? Infer<T[K]>
      : never;
  }
  & {
    [K in ExtractOptionalKey<T>]?: K extends keyof T ? Infer<T[K]>
      : never;
  }
>;

export type Infer<Node extends ValidatorNode> = Node extends
  OptionalType<infer T> ? undefined | Infer<T>
  : Node extends StringWithFormat<infer T> ? ValidatedString<T>
  : Node extends StringWithRegex ? ValidatedString<RegExp>
  : Node extends TupleType<infer T> ? { [K in keyof T]: Infer<T[K]> }
  : Node extends ArrayType<infer T> ? Infer<T>[]
  : Node extends ObjectType<infer T> ? InferObject<T>
  : Node extends UnionType<infer U> ? Infer<U>
  : Node extends LiteralType<infer T>
    ? T extends infer T extends ValidatorNode[]
      ? { [K in keyof T]: Infer<T[K]> }
    : T extends infer T extends ObjectProperties ? InferObject<T>
    : T
  : Node extends PrimitiveType<infer K> ? TypeMap[K]
  : never;
