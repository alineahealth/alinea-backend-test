import { listBeneficiariesImportsResultFind } from '../src/list-beneficiaries-imports-result.find';
import { pool } from '../src/database';
import { listBeneficiariesImportsMock, listBeneficiariesImportsDBMock } from "../__mock__/list-beneficiaries-imports-result";

jest.mock('../src/database');

describe('listBeneficiariesImportsResultFind', () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({
      connect: jest.fn().mockResolvedValue({ query: mockQuery }),
    } as any);
  });

  test('should return a list of beneficiaries', async () => {
    const itemsPerPage = 10;
    const page = 1;
    const tracingID = 'test-tracing-id';
    const totalItems = 2;
    const totalPages = 1;

    mockQuery.mockResolvedValueOnce({ rows: listBeneficiariesImportsDBMock});
    mockQuery.mockResolvedValueOnce({ rows: [{ total: totalItems }] });

    const result = await listBeneficiariesImportsResultFind({ itemsPerPage, page, tracingID });

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM processings order by created_at DESC offset $1 limit $2'), [0, 10]);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT count(*) total FROM processings'));
    expect(result).toEqual({
      meta: {
        currentPage: page,
        totalItems,
        totalPages,
        itemsPerPage,
      },
      items: listBeneficiariesImportsMock,
    });
  });

  test('should throw an error if the database query fails', async () => {
    const itemsPerPage = 10;
    const page = 1;
    const tracingID = 'test-tracing-id';
    const errorMessage = 'Database query failed';

    mockQuery.mockRejectedValueOnce(new Error(errorMessage));

    await expect(listBeneficiariesImportsResultFind({ itemsPerPage, page, tracingID })).rejects.toThrow(errorMessage);
  });
});