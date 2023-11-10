import { assertEquals } from "assert/assert_equals.ts";
import { $number, $object, $string, createValidator } from "../mod.ts";

Deno.test("test $object", () => {
  const validate = createValidator($object({
    a: $string,
    b: $number,
  }));

  assertEquals(
    validate({
      a: "",
      b: 0,
    }),
    true,
  );

  assertEquals(
    validate({
      a: 0,
      b: "",
    }),
    false,
  );
  assertEquals(validate(null), false);
  assertEquals(validate(1234), false);
});
