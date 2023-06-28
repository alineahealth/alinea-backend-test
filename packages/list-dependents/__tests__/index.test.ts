import { randomUUID } from "crypto";
import { handler } from "../src/index";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockEvent = require("../__mock__/apiGatewayAWSProxy.json");
import { listDependentsResult } from "../__mock__/list-dependents-result";
import { listDependents } from "../src/list-dependents";

jest.mock("../src/list-dependents", () => ({
  listDependents: jest.fn()
}));

describe("List Dependents", () => {
  const tracingID = randomUUID();
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should return success", async () => {
    const mockResponse = { code: 200, body: JSON.stringify(listDependentsResult) };

    (listDependents as jest.Mock).mockResolvedValueOnce(listDependentsResult)

    const result = await handler(mockEvent);
    expect(result.statusCode).toBe(mockResponse.code);
    expect(result.body).toEqual(mockResponse.body);
    expect(listDependents).toHaveBeenCalledWith({
      pathParameters: mockEvent.pathParameters,
      tracingID: expect.any(String),
    });
  });

  it('should return a 400 status code with an error message', async () => {
    const expectedErrorMessage = 'Invalid parameter';
    const mockResponse = { code: 400, body: 'Invalid parameter' };

    (listDependents as jest.Mock).mockRejectedValueOnce(new Error(expectedErrorMessage));

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(mockResponse.code);
    expect(response.body).toContain(mockResponse.body);
    expect(listDependents).toHaveBeenCalledWith({
      pathParameters: mockEvent.pathParameters,
      tracingID: expect.any(String),
    });
  });
});
