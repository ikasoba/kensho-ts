declare const __dummy: unique symbol;
export type ValidatedString<I, T extends string = string> = T & {
  [__dummy]: I;
};
