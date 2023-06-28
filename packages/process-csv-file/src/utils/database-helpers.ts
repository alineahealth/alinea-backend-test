export function generateInsertValues(
  tableName: string,
  columns: string[],
  values: any[][]
): { text: string; values: any[] } {
  const placeholders = values.map(
    (_, index) =>
      `(${columns
        .map((col, colIndex) => `$${index * columns.length + colIndex + 1}`)
        .join(", ")})`
  );
  const flattenedValues = values.flat();

  const columnsString = columns.map((col) => `"${col}"`).join(", ");

  return {
    text: `INSERT INTO ${tableName} (${columnsString}) VALUES ${placeholders.join(
      ", "
    )}`,
    values: flattenedValues,
  };
}
