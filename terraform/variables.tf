variable "aws_region" {
  type        = string
  description = "AWS region for the S3 origin and CloudFront certificate."

  validation {
    condition     = var.aws_region == "us-east-1"
    error_message = "CloudFront viewer certificates must be created in us-east-1."
  }
}

variable "environment" {
  type        = string
  description = "Deployment environment: dev, stg, or prod."

  validation {
    condition     = contains(["dev", "stg", "prod"], var.environment)
    error_message = "environment must be one of dev, stg, or prod."
  }
}
