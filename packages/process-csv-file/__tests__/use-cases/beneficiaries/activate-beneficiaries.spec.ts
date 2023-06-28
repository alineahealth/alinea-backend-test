import { publishEventBridgeEvent } from "@beneficiaries-domain/common/event-bridge-client";
import { getBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms } from "../../../src/repository/beneficiaries/beneficiaries";
import {
  IBeneficiaryToActivate,
  IListBeneficiariesToActivate,
} from "../../../src/repository/beneficiaries/beneficiaries.types";
import { activateBeneficiaries } from '../../../src/use-cases/beneficiaries/activate-beneficiaries';
import { beneficiariesToActivateMock } from "../../../__mock__/beneficiariesMock";
import { randomUUID } from "crypto";
import '../../../src/utils/string-helpers';

jest.mock("@beneficiaries-domain/common/event-bridge-client", () => ({
  publishEventBridgeEvent: jest.fn()
}));
jest.mock("../../../src/repository/beneficiaries/beneficiaries");

describe("activateBeneficiaries", () => {
  const getBeneficiariesByCompanyAndHolderCpfsAndAcceptedTermsMock =
    getBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms as jest.MockedFunction<
      typeof getBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms
    >;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should activate beneficiaries successfully", async () => {
    const mockBeneficiary1: IBeneficiaryToActivate = {
      id: "1",
      cpf: "999.888.777-66",
      display_name: "Beneficiário 1",
      accepted_terms_at: new Date('2023-06-23T14:06:03.172Z'),
      phone_number: "1234567890",
    };

    const mockBeneficiary2: IBeneficiaryToActivate = {
      id: "2",
      cpf: "999.555.777-33",
      display_name: "Beneficiário 2",
      accepted_terms_at: new Date('2023-06-23T14:06:03.172Z'),
      phone_number: "0987654321",
    };

    const mockBeneficiaries: IListBeneficiariesToActivate = {
      items: [mockBeneficiary1, mockBeneficiary2],
    };

    const listBeneficiariesToActivateMock =
      (): Promise<IListBeneficiariesToActivate> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(mockBeneficiaries);
          }, 2000); // Simulando um atraso de 2 segundos na resposta
        });
      };

    getBeneficiariesByCompanyAndHolderCpfsAndAcceptedTermsMock.mockResolvedValue(listBeneficiariesToActivateMock());

    const tracingId = randomUUID();
    const companyId = 456;

    const result = await activateBeneficiaries(tracingId, companyId, beneficiariesToActivateMock)
    expect(getBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms).toHaveBeenCalledWith({
      companyId,
      cpfs: [ '999.888.777-66', '999.555.777-33' ]
    });
    expect(publishEventBridgeEvent).toHaveBeenCalledWith(
      'beneficiary.activate',
      'default',
      'us-east-2',
      tracingId,
      {
        id: '1',
        displayName: 'João Silva',
        acceptedTermsAt: new Date('2023-06-23T14:06:03.172Z'),
        phoneNumber: '1234567890'
      }
    )
    expect(publishEventBridgeEvent).toHaveBeenCalledWith(
      'beneficiary.activate',
      'default',
      'us-east-2',
      tracingId,
      {
        id: '3',
        displayName: 'Ana Oliveira',
        acceptedTermsAt: new Date('2023-06-23T14:06:03.172Z'),
        phoneNumber: '0987654321'
      }
    )
  });
});
