import { listBeneficiariesImportsResultFind } from "../src/list-beneficiaries-imports-result.find";
import { listBeneficiariesImportsResult } from "../src/list-beneficiaries-imports-result";
import { listBeneficiariesImportsMock } from "../__mock__/list-beneficiaries-imports-result";


jest.mock('../src/list-beneficiaries-imports-result.find');

describe('listBeneficiariesImportsResult', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a list of beneficiaries imports result', async () => {
    const tracingID = '1234';
    const queryStringParameters = { page: '1', itemsPerPage: '10' };
    const expectedList = { result: listBeneficiariesImportsMock };
    (listBeneficiariesImportsResultFind as jest.Mock).mockResolvedValueOnce(expectedList);

    const result = await listBeneficiariesImportsResult({ queryStringParameters, tracingID });

    expect(result).toEqual(expectedList);
    expect(listBeneficiariesImportsResultFind).toHaveBeenCalledWith({
      page: 1,
      itemsPerPage: 10,
      tracingID,
    });
  });
});