data "archive_file" "dependents_lambda_zip" {
  type        = "zip"
  source_dir  = "../build/list-dependents"
  output_path = "../build/list-dependents.zip"
}

resource "aws_cloudwatch_log_group" "list_dependents_log_group" {
  name              = "/aws/lambda/beneficiaries/list-dependents"
  retention_in_days = 30
}

resource "aws_lambda_function" "list_dependents_function" {
  publish          = true
  filename         = "../build/list-dependents.zip"
  function_name    = "list-dependents-function-${var.env}"
  role             = aws_iam_role.beneficiaries_iam_lambda_role.arn
  depends_on       = [aws_iam_role_policy_attachment.function_logging_policy_attachment, aws_cloudwatch_log_group.list_dependents_log_group]
  handler          = "index.handler"
  source_code_hash = data.archive_file.dependents_lambda_zip.output_base64sha256
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
}

resource "aws_lambda_permission" "list_dependents_permission_apigateway" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_dependents_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${data.aws_api_gateway_rest_api.mobile_api.id}/*/*/*"
}

/** 
* [version]/[context]/{param}/[resource] - /v1/beneficiaries/{cpf}/dependents
*
* aws_api_gateway_resource - Version
*/
resource "aws_api_gateway_resource" "version_v1" {
  rest_api_id = data.aws_api_gateway_rest_api.mobile_api.id
  parent_id   = data.aws_api_gateway_rest_api.mobile_api.root_resource_id
  path_part   = "v1"
}

/** 
* aws_api_gateway_resource - context
*/
resource "aws_api_gateway_resource" "beneficiary" {
  rest_api_id = data.aws_api_gateway_rest_api.mobile_api.id
  parent_id   = aws_api_gateway_resource.version_v1.id
  path_part   = "beneficiaries"
}

/** 
* aws_api_gateway_resource - params
*/
resource "aws_api_gateway_resource" "dependent_cpf" {
  rest_api_id = data.aws_api_gateway_rest_api.mobile_api.id
  parent_id   = aws_api_gateway_resource.beneficiary.id
  path_part   = "{cpf}"
}

/** 
* aws_api_gateway_resource - resource
*/
resource "aws_api_gateway_resource" "dependents_list" {
  rest_api_id = data.aws_api_gateway_rest_api.mobile_api.id
  parent_id   = aws_api_gateway_resource.dependent_cpf.id
  path_part   = "dependents"
}

resource "aws_api_gateway_method" "dependents_list_method" {
  rest_api_id = data.aws_api_gateway_rest_api.mobile_api.id
  resource_id = aws_api_gateway_resource.dependents_list.id
  http_method = "GET"
  # TODO: Alterar autorização para cognito
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = data.external.mobile_api_authorizer.result.Id
}

resource "aws_api_gateway_integration" "dependents_integration" {
  rest_api_id             = data.aws_api_gateway_rest_api.mobile_api.id
  resource_id             = aws_api_gateway_resource.dependents_list.id
  http_method             = aws_api_gateway_method.dependents_list_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.list_dependents_function.invoke_arn
}
