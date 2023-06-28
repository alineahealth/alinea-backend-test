import { generateInsertValues } from "../../src/utils/database-helpers";

describe("generateInsertValues", () => {
  it("should generate correct insert values", () => {
    const tableName = "my_table";
    const columns = ["column1", "column2", "column3"];
    const values = [
      [1, "value1", true],
      [2, "value2", false],
      [3, "value3", true],
    ];

    const expected = {
      text: 'INSERT INTO my_table ("column1", "column2", "column3") VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
      values: [1, "value1", true, 2, "value2", false, 3, "value3", true],
    };

    const result = generateInsertValues(tableName, columns, values);

    expect(result).toEqual(expected);
  });
});
