import { listBeneficiariesFind } from '../src/list-beneficiaries.find';
import { pool } from '../src/database';
import { listBeneficiariesResult } from "../__mock__/list-beneficiaries-result";

jest.mock('../src/database');

describe('listBeneficiariesFind', () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({
      connect: jest.fn().mockResolvedValue({ query: mockQuery }),
    } as any);
  });

  test('should return a list of beneficiaries', async () => {
    const name = 'John';
    const itemsPerPage = 10;
    const page = 1;
    const tracingID = 'test-tracing-id';
    const totalItems = 2;
    const totalPages = 1;

    mockQuery.mockResolvedValueOnce({ rows: listBeneficiariesResult});
    mockQuery.mockResolvedValueOnce({ rows: [{ total: totalItems }] });

    const result = await listBeneficiariesFind({ name, itemsPerPage, page, tracingID });

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM beneficiaries where deleted_at is null'));
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT count(*) total FROM beneficiaries'));
    expect(result).toEqual({
      totalItems,
      totalPages,
      itemsPerPage,
      items: listBeneficiariesResult,
    });
  });

  test('should throw an error if the database query fails', async () => {
    const name = 'John';
    const cpf = '12345678901';
    const itemsPerPage = 10;
    const page = 1;
    const tracingID = 'test-tracing-id';
    const errorMessage = 'Database query failed';

    mockQuery.mockRejectedValueOnce(new Error(errorMessage));

    await expect(listBeneficiariesFind({ name, cpf, itemsPerPage, page, tracingID })).rejects.toThrow(errorMessage);
  });
});