import { assertEquals } from "assert/assert_equals.ts";
import { $boolean, $number, $string, $tuple, createValidator } from "../mod.ts";

Deno.test("test $tuple", () => {
  const validate = createValidator($tuple($string, $number, $boolean));

  assertEquals(validate(["", 1234, false]), true);

  assertEquals(validate(["", "", ""]), false);
  assertEquals(validate(["", 1234]), false);
  assertEquals(validate([""]), false);
  assertEquals(validate([]), false);
});
