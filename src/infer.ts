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

type ExcludeOptionalKey<T extends ObjectProperties> = {
  [K in keyof T]: T[K] extends OptionalType<ValidatorNode> ? never : K;
}[keyof T];

type ExtractOptionalKey<T extends ObjectProperties> = {
  [K in keyof T]: T[K] extends OptionalType<ValidatorNode> ? K : never;
}[keyof T];

type InferObject<T extends ObjectProperties, Strict extends boolean> = Simplify<
  & {
    [K in ExcludeOptionalKey<T>]: K extends keyof T ? _Infer<T[K], Strict>
      : never;
  }
  & {
    [K in ExtractOptionalKey<T>]?: K extends keyof T ? _Infer<T[K], Strict>
      : never;
  }
>;

type _Infer<Node extends ValidatorNode, Strict extends boolean> = Node extends
  OptionalType<infer T> ? undefined | _Infer<T, Strict>
  : Node extends StringWithFormat<infer T>
    ? (Strict extends true ? ValidatedString<T>
      : Strict extends false ? string
      : never)
  : Node extends StringWithRegex
    ? (Strict extends true ? ValidatedString<RegExp>
      : Strict extends false ? string
      : never)
  : Node extends TupleType<infer T> ? { [K in keyof T]: _Infer<T[K], Strict> }
  : Node extends ArrayType<infer T> ? _Infer<T, Strict>[]
  : Node extends ObjectType<infer T> ? InferObject<T, Strict>
  : Node extends UnionType<infer U> ? _Infer<U, Strict>
  : Node extends LiteralType<infer T>
    ? (T extends infer T extends ValidatorNode[]
      ? { [K in keyof T]: _Infer<T[K], Strict> }
      : T extends infer T extends ObjectProperties ? InferObject<T, Strict>
      : T)
  : Node extends PrimitiveType<infer K> ? TypeMap[K]
  : never;

export type Infer<Node extends ValidatorNode, Strict extends boolean = false> =
  _Infer<Node, Strict>;
