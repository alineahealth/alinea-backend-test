data "archive_file" "list_beneficiaries_imports_failed_rows_zip" {
  type        = "zip"
  source_dir  = "../build/list-beneficiaries-imports-failed-rows"
  output_path = "../build/list-beneficiaries-imports-failed-rows.zip"
}

resource "aws_cloudwatch_log_group" "list_beneficiaries_imports_failed_rows_log_group" {
  name              = "/aws/lambda/beneficiaries/list-beneficiaries-imports-failed-rows"
  retention_in_days = 30
}

resource "aws_lambda_function" "list_beneficiaries_imports_failed_rows_function" {
  publish          = true
  filename         = "../build/list-beneficiaries-imports-failed-rows.zip"
  function_name    = "list-beneficiaries-imports-failed-rows-function-${var.env}"
  role             = aws_iam_role.beneficiaries_iam_lambda_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.list_beneficiaries_imports_failed_rows_zip.output_base64sha256
  runtime          = "nodejs16.x"
  timeout          = 30
  memory_size      = 256
  layers           = [aws_lambda_layer_version.node_modules_layer.arn]
  environment {
    variables = {
      DB_HOST = local.param.DB_HOST,
      DB_PORT = local.param.DB_PORT,
      DB_USER = local.param.DB_USER,
      DB_PASSWORD = local.param.DB_PASSWORD,
      DB_NAME = local.param.DB_NAME,
    }
  }
  depends_on         = [
    aws_iam_role_policy_attachment.function_logging_policy_attachment,
    aws_cloudwatch_log_group.list_beneficiaries_imports_failed_rows_log_group,
    aws_api_gateway_resource.beneficiaries_imports_failed_rows_list,
    aws_api_gateway_authorizer.api_gateway_authorizer
  ]
}

resource "aws_lambda_permission" "list_beneficiaries_imports_failed_rows_permission_apigateway" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_beneficiaries_imports_failed_rows_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.beneficiaries_domain_api.id}/*/*/*"
}

# --- List Beneficiaries Imports Failed Rows Resource --- #

resource "aws_api_gateway_resource" "beneficiaries_imports_failed_rows_process_id" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  parent_id   = aws_api_gateway_resource.beneficiaries_imports.id
  path_part   = "{processId}"
}

resource "aws_api_gateway_resource" "beneficiaries_imports_failed_rows_list" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  parent_id   = aws_api_gateway_resource.beneficiaries_imports_failed_rows_process_id.id
  path_part   = "failed-rows"
}

resource "aws_api_gateway_method" "list_beneficiaries_imports_failed_rows_method" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  resource_id = aws_api_gateway_resource.beneficiaries_imports_failed_rows_list.id
  http_method = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.api_gateway_authorizer.id
}

resource "aws_api_gateway_integration" "beneficiaries_imports_failed_rows_integration" {
  rest_api_id             = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  resource_id             = aws_api_gateway_resource.beneficiaries_imports_failed_rows_list.id
  http_method             = aws_api_gateway_method.list_beneficiaries_imports_failed_rows_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.list_beneficiaries_imports_failed_rows_function.invoke_arn
}