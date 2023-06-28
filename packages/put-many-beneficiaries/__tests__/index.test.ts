import { handler } from "../src/index";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockEvent = require("../__mock__/api-gateway-proxy.json");
import { putManyBeneficiaries } from "../src/put-many-beneficiaries";

jest.mock("../src/put-many-beneficiaries", () => ({
  putManyBeneficiaries: jest.fn()
}));

describe("Put-many-beneficiaries", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should return success", async () => {
    const mockResponse = {
      code: 200,
      body:  {
        totalSuccess:2,
        updateSuccess: 0,
        createSuccess: 2,
        totalErros: 0,
        errors: 0,
        errorsIntoDB:0
      }
    };
    (putManyBeneficiaries as jest.Mock).mockResolvedValue(mockResponse.body)
    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(mockResponse.code);
    expect(result.body).toContain(JSON.stringify(mockResponse.body));
    expect(putManyBeneficiaries).toHaveBeenCalledWith({
      body: JSON.parse(mockEvent.body),
      tracingID: expect.any(String),
    });
  });

  it('should return a 400 status code with an error message', async () => {
    const expectedErrorMessage = 'I can not insert beneficiaries without a body with information';
    const mockResponse = { code: 400, body: expectedErrorMessage };

    (putManyBeneficiaries as jest.Mock).mockRejectedValueOnce(new Error(expectedErrorMessage));

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(mockResponse.code);
    expect(response.body).toContain(mockResponse.body);
    expect(putManyBeneficiaries).toHaveBeenCalledWith({
      body: JSON.parse(mockEvent.body),
      tracingID: expect.any(String),
    });
  });


  it('should return a 400 status code with an error message', async () => {
    const expectedErrorMessage = 'I can process more than 500 beneficiaries per time';
    const mockResponse = { code: 400, body: expectedErrorMessage };

    (putManyBeneficiaries as jest.Mock).mockRejectedValueOnce(new Error(expectedErrorMessage));

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(mockResponse.code);
    expect(response.body).toContain(mockResponse.body);
    expect(putManyBeneficiaries).toHaveBeenCalledWith({
      body: JSON.parse(mockEvent.body),
      tracingID: expect.any(String),
    });
  });
});
