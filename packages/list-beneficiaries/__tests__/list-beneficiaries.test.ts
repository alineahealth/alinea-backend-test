import { listBeneficiariesFind } from "../src/list-beneficiaries.find";
import { listBeneficiaries } from "../src/list-beneficiaries";
import { listBeneficiariesResult } from "../__mock__/list-beneficiaries-result";


jest.mock('../src/list-beneficiaries.find');

describe('listBeneficiaries', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a list of beneficiaries', async () => {
    const tracingID = '1234';
    const queryStringParameters = { page: '1', itemsPerPage: '10', cpf: '12345678900' };
    const expectedList = { beneficiaries: listBeneficiariesResult };
    (listBeneficiariesFind as jest.Mock).mockResolvedValueOnce(expectedList);

    const result = await listBeneficiaries({ queryStringParameters, tracingID });

    expect(result).toEqual(expectedList);
    expect(listBeneficiariesFind).toHaveBeenCalledWith({
      page: 1,
      itemsPerPage: 10,
      tracingID,
      cpf: '12345678900',
      name: undefined,
    });
  });
});