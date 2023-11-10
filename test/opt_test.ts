import { assertEquals } from "assert/assert_equals.ts";
import { $opt, $string, createValidator } from "../mod.ts";

Deno.test("test $opt", () => {
  const validate = createValidator($opt($string));

  assertEquals(validate(""), true);
  assertEquals(validate(undefined), true);

  assertEquals(validate({}), false);
  assertEquals(validate(null), false);
});
