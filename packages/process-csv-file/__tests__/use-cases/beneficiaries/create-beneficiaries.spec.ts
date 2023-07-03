import { createBeneficiariesAsync } from "../../../src/repository/beneficiaries/beneficiaries";
import { publishEventBridgeEvent } from "@beneficiaries-domain/common/event-bridge-client";
import { activateBeneficiaries } from "../../../src/use-cases/beneficiaries/activate-beneficiaries";
import { getHeathPlanInfoByCodeOrName } from "../../../src/utils/health-plan-helpers";
import { forceParseDateString } from "../../../src/utils/date-helpers";
import { createBeneficiaries } from "../../../src/use-cases/beneficiaries/create-beneficiaries";
import { IHealthPlan } from "../../../src/repository/health-plan/health-plan.types";
import { IRowWithoutError } from "../../../src/types/types";

jest.mock("../../../src/repository/beneficiaries/beneficiaries");
jest.mock("@beneficiaries-domain/common/event-bridge-client");
jest.mock("../../../src/use-cases/beneficiaries/activate-beneficiaries");
jest.mock("../../../src/utils/health-plan-helpers");
jest.mock("../../../src/utils/date-helpers");
jest.mock("crypto");

describe("createBeneficiaries", () => {
  const mockDate = new Date("2023-06-22T23:00:00.000Z");
  const originalDate = Date;

  beforeEach(() => {
    jest.clearAllMocks();

    global.Date = jest.fn(() => mockDate) as any;
    global.Date.now = originalDate.now;
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  it("should create beneficiaries and activate them", async () => {
    const tracingId = "tracing-id";
    const companyId = 123;
    jest.spyOn(require("crypto"), "randomUUID").mockReturnValue(tracingId);
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
    const beneficiariesToCreate: IRowWithoutError[] = [
      {
        number: 1,
        raw: "row-1",
        processedRow: {
          beneficiaryType: "titular",
          planCode: "plan-code-1",
          planName: "plan-name-1",
          cardNumber: "card-1",
          holderCardNumber: "holder-card-1",
          cpf: "123456789",
          fullName: "John Doe",
          dateOfBirth: "01/01/1990",
          gender: "male",
          email: "john@example.com",
          cpfHolder: "987654321",
        },
      },
      {
        number: 2,
        raw: "row-2",
        processedRow: {
          beneficiaryType: "dependente",
          planCode: "plan-code-2",
          planName: "plan-name-2",
          cardNumber: "card-2",
          holderCardNumber: "holder-card-2",
          cpf: "987654321",
          fullName: "Jane Smith",
          dateOfBirth: "05/05/1985",
          gender: "female",
          email: "jane@example.com",
          cpfHolder: "123456789",
        },
      },
    ];

    const mockGetHeathPlanInfoByCodeOrName =
      getHeathPlanInfoByCodeOrName as jest.MockedFunction<
        typeof getHeathPlanInfoByCodeOrName
      >;
    const mockForceParseDateString =
      forceParseDateString as jest.MockedFunction<typeof forceParseDateString>;
    const mockCreateBeneficiariesAsync =
      createBeneficiariesAsync as jest.MockedFunction<
        typeof createBeneficiariesAsync
      >;
    const mockPublishEventBridgeEvent =
      publishEventBridgeEvent as jest.MockedFunction<
        typeof publishEventBridgeEvent
      >;
    const mockActivateBeneficiaries =
      activateBeneficiaries as jest.MockedFunction<
        typeof activateBeneficiaries
      >;

    // Mock getHeathPlanInfoByCodeOrName
    mockGetHeathPlanInfoByCodeOrName
      .mockReturnValueOnce(healthPlans[0]) // Mock first call with plan 1
      .mockReturnValueOnce(healthPlans[1]); // Mock second call with plan 2

    // Mock forceParseDateString
    mockForceParseDateString
      .mockReturnValueOnce(new Date("01/01/1990")) // Mock first call with date 1
      .mockReturnValueOnce(new Date("05/05/1985")); // Mock second call with date 2

    await createBeneficiaries(
      tracingId,
      companyId,
      healthPlans
    );

    // Verify createBeneficiariesAsync is called with the correct parameters
    expect(mockCreateBeneficiariesAsync).toHaveBeenCalledWith({
      beneficiaries: [
        {
          id: tracingId,
          companyId: companyId,
          healthPlanCardId: beneficiariesToCreate[0].processedRow.cardNumber,
          holderHealthPlanCardId:
            beneficiariesToCreate[0].processedRow.holderCardNumber,
          beneficiaryTypeId: 1,
          name: beneficiariesToCreate[0].processedRow.fullName,
          cpf: beneficiariesToCreate[0].processedRow.cpf,
          birthDate: new Date("01/01/1990"),
          healthPlanId: healthPlans[0].id,
          statusId: 1,
          gender: beneficiariesToCreate[0].processedRow.gender,
          holderCpf: beneficiariesToCreate[0].processedRow.cpfHolder,
          createdAt: mockDate,
        },
        {
          id: tracingId,
          companyId: companyId,
          healthPlanCardId: beneficiariesToCreate[1].processedRow.cardNumber,
          holderHealthPlanCardId:
            beneficiariesToCreate[1].processedRow.holderCardNumber,
          beneficiaryTypeId: 2,
          name: beneficiariesToCreate[1].processedRow.fullName,
          cpf: beneficiariesToCreate[1].processedRow.cpf,
          birthDate: new Date("05/05/1985"),
          healthPlanId: healthPlans[1].id,
          statusId: 1,
          gender: beneficiariesToCreate[1].processedRow.gender,
          holderCpf: beneficiariesToCreate[1].processedRow.cpfHolder,
          createdAt: mockDate,
        },
      ],
    });

    // Verify publishEventBridgeEvent is called with the correct parameters
    expect(mockPublishEventBridgeEvent).toHaveBeenCalledWith(
      "beneficiary.create",
      expect.any(String),
      expect.any(String),
      tracingId,
      expect.objectContaining({
        id: expect.any(String),
        cpf: expect.any(String),
        fullName: expect.any(String),
        birthDate: expect.any(String),
        beneficiaryType: expect.any(Number),
        company: companyId,
        holderCpf: expect.any(String),
      })
    );

    // Verify activateBeneficiaries is called with the correct parameters
    expect(mockActivateBeneficiaries).toHaveBeenCalledWith(
      tracingId,
      companyId,
      [
        {
          parsed: beneficiariesToCreate[0],
          created: expect.objectContaining({
            id: expect.any(String),
          }),
        },
        {
          parsed: beneficiariesToCreate[1],
          created: expect.objectContaining({
            id: expect.any(String),
          }),
        },
      ]
    );
  });

  it("should throw an error if createBeneficiariesAsync fails", async () => {
    const tracingId = "tracing-id";
    const companyId = 123;
    const errorMessage = "Failed to create beneficiaries";

    jest.spyOn(require("crypto"), "randomUUID").mockReturnValue(tracingId);

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

    const beneficiariesToCreate: IRowWithoutError[] = [
      {
        number: 1,
        raw: "row-1",
        processedRow: {
          beneficiaryType: "titular",
          planCode: "plan-code-1",
          planName: "plan-name-1",
          cardNumber: "card-1",
          holderCardNumber: "holder-card-1",
          cpf: "123456789",
          fullName: "John Doe",
          dateOfBirth: "01/01/1990",
          gender: "male",
          email: "john@example.com",
          cpfHolder: "987654321",
        },
      },
      {
        number: 2,
        raw: "row-2",
        processedRow: {
          beneficiaryType: "dependente",
          planCode: "plan-code-2",
          planName: "plan-name-2",
          cardNumber: "card-2",
          holderCardNumber: "holder-card-2",
          cpf: "987654321",
          fullName: "Jane Smith",
          dateOfBirth: "05/05/1985",
          gender: "female",
          email: "jane@example.com",
          cpfHolder: "123456789",
        },
      },
    ];

    const mockGetHeathPlanInfoByCodeOrName =
      getHeathPlanInfoByCodeOrName as jest.MockedFunction<
        typeof getHeathPlanInfoByCodeOrName
      >;
    const mockForceParseDateString =
      forceParseDateString as jest.MockedFunction<typeof forceParseDateString>;
    const mockCreateBeneficiariesAsync =
      createBeneficiariesAsync as jest.MockedFunction<
        typeof createBeneficiariesAsync
      >;
    const mockPublishEventBridgeEvent =
      publishEventBridgeEvent as jest.MockedFunction<
        typeof publishEventBridgeEvent
      >;
    const mockActivateBeneficiaries =
      activateBeneficiaries as jest.MockedFunction<
        typeof activateBeneficiaries
      >;

    // Mock getHeathPlanInfoByCodeOrName
    mockGetHeathPlanInfoByCodeOrName
      .mockReturnValueOnce(healthPlans[0]) // Mock first call with plan 1
      .mockReturnValueOnce(healthPlans[1]); // Mock second call with plan 2

    // Mock forceParseDateString
    mockForceParseDateString
      .mockReturnValueOnce(new Date("01/01/1990")) // Mock first call with date 1
      .mockReturnValueOnce(new Date("05/05/1985")); // Mock second call with date 2

    // Mock createBeneficiariesAsync to throw an error
    mockCreateBeneficiariesAsync.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      createBeneficiaries(
        tracingId,
        companyId,
        healthPlans,
        beneficiariesToCreate
      )
    ).rejects.toThrow(errorMessage);

    // Verify createBeneficiariesAsync is called with the correct parameters
    expect(mockCreateBeneficiariesAsync).toHaveBeenCalledWith({
      beneficiaries: [
        {
          id: tracingId,
          companyId: companyId,
          healthPlanCardId: beneficiariesToCreate[0].processedRow.cardNumber,
          holderHealthPlanCardId:
            beneficiariesToCreate[0].processedRow.holderCardNumber,
          beneficiaryTypeId: 1,
          name: beneficiariesToCreate[0].processedRow.fullName,
          cpf: beneficiariesToCreate[0].processedRow.cpf,
          birthDate: new Date("01/01/1990"),
          healthPlanId: healthPlans[0].id,
          statusId: 1,
          gender: beneficiariesToCreate[0].processedRow.gender,
          holderCpf: beneficiariesToCreate[0].processedRow.cpfHolder,
          createdAt: mockDate,
        },
        {
          id: tracingId,
          companyId: companyId,
          healthPlanCardId: beneficiariesToCreate[1].processedRow.cardNumber,
          holderHealthPlanCardId:
            beneficiariesToCreate[1].processedRow.holderCardNumber,
          beneficiaryTypeId: 2,
          name: beneficiariesToCreate[1].processedRow.fullName,
          cpf: beneficiariesToCreate[1].processedRow.cpf,
          birthDate: new Date("05/05/1985"),
          healthPlanId: healthPlans[1].id,
          statusId: 1,
          gender: beneficiariesToCreate[1].processedRow.gender,
          holderCpf: beneficiariesToCreate[1].processedRow.cpfHolder,
          createdAt: mockDate,
        },
      ],
    });

    // Verify publishEventBridgeEvent is not called
    expect(mockPublishEventBridgeEvent).not.toHaveBeenCalled();

    // Verify activateBeneficiaries is not called
    expect(mockActivateBeneficiaries).not.toHaveBeenCalled();
  });

  //TODO - Implement other tests
});
