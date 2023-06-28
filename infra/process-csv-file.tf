// Lambda file
data "archive_file" "process_csv_file_lambda_zip" {
  type        = "zip"
  source_dir  = "../build/process-csv-file"
  output_path = "../build/process-csv-file.zip"
}

// Cloudwatch log group
resource "aws_cloudwatch_log_group" "process_csv_file_log_group" {
  name              = "/aws/lambda/beneficiaries/process-csv-file"
  retention_in_days = 30
}

// Lambda function
resource "aws_lambda_function" "process_csv_file_function" {
  publish          = true
  filename         = "../build/process-csv-file.zip"
  function_name    = "process-csv-file-function-${var.env}"
  role             = aws_iam_role.beneficiaries_iam_lambda_role.arn
  depends_on       = [
    aws_iam_role_policy_attachment.function_logging_policy_attachment, 
    aws_cloudwatch_log_group.process_csv_file_log_group,
    aws_s3_bucket.beneficiary_bucket
  ]
  handler          = "index.handler"
  source_code_hash = data.archive_file.dependents_lambda_zip.output_base64sha256
  runtime          = "nodejs16.x"
  timeout          = 360
  memory_size      = 256
  layers           = [aws_lambda_layer_version.node_modules_layer.arn]
  environment {
    variables = {
      DB_HOST = local.param.DB_HOST,
      DB_PORT = local.param.DB_PORT,
      DB_USER = local.param.DB_USER,
      DB_PASSWORD = local.param.DB_PASSWORD,
      DB_NAME = local.param.DB_NAME,
      ZIP_BUCKET_NAME = aws_s3_bucket.beneficiary_bucket.id,
      BUCKET_NAME = "${var.env}-beneficiary-bucket",
      EVENT_BUS_NAME = var.event_bus_name
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

// Lambda permission trigger
resource "aws_lambda_permission" "allow_trigger_s3_lambda" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.process_csv_file_function.function_name
  principal     = "s3.amazonaws.com"

  source_arn = aws_s3_bucket.beneficiary_bucket.arn

  depends_on = [
    aws_lambda_function.process_csv_file_function,
    aws_s3_bucket.beneficiary_bucket
  ]
}
