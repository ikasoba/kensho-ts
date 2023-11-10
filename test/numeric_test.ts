import { assertEquals } from "assert/mod.ts";
import {
  $integer,
  $number,
  $range,
  createValidator,
  ValidatorContext,
} from "../mod.ts";

Deno.test("test $integer", () => {
  const validator = createValidator($integer);

  const ctx: ValidatorContext = { errors: [] };

  assertEquals(validator(1234, ctx), true);

  assertEquals(validator(0.5, ctx), false);
  assertEquals(validator({}, ctx), false);
  assertEquals(validator("", ctx), false);
});

Deno.test("test $number", () => {
  const validator = createValidator($number);

  const ctx: ValidatorContext = { errors: [] };

  assertEquals(validator(0.5, ctx), true);
  assertEquals(validator(1234, ctx), true);

  assertEquals(validator({}, ctx), false);
  assertEquals(validator("", ctx), false);
});

Deno.test("test $integer $range", () => {
  const validator = createValidator($range($integer, 10, 20));

  const ctx: ValidatorContext = { errors: [] };

  assertEquals(validator(10, ctx), true);
  assertEquals(validator(15, ctx), true);
  assertEquals(validator(20, ctx), true);

  assertEquals(validator(10.5, ctx), false);
  assertEquals(validator(150, ctx), false);
});

Deno.test("test $number $range", () => {
  const validator = createValidator($range($number, 10, 20));

  const ctx: ValidatorContext = { errors: [] };

  assertEquals(validator(10, ctx), true);
  assertEquals(validator(15, ctx), true);
  assertEquals(validator(20, ctx), true);
  assertEquals(validator(10.5, ctx), true);

  assertEquals(validator(150, ctx), false);
  assertEquals(validator(5000.00001, ctx), false);
});
