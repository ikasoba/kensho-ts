import { assertEquals } from "assert/assert_equals.ts";
import { $boolean, $number, $string, $union, createValidator } from "../mod.ts";

Deno.test("test $union", () => {
  const validate = createValidator($union($string, $number, $boolean));

  assertEquals(validate(""), true);
  assertEquals(validate(1234), true);
  assertEquals(validate(false), true);

  assertEquals(validate({}), false);
  assertEquals(validate([]), false);
  assertEquals(validate(null), false);
});
