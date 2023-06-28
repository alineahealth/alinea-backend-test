import {
  parseDateString,
  forceParseDateString,
  calculateAge,
} from "../../src/utils/date-helpers";

describe("parseDateString", () => {
  it("should parse valid date string", () => {
    const dateString = "01/02/2000";
    const expectedDate = new Date(2000, 1, 1);

    const result = parseDateString(dateString);

    expect(result).toEqual(expectedDate);
  });

  it("should return undefined for invalid date string", () => {
    const dateString = "31/02/2000";

    const result = parseDateString(dateString);

    expect(result).toBeUndefined();
  });

  it("should return undefined for empty string", () => {
    const dateString = "";

    const result = parseDateString(dateString);

    expect(result).toBeUndefined();
  });
});

describe("forceParseDateString", () => {
  it("should parse valid date string", () => {
    const dateString = "01/02/2000";
    const expectedDate = new Date(2000, 1, 1);

    const result = forceParseDateString(dateString);

    expect(result).toEqual(expectedDate);
  });
});

describe("calculateAge", () => {
  it("should calculate age correctly", () => {
    const utcDateString = "2000-01-01T00:00:00.000Z";
    const expectedAge = new Date().getFullYear().toString().slice(2, 4);
    const result = calculateAge(utcDateString).toString();
    expect(result).toBe(expectedAge);
  });
});
