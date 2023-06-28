export class BeneficiaryErrorMessages {
  public static readonly BENEFICIARY_TYPE_MISSING =
    "Tipo de beneficiário não informado";
  public static readonly INVALID_BENEFICIARY_TYPE =
    "Tipo de beneficiário inválido. Use apenas TITULAR ou DEPENDENTE";
  public static readonly HOLDER_CPF_MISSING_OR_INVALID =
    "Número do cpf do titular não informado ou inválido";
  public static readonly CPF_MISSING_OR_INVALID =
    "CPF não informado ou inválido: use apenas números";
  public static readonly FULL_NAME_MISSING = "Nome completo não informado";
  public static readonly DATE_OF_BIRTH_MISSING_OR_INVALID =
    "Data de nascimento não informada ou inválida: use o formato DD/MM/AAAA";
  public static readonly INVALID_EMAIL = "E-mail inválido";

  public static readonly PROCESS_TYPE_MISSING_OR_INVALID =
    "Tipo de processamento não informado ou inválido. Use apenas Base de beneficiários, Adição individual ou Correção";

  public static readonly COMPANY_MISSING_OR_INVALID =
    "O ID da empresa não foi informado ou é inválido";

  public static readonly COMPETENCE_DATE_MISSING_OR_INVALID =
    "A data de competência não informada ou inválida: use o formato DD/MM/AAAA";

  public static readonly PROCESS_BY_INVALID_EMAIL = "E-mail não informado ou inválido";
}
