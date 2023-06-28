resource "aws_api_gateway_resource" "beneficiaries_csv_upload" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  parent_id   = aws_api_gateway_resource.beneficiaries.id
  path_part   = "upload"

  depends_on = [aws_api_gateway_resource.beneficiaries]
}

resource "aws_api_gateway_resource" "fileName" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  parent_id   = aws_api_gateway_resource.beneficiaries_csv_upload.id
  path_part   = "{fileName}"

  depends_on = [aws_api_gateway_resource.beneficiaries_csv_upload]
}

resource "aws_api_gateway_method" "beneficiaries_csv_upload_method" {
  rest_api_id   = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  resource_id   = aws_api_gateway_resource.fileName.id
  http_method   = "PUT"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.api_gateway_authorizer.id
  request_parameters = {
    "method.request.path.fileName"   = true
  }

  depends_on = [
    aws_api_gateway_authorizer.api_gateway_authorizer,
    aws_api_gateway_resource.fileName,
    aws_api_gateway_rest_api.beneficiaries_domain_api
  ]
}

resource "aws_api_gateway_method_response" "beneficiaries_csv_upload_response" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  resource_id = aws_api_gateway_resource.fileName.id
  http_method = aws_api_gateway_method.beneficiaries_csv_upload_method.http_method
  status_code = 200

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }

  depends_on = [aws_api_gateway_method.beneficiaries_csv_upload_method]
}

resource "aws_api_gateway_integration_response" "beneficiaries_csv_upload_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  resource_id = aws_api_gateway_resource.fileName.id
  http_method = "PUT"
  status_code = 200

  response_templates = {
    "application/json" = ""
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_rest_api.beneficiaries_domain_api,
    aws_api_gateway_resource.fileName,
    aws_api_gateway_method_response.beneficiaries_csv_upload_response
  ]
}

resource "aws_api_gateway_integration" "beneficiaries_csv_upload_integration" {
  rest_api_id             = aws_api_gateway_rest_api.beneficiaries_domain_api.id
  resource_id             = aws_api_gateway_resource.fileName.id
  http_method             = aws_api_gateway_method.beneficiaries_csv_upload_method.http_method
  integration_http_method = "PUT"
  type                    = "AWS"
  credentials             = aws_iam_role.beneficiaries_iam_lambda_role.arn
  uri                     = "arn:aws:apigateway:${var.region}:s3:path/${var.env}-beneficiary-bucket/{key}"

  request_parameters = {
    "integration.request.path.key" = "method.request.path.fileName"
  }

    request_templates = {
    "application/json" = <<EOF
    {
      "body": "$util.base64Encode($input.body)",
      "headers": {
        "Content-Type": "text/csv",
        "Access-Control-Allow-Origin": '*',
      }
    }
    EOF
  }

  depends_on = [ 
    aws_api_gateway_rest_api.beneficiaries_domain_api,
    aws_api_gateway_resource.fileName,
    aws_api_gateway_method.beneficiaries_csv_upload_method,
  ]
}