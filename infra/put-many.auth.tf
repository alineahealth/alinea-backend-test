resource "aws_api_gateway_usage_plan" "myusageplan" {
  name = "my_usage_plan"
  api_stages {
    api_id = aws_api_gateway_rest_api.beneficiaries_domain_api.id
    stage  = var.env
  }
}

resource "aws_api_gateway_api_key" "api_key_value" {
  name = "api_key_value"
  value = var.api_key_value
}

resource "aws_api_gateway_usage_plan_key" "main" {
  key_id        = aws_api_gateway_api_key.api_key_value.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.myusageplan.id
}