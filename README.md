# beneficiary-domain

Domínio Beneficiário - Arquitetura Serverless

## Objetivo

Esse live coding tem como objetivo avaliar leitura e escrita de código para corrigir e melhorar o microserviço de beneficiários.

## O que será avaliado

Iremos avaliar a qualidade das soluções realizadas, a organização da priorização do que precisa ser feito primeiro a nível de importância. Quantidade de itens resolvidos terá um peso menor do que os itens citados acima.

## Teste

O teste consiste em:

- Corrigir bugs
- Corrigir build
- Corrigir testes
- Refatoração

### Arquivos que precisam ser alterados (arquivos podem conter mais de 1 erro)

- packages/put-many-beneficiaries/src/put-many-beneficiaries.model.ts
- packages/process-csv-file/src/utils/date-helpers.ts
- packages/process-csv-file/src/use-cases/beneficiaries/create-beneficiaries.ts
- packages/process-csv-file/src/repository/beneficiaries/beneficiaries.types.ts
- packages/process-csv-file/tests/use-cases/beneficiaries/create-beneficiaries.spec.ts
- packages/list-beneficiaries/src/list-beneficiaries.types.ts
- packages/list-beneficiaries/src/list-beneficiaries.find.ts
- packages/list-beneficiaries/src/index.ts
- infra/list-beneficiaries.tf
