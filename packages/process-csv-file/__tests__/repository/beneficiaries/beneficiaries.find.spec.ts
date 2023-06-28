import {
  listBeneficiariesByCompanyAndCpfs,
  listBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms,
} from "../../../src/repository/beneficiaries/beneficiaries.find";
import {
  beneficiariesByCompanyAndCpfsMock,
  beneficiariesByCompanyAndHolderCpfsAndAcceptedTermsMock,
} from "../../../__mock__/beneficiariesMock";
import { pool } from "../../../src/repository/database";

jest.mock("../../../src/repository/database");

describe("listBeneficiariesByCompanyAndCpfs", () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockQuery = jest.fn();
  const mockRelease = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({
      connect: jest.fn().mockResolvedValue({
        query: mockQuery,
        release: mockRelease,
      }),
      end: jest.fn(),
    } as any);
  });

  it("should search beneficiaries by company and cpf", async () => {
    mockQuery.mockImplementation(() => ({
      rows: beneficiariesByCompanyAndCpfsMock,
    }));
    const cpfs = [
      "111.222.333-44",
      "444.555.666-77",
      "999.888.777-66",
      "777.888.999-00",
    ];

    const result = await listBeneficiariesByCompanyAndCpfs(789, cpfs);
    const queryText = `SELECT * FROM beneficiaries
                            WHERE deleted_at IS NULL AND
                                  company_id = $1 AND
                                  cpf = ANY($2::text[])`;
    const values = [789, cpfs];
    expect(mockQuery).toHaveBeenCalledWith(queryText, values);
    expect(result).toEqual({ items: beneficiariesByCompanyAndCpfsMock });
  });
});

describe("listBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms", () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockQuery = jest.fn();
  const mockRelease = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({
      connect: jest.fn().mockResolvedValue({
        query: mockQuery,
        release: mockRelease,
      }),
      end: jest.fn(),
    } as any);
  });

  it("should search beneficiaries by company and holder cpfs and accepted terms", async () => {
    mockQuery.mockImplementation(() => ({
      rows: beneficiariesByCompanyAndHolderCpfsAndAcceptedTermsMock,
    }));
    const cpfs = [
      "111.222.333-44",
      "444.555.666-77",
      "999.888.777-66",
      "333.444.555-66",
    ];

    const result =
      await listBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms(456, cpfs);
    const queryText = `SELECT *
                  FROM beneficiaries
                  WHERE deleted_at IS NULL AND
                        company_id = $1 AND
                        accepted_terms_at IS NOT NULL AND
                        cpf = ANY($2::text[])`;
    const values = [456, cpfs];
    expect(mockQuery).toHaveBeenCalledWith(queryText, values);
    expect(result).toEqual({
      items: beneficiariesByCompanyAndHolderCpfsAndAcceptedTermsMock,
    });
  });
});
