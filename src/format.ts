import { ValidatedString } from "./utils/ValidatedString.ts";
import { FormatNames } from "./utils/utils.ts";

export function validateFormat<T extends FormatNames>(
  value: string,
  format: T,
): value is ValidatedString<T> {
  if (format == "date-time") {
    return !Number.isNaN(Date.parse(value));
  }

  return false;
}
