
import { pool } from "../src/database";
import { findCPFsInDatabase, listCompanies, listPlans, updateBeneficiaries, createBeneficiaries, changeBeneficiaryHistory } from "../src/put-many-beneficiaries.model";
import { IBeneficiaryMock } from "../__mock__/IBeneficiary.mock";
import { mockCreateBeneficiary } from "../__mock__/ICreateBeneficiary.mock";
import { mockHealthPlans } from "../__mock__/IPlan.mock";
import { mockCompanies } from "../__mock__/ICompany.mock";

jest.mock("../src/database");
beforeAll(() => {
  jest.clearAllMocks();
});

describe("findCPFsInDatabase", () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockConnect = jest.fn();
  const mockQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({ connect: mockConnect } as any);
    mockConnect.mockResolvedValue({ query: mockQuery });
  });

  it("returns a beneficiary if found in database", async () => {
    const mockClient = { rows: [IBeneficiaryMock] };
    mockQuery.mockResolvedValueOnce(mockClient);

    const result = await findCPFsInDatabase(mockCreateBeneficiary, "test-tracing-id");

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT * FROM beneficiaries WHERE cpf = $1 and company_id = $2 and deleted_at is null',
      ['11111111111', 2]
    );
    expect(result).toEqual(IBeneficiaryMock);
  });

  it("returns undefined if not found in database", async () => {
    const mockClient = { rows: [] };
    mockQuery.mockResolvedValueOnce(mockClient);

    const result = await findCPFsInDatabase(mockCreateBeneficiary, "test-tracing-id");

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT * FROM beneficiaries WHERE cpf = $1 and company_id = $2 and deleted_at is null',
      ['11111111111', 2]
    );
    expect(result).toBeUndefined();
  });

});

describe("listPlans", () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockConnect = jest.fn();
  const mockQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({ connect: mockConnect } as any);
    mockConnect.mockResolvedValue({ query: mockQuery });
  });

  const query = "SELECT * FROM health_plans";

  it("returns a list of health plans", async () => {
    const mockClient = { rows: [mockHealthPlans] };
    mockQuery.mockResolvedValueOnce(mockClient);

    const result = await listPlans();

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(query);
    expect(result).toEqual([mockHealthPlans]);
  });

  it("returns an empty array if no health plans found", async () => {
    const mockClient = { rows: [] };
    mockQuery.mockResolvedValueOnce(mockClient);

    const result = await listPlans();

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(query);
    expect(result).toEqual([]);
  });
});

describe("listCompanies", () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockConnect = jest.fn();
  const mockQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({ connect: mockConnect } as any);
    mockConnect.mockResolvedValue({ query: mockQuery });
  });

  const query2 = "SELECT * FROM companies";

  it("returns a list of companies", async () => {
    const mockClient = { rows: [mockCompanies] };
    mockQuery.mockResolvedValueOnce(mockClient);

    const result = await listCompanies();

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(query2);
    expect(result).toEqual([mockCompanies]);
  });

  it("returns an empty array if no company found", async () => {
    const mockClient = { rows: [] };
    mockQuery.mockResolvedValueOnce(mockClient);

    const result = await listCompanies();

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(query2);
    expect(result).toEqual([]);
  });
});

describe("updateBeneficiaries", () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockConnect = jest.fn();
  const mockQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({ connect: mockConnect } as any);
    mockConnect.mockResolvedValue({ query: mockQuery });
  });

  it("updates beneficiary data in the database", async () => {
    const mockClient = { rows: [IBeneficiaryMock] };
    const mockToday = new Date();

    mockQuery.mockResolvedValueOnce(mockClient);

    const result = await updateBeneficiaries({...IBeneficiaryMock, updated_at: mockToday}, '12345');

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      "UPDATE beneficiaries SET health_plan_id = $2, updated_at = $3, health_plan_card_id = $4, holder_health_plan_card_id = $5 WHERE cpf = $1",
      [IBeneficiaryMock.cpf, IBeneficiaryMock.health_plan_id, mockToday, IBeneficiaryMock.health_plan_card_id, IBeneficiaryMock.holder_health_plan_card_id],
    );
    expect(result).toEqual([IBeneficiaryMock]);
  });
});

describe("createBeneficiaries", () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockConnect = jest.fn();
  const mockQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({ connect: mockConnect } as any);
    mockConnect.mockResolvedValue({ query: mockQuery });
  });

  it("creates a new beneficiary in the database and returns an array of beneficiaries", async () => {
    const mockClient = { rows: [mockCreateBeneficiary] };
    const mockId = "12345";

    mockQuery.mockResolvedValueOnce(mockClient);

    const result = await createBeneficiaries(mockCreateBeneficiary, mockId, '67890');

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockCreateBeneficiary]);
  });

  it("throws an error if there was a problem creating the beneficiary in the database", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB error"));

    await expect(createBeneficiaries(mockCreateBeneficiary, "12345", '67890')).rejects.toThrow();
  });
});

describe("changeBeneficiaryHistory", () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockConnect = jest.fn();
  const mockQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({ connect: mockConnect } as any);
    mockConnect.mockResolvedValue({ query: mockQuery });
  });

  it("creates a new beneficiary history record in the database and returns a success message", async () => {
    const mockClient = {};
    const mockToday = new Date();

    mockQuery.mockResolvedValueOnce(mockClient);
    const data = {beneficiary_id: "123456", action: 'update'};
    const result = await changeBeneficiaryHistory(data, '12345');

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO beneficiaries_history(beneficiary_id, date, action, status_id) VALUES($1, $2, $3, $4)",
      [data.beneficiary_id, mockToday, data.action, 1],
    );
    expect(result).toEqual(`Beneficiary history changed with update information tracingID: 12345`);
  });

});