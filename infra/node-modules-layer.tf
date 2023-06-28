data "archive_file" "node_modules_layer_zip" {
  type        = "zip"
  source_dir  = "../build/node-module-layer"
  output_path = "../build/node-module-layer.zip"
}

resource "aws_lambda_layer_version" "node_modules_layer" {
  filename   = "../build/node-module-layer.zip"
  layer_name = "beneficiaries-domain-node-modules-layer"
  compatible_runtimes = ["nodejs16.x"]
  source_code_hash = data.archive_file.node_modules_layer_zip.output_base64sha256
}