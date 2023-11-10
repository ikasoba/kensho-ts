import { assertEquals } from "assert/assert_equals.ts";
import { $array, $string, createValidator } from "../mod.ts";

Deno.test("test $array", () => {
  const validate = createValidator($array($string));

  assertEquals(validate(["", "", ""]), true);
  assertEquals(validate(["", ""]), true);
  assertEquals(validate([""]), true);

  assertEquals(validate([]), true);

  assertEquals(validate([1234]), false);
  assertEquals(validate([1234, ""]), false);
  assertEquals(validate([1234, "", 5678]), false);
});
