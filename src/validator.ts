import { PrimitiveType, ValidatorNode } from "./node.ts";
import { Infer } from "./infer.ts";
import { omit } from "./utils/utils.ts";
import { validateFormat } from "./format.ts";

export type ValidatorPath = (string | number | symbol)[];

export interface ValidatorContext {
  errors: string[];
}

export type Validator<T> = (
  value: unknown,
  ctx?: ValidatorContext,
  path?: ValidatorPath,
) => value is T;

export function createValidator<T extends ValidatorNode>(
  node: T,
): Validator<Infer<T>> {
  if ("required" in node && node["required"] === false) {
    const validator = createValidator(
      omit(node, ["required"]) as PrimitiveType<"unknown">,
    );

    return (value, ctx?, path?): value is Infer<T> => {
      if (value === undefined) return true;

      return validator(value, ctx, path);
    };
  }

  switch (node.type) {
    case undefined: {
      if ("const" in node) {
        return (value, ctx?, path = []): value is Infer<T> => {
          if (node.const === value) return true;

          ctx?.errors.push(
            `${
              path.length ? "`" + path.join(".") + "`" : "It"
            } does not match the constant value \`${
              JSON.stringify(node.const)
            }\`.`,
          );

          return false;
        };
      } else {
        const validators = node.oneOf.map((x) =>
          createValidator(x as PrimitiveType<"unknown">)
        );

        return (value, ctx?, path = []): value is Infer<T> => {
          for (const validator of validators) {
            if (validator(value, ctx, path)) return true;
          }

          ctx?.errors.push(
            `${
              path.length ? "`" + path.join(".") + "`" : "It"
            } does not match union type.`,
          );

          return false;
        };
      }
    }

    case "array": {
      if ("items" in node) {
        const validator = createValidator(
          node.items as PrimitiveType<"unknown">,
        );

        return (value, ctx?, path = []): value is Infer<T> => {
          let isSuccess = false;
          if (
            value instanceof Array
          ) {
            isSuccess = true;
            for (let i = 0; i < value.length; i++) {
              if (!validator(value[i], ctx, path?.concat(i))) {
                isSuccess = false;
              }
            }
          } else {
            ctx?.errors.push(
              `${
                path.length ? "`" + path.join(".") + "`" : "It"
              } is not an array.`,
            );
          }

          return isSuccess;
        };
      } else {
        const validators = node.prefixItems.map((value) => {
          return createValidator(value as PrimitiveType<"unknown">);
        });

        return (value, ctx?, path = []): value is Infer<T> => {
          if (!(value instanceof Array)) {
            ctx?.errors.push(
              `${
                path.length ? "`" + path.join(".") + "`" : "It"
              } is not an array.`,
            );

            return false;
          }

          if (value.length !== validators.length) {
            ctx?.errors.push(
              `The length of ${
                path.length ? "`" + path.join(".") + "`" : "this"
              } is not ${validators.length}.`,
            );
          }

          let isSuccess = true;
          for (let i = 0; i < validators.length; i++) {
            const validator = validators[i];
            if (!validator(value[i], ctx, path.concat(i))) {
              isSuccess = false;
            }
          }

          return isSuccess;
        };
      }
    }

    case "object": {
      if ("properties" in node) {
        const keys = Reflect.ownKeys(
          node.properties,
        ) as (string | number | symbol)[];

        const entries = keys.map((k) => {
          return [
            k,
            createValidator(node.properties[k] as PrimitiveType<"unknown">),
          ] as const;
        });

        return (value, ctx?, path = []): value is Infer<T> => {
          if (typeof value !== "object" || value == null) {
            ctx?.errors.push(
              `${
                path.length ? "`" + path.join(".") + "`" : "It"
              } is not an object.`,
            );

            return false;
          }

          let isSuccess = true;
          for (const [key, validator] of entries) {
            if (!validator(value[key as keyof object], ctx, path.concat(key))) {
              isSuccess = false;
            }
          }

          return isSuccess;
        };
      }
    }

    /* falls through */

    case "string": {
      if ("format" in node) {
        const validator = createValidator(
          omit(node, ["format"]) as PrimitiveType<"string">,
        );

        return (value, ctx?, path?): value is Infer<T> => {
          let isSuccess = true;
          if (!validator(value, ctx, path)) {
            isSuccess = false;
          } else if (!validateFormat(value, node.format)) {
            isSuccess = false;

            ctx?.errors.push(
              `${
                path?.length ? "`" + path.join(".") + "`" : "It"
              } does not match format \`${node.format}\`.`,
            );
          }

          return isSuccess;
        };
      } else if ("pattern" in node) {
        const validator = createValidator(
          omit(node, ["pattern"]) as PrimitiveType<"string">,
        );

        return (value, ctx?, path?): value is Infer<T> => {
          let isSuccess = true;
          if (!validator(value, ctx, path)) {
            isSuccess = false;
          } else if (!new RegExp(node.pattern).test(value)) {
            isSuccess = false;

            ctx?.errors.push(
              `${
                path?.length ? "`" + path.join(".") + "`" : "It"
              } does not match regexp \`${
                node.pattern.replaceAll("`", "\\`")
              }\`.`,
            );
          }

          return isSuccess;
        };
      }
    }

    /* falls through */

    case "number":
    case "integer": {
      if ("maximum" in node && "minimum" in node) {
        const minimum = node.minimum ?? -Infinity;
        const maximum = node.maximum ?? Infinity;

        const validator = createValidator(
          omit(node, ["minimum", "maximum"]) as PrimitiveType<"number">,
        );

        return (value, ctx?, path = []): value is Infer<T> => {
          let isSuccess = true;

          if (!validator(value, ctx, path)) {
            isSuccess = false;
          } else if (!(value >= minimum && value <= maximum)) {
            isSuccess = false;

            ctx?.errors.push(
              `${
                path.length ? "`" + path.join(".") + "`" : "It"
              } is not in range \`${node.minimum}...${node.maximum}\`.`,
            );
          }

          return isSuccess;
        };
      } else if (node.type == "integer") {
        return (value, ctx?, path = []): value is Infer<T> => {
          let isSuccess = true;
          if (typeof value !== "number") {
            isSuccess = false;

            ctx?.errors.push(
              `${
                path.length ? "`" + path.join(".") + "`" : "It"
              } does not match type \`number\`.`,
            );
          } else if (value !== Math.floor(value)) {
            isSuccess = false;

            ctx?.errors.push(
              `${
                path.length ? "`" + path.join(".") + "`" : "It"
              } is not an \`integer\`.`,
            );
          }

          return isSuccess;
        };
      }
    }

    /* falls through */

    default: {
      return (value, ctx?, path = []): value is Infer<T> => {
        const type = typeof value;
        if (type === "object" && type === node.type && value !== null) {
          return true;
        } else if (type === node.type) {
          return true;
        }

        ctx?.errors.push(
          `${
            path.length ? "`" + path.join(".") + "`" : "It"
          } does not match type \`${node.type}\`.`,
        );

        return false;
      };
    }
  }
}
