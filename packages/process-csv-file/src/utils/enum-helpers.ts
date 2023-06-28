export function getIndexFromEnumValue(value: string, enumObj: any): number {
  const enumKeys = Object.keys(enumObj);
  const index = enumKeys.findIndex(
    (key) => key.toLowerCase() === value.toLowerCase()
  );
  return index !== -1 ? index + 1 : -1;
}
