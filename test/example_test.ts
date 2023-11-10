import { assertEquals } from "assert/assert_equals.ts";
import {
  $object,
  $opt,
  $regexp,
  $string,
  createValidator,
  Infer,
} from "../mod.ts";

Deno.test("user example", () => {
  const UserSchema = $object({
    id: $string,
    name: $regexp(/^[a-zA-Z0-9_-]+$/),
    displayName: $opt($string),
  });

  type User = Infer<typeof UserSchema>;

  const validateUser = createValidator(UserSchema);

  assertEquals(
    validateUser({
      id: "abcdef1234567890",
      name: "ikasoba",
    } as User),
    true,
  );

  assertEquals(
    validateUser({
      id: "bcdefg2345678901",
      name: "hogehoge",
      displayName: "おあああああ！！！！！！",
    } as User),
    true,
  );
});
