import { randomUUID } from "crypto";
import { handler } from "../src/index";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockEvent = require("../__mock__/apiGatewayAWSProxy.json");
import { listBeneficiaries } from "../src/list-beneficiaries";
import { listBeneficiariesResult } from "../__mock__/list-beneficiaries-result";

jest.mock("../src/list-beneficiaries", () => ({
  listBeneficiaries: jest.fn()
}));

describe("List Benefieiaries", () => {
  const tracingID = randomUUID();
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should return success", async () => {
    const mockResponse = { code: 200, body: JSON.stringify(listBeneficiariesResult) };

    (listBeneficiaries as jest.Mock).mockResolvedValueOnce(listBeneficiariesResult)

    const result = await handler(mockEvent);
    expect(result.statusCode).toBe(mockResponse.code);
    expect(result.body).toEqual(mockResponse.body);
    expect(listBeneficiaries).toHaveBeenCalledWith({
      queryStringParameters: mockEvent.queryStringParameters,
      tracingID: expect.any(String),
    });
  });

  it('should return a 400 status code with an error message', async () => {
    const expectedErrorMessage = 'Invalid parameter';

    (listBeneficiaries as jest.Mock).mockRejectedValueOnce(new Error(expectedErrorMessage));
    const mockResponse = { code: 400, body: expectedErrorMessage };

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(mockResponse.code);
    expect(response.body).toContain(mockResponse.body);
    expect(listBeneficiaries).toHaveBeenCalledWith({
      queryStringParameters: mockEvent.queryStringParameters,
      tracingID: expect.any(String),
    });
  });
});
