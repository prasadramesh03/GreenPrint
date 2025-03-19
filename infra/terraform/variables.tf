# infra/terraform/variables.tf
variable "aws_region" {
  description = "AWS region to deploy resources"
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name"
  default     = "development"
}