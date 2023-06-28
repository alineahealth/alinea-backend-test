
/**
* Mobile Gateway 
*/


data "aws_api_gateway_rest_api" "mobile_api" {
  name = var.mobile_api_gateway_name
}

data "external" "mobile_api_authorizer" {
  program = ["sh", "-c", "aws apigateway get-authorizers --rest-api-id ${data.aws_api_gateway_rest_api.mobile_api.id} --query 'items[0].{Id:id}'"]
}

resource "aws_api_gateway_deployment" "deployment_mobile_api" {
  rest_api_id       = data.aws_api_gateway_rest_api.mobile_api.id
  stage_description = "Pipeline deployment for mobile-apis gateway"
  stage_name        = var.env
  depends_on = [
    aws_api_gateway_integration.dependents_integration,
  ]
  lifecycle {
    create_before_destroy = true
  }
  variables = {
    deployed_at = "${timestamp()}"
  }
}

# End Mobile Gateway

resource "aws_api_gateway_rest_api" "beneficiaries_domain_api" {
  name        = "beneficiaries-domain-api-${var.env}"
  description = "API gateway from beneficiaries domain"
  api_key_source = "HEADER"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
  binary_media_types = ["text/csv"]
}

resource "aws_api_gateway_gateway_response" "unathorized" {
  rest_api_id   = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  response_type = "DEFAULT_4XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin" = "'*'",
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'authorization,content-type'",
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,HEAD,PUT,PATCH,POST,DELETE'",
    "gatewayresponse.header.Access-Control-Allow-Credentials" = "'true'"
  }
}

resource "aws_api_gateway_resource" "cors_resource" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  parent_id   = aws_api_gateway_rest_api.beneficiaries_domain_api.root_resource_id
  path_part   = "{cors+}"
}

resource "aws_api_gateway_method" "cors_method" {
  rest_api_id   = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  resource_id   = aws_api_gateway_resource.cors_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "cors_integration" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  resource_id = aws_api_gateway_resource.cors_resource.id
  http_method = aws_api_gateway_method.cors_method.http_method
  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode=200
    })
  }
}

resource "aws_api_gateway_method_response" "cors_response" {
  depends_on = [aws_api_gateway_method.cors_method]
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  resource_id = aws_api_gateway_resource.cors_resource.id
  http_method = aws_api_gateway_method.cors_method.http_method
  status_code = 200
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "cors_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  resource_id = aws_api_gateway_resource.cors_resource.id
  http_method = aws_api_gateway_method.cors_method.http_method
  status_code = 200
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'",
    "method.response.header.Access-Control-Allow-Headers" = "'authorization,content-type'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,HEAD,PUT,PATCH,POST,DELETE'",
    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
  }

  depends_on = [
    aws_api_gateway_integration.cors_integration,
    aws_api_gateway_method_response.cors_response
  ]
}

resource "aws_api_gateway_deployment" "deployment_stage" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  stage_name  = var.env
  depends_on = [
    aws_api_gateway_integration.dependents_integration,
    aws_api_gateway_integration.beneficiaries_integration,
    aws_api_gateway_integration.beneficiaries_imports_failed_rows_integration,
    aws_api_gateway_integration.beneficiaries_companies_integration,
    aws_api_gateway_integration.beneficiaries_insurers_integration,
  ]
  lifecycle {
    create_before_destroy = true
  }
  variables = {
    deployed_at = "${timestamp()}"
  }
}

resource "aws_api_gateway_base_path_mapping" "beneficiaries-base-path-mapping" {
  api_id      = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  stage_name  = var.env  
  domain_name = "${var.domain_name}"
  base_path   = "beneficiary-domain"
  depends_on  = [
    aws_api_gateway_rest_api.beneficiaries_domain_api
  ]
}

resource "aws_api_gateway_resource" "beneficiaries" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  parent_id   = aws_api_gateway_rest_api.beneficiaries_domain_api.root_resource_id
  path_part   = "v1"
}

data "aws_cognito_user_pools" "backoffice_pool" {
  name = "backoffice"
}

resource "aws_api_gateway_authorizer" "api_gateway_authorizer" {
  name                   = "api_auth-beneficiary-domain"
  rest_api_id            = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  type                   = "COGNITO_USER_POOLS"
  provider_arns          = data.aws_cognito_user_pools.backoffice_pool.arns
}
