<h1>
<p align="center">
<i>⚡kensho-ts⚡</i>
</p>
</h1>
<p align="center">
<a href="https://www.npmjs.com/package/@ikasoba000/kensho-ts"><img src="https://shields.io/npm/v/@ikasoba000/kensho-ts" /></a>
</p>

# about

`kensho-ts` is a small validator for TypeScript compatible with JSONSchema.

# example
```ts
import {
  $object,
  $opt,
  $regexp,
  $string,
  createValidator,
  Infer,
} from "https://esm.sh/gh/ikasoba/kensho-ts@0.1.0/mod.ts";

const UserSchema = $object({
  id: $string,
  name: $regexp(/^[a-zA-Z0-9_-]+$/),
  displayName: $opt($string),
});
// {
//   type: "object",
//   properties: {
//     id: { type: "string" },
//     name: { type: "string", pattern: "^[a-zA-Z0-9_-]+$" },
//     displayName: { type: "string", required: false }
//   }
// }

type User = Infer<typeof UserSchema>;
// {
//   id: string;
//   name: string;
//   displayName?: string | undefined;
// }

// type User = Infer<typeof UserSchema, /* strict flag */ true>;
// // {
// //   id: string;
// //   name: ParsedString<RegExp>;
// //   displayName?: string | undefined;
// // }

const validateUser = createValidator(UserSchema);

validateUser({
  id: "abcdef1234567890",
  name: "ikasoba",
} as User);
```