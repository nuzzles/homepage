# Root Terraform configuration. Backend values are supplied by
# backend-configs/<environment>.hcl during initialization.

terraform {
  required_version = "~> 1.15.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
}

provider "cloudflare" {}

data "aws_caller_identity" "current" {}
