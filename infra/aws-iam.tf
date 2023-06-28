data "aws_iam_policy_document" "beneficiaries_role_policy_document" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com", "apigateway.amazonaws.com", "events.amazonaws.com", "ssm.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "read_parameter_store_manage_logs_put_events" {
  # Read Parameter Store
  statement {
    actions   = ["ssm:GetParametersByPath"]
    resources = ["arn:aws:ssm:${var.region}:${var.account_id}:parameter/*"]
  }

  # Manage Logs
  statement {
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents", "logs:CreateLogGroup", "logs:AssociateKmsKey"]
    resources = ["arn:aws:logs:*:*:*"]
  }
  
  # Put events
  statement {
    actions   = ["events:PutEvents"]
    resources = ["arn:aws:events:*:*:event-bus/*"]
  }
}

resource "aws_iam_role" "beneficiaries_iam_lambda_role" {
  name               = var.iam_role_name
  assume_role_policy = data.aws_iam_policy_document.beneficiaries_role_policy_document.json
}

resource "aws_iam_policy" "beneficiaries_iam_lambda_policy" {
  name        = var.iam_policy_name
  description = "[ MANAGED BY TERRAFORM ] - Allow read parameter store, manage logs and put events"
  policy      = data.aws_iam_policy_document.read_parameter_store_manage_logs_put_events.json
}

resource "aws_iam_role_policy_attachment" "function_logging_policy_attachment" {
  role       = aws_iam_role.beneficiaries_iam_lambda_role.id
  policy_arn = aws_iam_policy.beneficiaries_iam_lambda_policy.arn
}
