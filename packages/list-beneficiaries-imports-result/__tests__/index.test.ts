import { handler } from "../src/index";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockEvent = require("../__mock__/apiGatewayAWSProxy.json");
import { listBeneficiariesImportsResult } from "../src/list-beneficiaries-imports-result";
import { listBeneficiariesImportsMock } from "../__mock__/list-beneficiaries-imports-result";

jest.mock("../src/list-beneficiaries-imports-result", () => ({
  listBeneficiariesImportsResult: jest.fn()
}));

describe("List Beneficiaries imports result", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should return success", async () => {
    const mockResponse = { code: 200, body: JSON.stringify(listBeneficiariesImportsMock) };

    (listBeneficiariesImportsResult as jest.Mock).mockResolvedValueOnce(listBeneficiariesImportsMock)

    const result = await handler(mockEvent);
    expect(result.statusCode).toBe(mockResponse.code);
    expect(result.body).toEqual(mockResponse.body);
    expect(listBeneficiariesImportsResult).toHaveBeenCalledWith({
      queryStringParameters: mockEvent.queryStringParameters,
      tracingID: expect.any(String),
    });
  });

  it('should return a 400 status code with an error message', async () => {
    const expectedErrorMessage = 'Invalid parameter';

    (listBeneficiariesImportsResult as jest.Mock).mockRejectedValueOnce(new Error(expectedErrorMessage));
    const mockResponse = { code: 400, body: expectedErrorMessage };

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(mockResponse.code);
    expect(response.body).toContain(mockResponse.body);
    expect(listBeneficiariesImportsResult).toHaveBeenCalledWith({
      queryStringParameters: mockEvent.queryStringParameters,
      tracingID: expect.any(String),
    });
  });
});
