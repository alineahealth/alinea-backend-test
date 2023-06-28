import { publishEventBridgeEvent } from "@beneficiaries-domain/common/event-bridge-client";
import {
  createBeneficiariesHistoriesAsync,
  updateBeneficiariesAsync,
} from "../../../src/repository/beneficiaries/beneficiaries";
import { IBeneficiary } from "../../../src/repository/beneficiaries/beneficiaries.types";
import { IHealthPlan } from "../../../src/repository/health-plan/health-plan.types";
import { IRowWithoutError } from "../../../src/types/types";
import { IBeneficiaryHistory } from "../../../src/repository/beneficiaries/beneficiaries.types";
import { getHeathPlanInfoByCodeOrName } from "../../../src/utils/health-plan-helpers";
import { updatedBeneficiary } from "../../../src/use-cases/beneficiaries/update-beneficiaries";

jest.mock("../../../src/repository/beneficiaries/beneficiaries");
jest.mock("@beneficiaries-domain/common/event-bridge-client");
jest.mock("../../../src/use-cases/beneficiaries/activate-beneficiaries");
jest.mock("../../../src/utils/health-plan-helpers");
jest.mock("../../../src/utils/date-helpers");
jest.mock("crypto");

describe("updatedBeneficiary", () => {
  const mockDate = new Date("2023-06-22T23:00:00.000Z");
  const originalDate = Date;

  beforeEach(() => {
    jest.clearAllMocks();

    global.Date = jest.fn(() => mockDate) as any;
    global.Date.now = originalDate.now;
  });

  afterEach(() => {
    global.Date = originalDate;
    jest.resetAllMocks();
  });

  const tracingId = "test-tracing-id";
  const healthPlans: IHealthPlan[] = [
    {
      id: 1,
      insurer_id: 1,
      name: "health-plan-1",
      health_plan_code: "plan-code-1",
      status_id: 1,
    },
    {
      id: 2,
      insurer_id: 2,
      name: "health-plan-2",
      health_plan_code: "plan-code-2",
      status_id: 1,
    },
  ];

  it("should return empty success and error arrays if beneficiariesToUpdate is empty", async () => {
    const beneficiariesToUpdate: IRowWithoutError[] = [
      {
        number: 1,
        raw: "Beneficiary 1",
        processedRow: {
          beneficiaryType: "titular",
          planCode: "plan-code-1",
          planName: "plan-name-1",
          cardNumber: "card-1",
          holderCardNumber: "holder-card-1",
          cpf: "11111111111",
          fullName: "John Doe",
          dateOfBirth: "01/01/1990",
          gender: "male",
          email: "john@example.com",
          cpfHolder: "987654321",
        },
      },
      {
        number: 2,
        raw: "Beneficiary 2",
        processedRow: {
          beneficiaryType: "dependente",
          planCode: "plan-code-2",
          planName: "plan-name-2",
          cardNumber: "card-2",
          holderCardNumber: "holder-card-1",
          cpf: "22222222222",
          fullName: "John Doe",
          dateOfBirth: "01/01/1990",
          gender: "male",
          email: "john@example.com",
          cpfHolder: "",
        },
      },
    ];
    const recoveredBeneficiaries: IBeneficiary[] = [
      {
        id: "1",
        companyId: 1,
        healthPlanCardId: "123",
        holderHealthPlanCardId: "456",
        beneficiaryTypeId: 1,
        name: "John Doe",
        cpf: "11111111111",
        birthDate: "1990-01-01",
        healthPlanId: 1,
        statusId: 1,
        gender: "Male",
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: "1234567890",
        displayName: "John D.",
      },
      {
        id: "2",
        companyId: 1,
        healthPlanCardId: "123",
        holderHealthPlanCardId: "holder-card-2",
        beneficiaryTypeId: 2,
        name: "John Doe",
        cpf: "22222222222",
        birthDate: "1990-01-01",
        healthPlanId: 1,
        statusId: 1,
        gender: "Male",
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: "1234567890",
        displayName: "John D.",
      },
    ];

    const result = await updatedBeneficiary(
      tracingId,
      healthPlans,
      [],
      recoveredBeneficiaries
    );

    expect(result).toEqual({
      success: [],
      errors: [],
    });
  });

  it("should handle empty beneficiary list and return an empty result", async () => {
    const beneficiariesToUpdate: IRowWithoutError[] = [];
    const recoveredBeneficiaries: IBeneficiary[] = [];

    const expected = {
      success: [],
      errors: [],
    };

    const result = await updatedBeneficiary(
      tracingId,
      healthPlans,
      beneficiariesToUpdate,
      recoveredBeneficiaries
    );

    expect(updateBeneficiariesAsync).not.toBeCalled();
    expect(createBeneficiariesHistoriesAsync).not.toBeCalled();
    expect(publishEventBridgeEvent).not.toBeCalled();
    expect(result).toEqual(expected);
  });

  it("should update beneficiaries, create histories, and publish events for updated beneficiaries", async () => {
    const beneficiariesToUpdate: IRowWithoutError[] = [
      {
        number: 1,
        raw: "Beneficiary 1",
        processedRow: {
          beneficiaryType: "titular",
          planCode: "plan-code-1",
          planName: "plan-name-1",
          cardNumber: "card-1",
          holderCardNumber: "holder-card-1",
          cpf: "11111111111",
          fullName: "John Doe",
          dateOfBirth: "01/01/1990",
          gender: "male",
          email: "john@example.com",
          cpfHolder: "987654321",
        },
      },
      {
        number: 2,
        raw: "Beneficiary 2",
        processedRow: {
          beneficiaryType: "dependente",
          planCode: "plan-code-2",
          planName: "plan-name-2",
          cardNumber: "card-2",
          holderCardNumber: "holder-card-2",
          cpf: "22222222222",
          fullName: "John Doe",
          dateOfBirth: "01/01/1990",
          gender: "male",
          email: "john@example.com",
          cpfHolder: "",
        },
      },
    ];
    const recoveredBeneficiaries: IBeneficiary[] = [
      {
        id: "1",
        companyId: 1,
        healthPlanCardId: "123",
        holderHealthPlanCardId: "456",
        beneficiaryTypeId: 1,
        name: "John Doe",
        cpf: "11111111111",
        birthDate: "1990-01-01",
        healthPlanId: 1,
        statusId: 1,
        gender: "Male",
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: "1234567890",
        displayName: "John D.",
      },
      {
        id: "2",
        companyId: 1,
        healthPlanCardId: "123",
        holderHealthPlanCardId: "holder-card-2",
        beneficiaryTypeId: 2,
        name: "John Doe",
        cpf: "22222222222",
        birthDate: "1990-01-01",
        healthPlanId: 1,
        statusId: 1,
        gender: "Male",
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: "1234567890",
        displayName: "John D.",
      },
    ];

    const updatedBeneficiaries: IBeneficiary[] = [
      {
        id: "1",
        companyId: 1,
        healthPlanCardId: "123",
        holderHealthPlanCardId: "456",
        beneficiaryTypeId: 1,
        name: "John Doe",
        cpf: "11111111111",
        birthDate: "1990-01-01",
        healthPlanId: 1,
        statusId: 1,
        gender: "Male",
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: "1234567890",
        displayName: "John D.",
      },
      {
        id: "2",
        companyId: 1,
        healthPlanCardId: "123",
        holderHealthPlanCardId: "456",
        beneficiaryTypeId: 1,
        name: "John Doe",
        cpf: "22222222222",
        birthDate: "1990-01-01",
        healthPlanId: 1,
        statusId: 1,
        gender: "Male",
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: "1234567890",
        displayName: "John D.",
      },
    ];

    const beneficiariesHistories: IBeneficiaryHistory[] = [
      {
        beneficiary_id: "1",
        date: new Date(),
        action: "updated-beneficiary",
        status_id: 1,
      },
      {
        beneficiary_id: "2",
        date: new Date(),
        action: "updated-beneficiary",
        status_id: 1,
      },
    ];

    const mockGetHeathPlanInfoByCodeOrName =
      getHeathPlanInfoByCodeOrName as jest.MockedFunction<
        typeof getHeathPlanInfoByCodeOrName
      >;

    const mockPublishEventBridgeEvent =
      publishEventBridgeEvent as jest.MockedFunction<
        typeof publishEventBridgeEvent
      >;

    // Mock getHeathPlanInfoByCodeOrName
    mockGetHeathPlanInfoByCodeOrName
      .mockReturnValueOnce(healthPlans[0]) // Mock first call with plan 1
      .mockReturnValueOnce(healthPlans[1]); // Mock second call with plan 2

    const mockUpdateBeneficiariesAsync =
      updateBeneficiariesAsync as jest.MockedFunction<
        typeof updateBeneficiariesAsync
      >;

    mockUpdateBeneficiariesAsync.mockImplementation(() =>
      Promise.resolve(updatedBeneficiaries)
    );

    const mockCreateBeneficiariesHistoriesAsync =
      createBeneficiariesHistoriesAsync as jest.MockedFunction<
        typeof createBeneficiariesHistoriesAsync
      >;

    mockCreateBeneficiariesHistoriesAsync.mockResolvedValue(true);

    const result = await updatedBeneficiary(
      tracingId,
      healthPlans,
      beneficiariesToUpdate,
      recoveredBeneficiaries
    );

    expect(result).toEqual({
      success: beneficiariesToUpdate,
      errors: [],
    });

    expect(mockUpdateBeneficiariesAsync).toHaveBeenCalledWith({
      beneficiaries: [
        {
          id: "1",
          healthPlanId: 1,
          healthPlanCardId: "card-1",
          holderHealthPlanCardId: "holder-card-1",
          updatedAt: mockDate,
        },
        {
          id: "2",
          healthPlanId: 2,
          healthPlanCardId: "card-2",
          holderHealthPlanCardId: "holder-card-2",
          updatedAt: mockDate,
        },
      ],
    });

    expect(mockCreateBeneficiariesHistoriesAsync).toHaveBeenCalledWith({
      beneficiaries: beneficiariesHistories,
    });

    expect(mockPublishEventBridgeEvent).toHaveBeenCalledWith(
      "beneficiary.updated",
      process.env.EVENT_BUS_NAME ?? "default",
      process.env.AWS_REGION ?? "us-east-2",
      tracingId,
      expect.any(Object)
    );

    expect(mockPublishEventBridgeEvent).toHaveBeenCalledTimes(2);
  });
});
