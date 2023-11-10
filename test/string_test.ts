import { assertEquals } from "assert/mod.ts";
import { $dateTime, $regexp, $string, createValidator } from "../mod.ts";

Deno.test("test $string", () => {
  const validator = createValidator($string);

  assertEquals(validator("hogehoge"), true);
  assertEquals(validator("1234"), true);

  assertEquals(validator(0.5), false);
  assertEquals(validator({}), false);
  assertEquals(validator(null), false);
});

Deno.test("test $dateTime", () => {
  const validator = createValidator($dateTime);

  assertEquals(validator("2023-11-10T05:15:54.353Z"), true);

  assertEquals(validator(""), false);
  assertEquals(validator("hogehoge fugafuga"), false);
  assertEquals(validator("2023~11~10"), false);
});

Deno.test("test $regexp", () => {
  const validator = createValidator($regexp(/^[$a-zA-Z_][$a-zA-Z_0-9]*$/));

  assertEquals(validator("_$hogefuga1234"), true);

  assertEquals(validator("hoge fuga"), false);
  assertEquals(validator("1234"), false);
});
