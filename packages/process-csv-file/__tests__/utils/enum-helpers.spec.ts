import { getIndexFromEnumValue } from "../../src/utils/enum-helpers";

describe("getIndexFromEnumValue", () => {
  enum SampleEnum {
    Value1 = "VALUE1",
    Value2 = "VALUE2",
    Value3 = "VALUE3",
  }

  it("should return the index associated with the enum value", () => {
    const value = SampleEnum.Value2;
    const expectedIndex = 2;

    const result = getIndexFromEnumValue(value, SampleEnum);

    expect(result).toEqual(expectedIndex);
  });

  it("should return 0 if the enum value is not found", () => {
    const value = "InvalidValue";

    const result = getIndexFromEnumValue(value, SampleEnum);

    expect(result).toEqual(-1);
  });
});
