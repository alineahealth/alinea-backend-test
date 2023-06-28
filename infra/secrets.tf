data "aws_secretsmanager_secret_version" "app_secret" {
  secret_id = "beneficiary-domain/secrets"
}

locals {
    param = jsondecode(
    data.aws_secretsmanager_secret_version.app_secret.secret_string
  )
}