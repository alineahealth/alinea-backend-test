import { changeBeneficiaryHistory, createBeneficiaries, findCPFsInDatabase, listCompanies, listPlans, updateBeneficiaries } from "../src/put-many-beneficiaries.model";
import { putManyBeneficiaries } from "../src/put-many-beneficiaries";
import { mockData } from "../__mock__/IBeneficiaryData.mock"
import { mockHealthPlans } from "../__mock__/IPlan.mock";
import { mockCompanies } from "../__mock__/ICompany.mock";
import { attributesValidation } from "../src/helpers";
import { publishEventBridgeEvent } from "@beneficiaries-domain/common/event-bridge-client";
import { IBeneficiaryMock } from "../__mock__/IBeneficiary.mock";

jest.mock("@beneficiaries-domain/common/event-bridge-client");
jest.mock('../src/helpers.ts', () => ({
  __esModule: true,
  attributesValidation: jest.fn(),
  dataDBValidation: jest.requireActual("../src/helpers.ts").dataDBValidation,
  checkRegister: jest.requireActual("../src/helpers.ts").checkRegister
}));
jest.mock("../src/put-many-beneficiaries.model.ts");


describe('putManyBeneficiaries', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the correct result when all beneficiaries are successfully registered', async () => {
    const params = {
      body: [],
      tracingID: 'test',
    };
    (attributesValidation as jest.Mock).mockReturnValue({ goodRequest:mockData, failedRequest: []});
    (listCompanies as jest.Mock).mockResolvedValueOnce(mockCompanies);
    (listPlans as jest.Mock).mockResolvedValueOnce(mockHealthPlans);
    (findCPFsInDatabase as jest.Mock).mockResolvedValueOnce(undefined);
    (publishEventBridgeEvent as jest.Mock).mockResolvedValueOnce(undefined);
    (createBeneficiaries as jest.Mock).mockResolvedValueOnce(undefined);
    (updateBeneficiaries as jest.Mock).mockResolvedValueOnce(undefined);
    (changeBeneficiaryHistory as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await putManyBeneficiaries(params);

    expect(result.totalSuccess).toBe(2);
    expect(result.updateSuccess).toBe(0);
    expect(result.createSuccess).toBe(2);
    expect(result.totalErrors).toBe(0);
    expect(result.dbErrors).toBe(0);
    expect(result.requestErrors.length).toBe(0);
  });

  it('returns the correct result when some beneficiaries are successfully updated and others are successfully registered', async () => {
    const params = {
      body: [],
      tracingID: 'test',
    };
    (attributesValidation as jest.Mock).mockReturnValue({ goodRequest:mockData, failedRequest: []});
    (listCompanies as jest.Mock).mockResolvedValueOnce(mockCompanies);
    (listPlans as jest.Mock).mockResolvedValueOnce(mockHealthPlans);
    (findCPFsInDatabase as jest.Mock).mockResolvedValueOnce(IBeneficiaryMock);
    (publishEventBridgeEvent as jest.Mock).mockResolvedValueOnce(undefined);
    (createBeneficiaries as jest.Mock).mockResolvedValueOnce(undefined);
    (updateBeneficiaries as jest.Mock).mockResolvedValueOnce(undefined);
    (changeBeneficiaryHistory as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await putManyBeneficiaries(params);

    expect(result.totalSuccess).toBe(2);
    expect(result.updateSuccess).toBe(1);
    expect(result.createSuccess).toBe(1);
    expect(result.totalErrors).toBe(0);
    expect(result.dbErrors).toBe(0);
    expect(result.requestErrors.length).toBe(0);
  });

  it('throws an error when no body is provided', async () => {
    const params: any = {
      body: null,
      tracingID: 'test',
    };
    await expect(putManyBeneficiaries(params)).rejects.toThrow(
      'I can not register without information test does not have body'
    );
  });
});