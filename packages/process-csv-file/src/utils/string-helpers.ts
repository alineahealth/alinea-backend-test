export function safeParseNumber(value: string): number | null {
  if (value === undefined || value === "") {
    return null;
  }
  const parsedNumber = Number(value);
  return Number.isNaN(parsedNumber) ? null : parsedNumber;
}

export function parseNumber(value: string): number {
  const parsedNumber = Number(value);
  return parsedNumber;
}

declare global {
  interface String {
    equalsIgnoreCase(value: string): boolean;
    isNotNullOrEmpty(): boolean;
  }
}

String.prototype.equalsIgnoreCase = function (value: string): boolean {
  const lowerCaseThis = this.toLocaleLowerCase("default");
  const lowerCaseValue = value.toLocaleLowerCase("default");
  return lowerCaseThis === lowerCaseValue;
};

String.prototype.isNotNullOrEmpty = function () {
  return !this && this !== " ";
};
