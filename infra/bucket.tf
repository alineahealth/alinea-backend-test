resource "aws_s3_bucket" "beneficiary_bucket" {
  bucket = "${var.env}-beneficiary-bucket"
}

// Bucket notification trigger
resource "aws_s3_bucket_notification" "process_csv_file_bucket_notification" {
  bucket = aws_s3_bucket.beneficiary_bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.process_csv_file_function.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".csv"
  }

  depends_on = [
    aws_lambda_permission.allow_trigger_s3_lambda,
    aws_s3_bucket.beneficiary_bucket
  ]
}

resource "aws_iam_role_policy_attachment" "lambda_s3_access" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
  role       = aws_iam_role.beneficiaries_iam_lambda_role.name
}