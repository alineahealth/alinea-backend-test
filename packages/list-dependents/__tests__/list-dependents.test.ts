import { listDependentsResult } from "../__mock__/list-dependents-result";
import { listDependents } from "../src/list-dependents";
import { listDependentsFind } from "../src/list-dependents.find";


jest.mock('../src/list-dependents.find');

describe('listDependents', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a list of dependents', async () => {
    const tracingID = '1234';
    const pathParameters = { cpf: '12345678900' };
    const expectedList = { dependents: listDependentsResult };
    (listDependentsFind as jest.Mock).mockResolvedValueOnce(expectedList);

    const result = await listDependents({ pathParameters, tracingID });

    expect(result).toEqual(expectedList);
    expect(listDependentsFind).toHaveBeenCalledWith({
      tracingID,
      cpf: '12345678900'
    });
  });

  it('should throw an error do not receive the parameter cpf', async () => {
    const tracingID = '1234';
    const pathParameters = {page: '1', itemsPerPage: '10' };
    const expectedError = new Error('Can not list all dependents without holder cpf');
    try {
      await expect(listDependents({ pathParameters, tracingID })).rejects.toThrow(
        expectedError,
      );
    } catch (error) {
      expect(error).toEqual(expectedError);
      expect(listDependentsFind).not.toHaveBeenCalled();
    }
  });
});