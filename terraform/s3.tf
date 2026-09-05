resource "aws_s3_bucket" "site_bucket" {
  for_each = local.sites

  bucket        = each.value.bucket_name
  force_destroy = false
}

resource "aws_s3_bucket_ownership_controls" "site_bucket" {
  for_each = local.sites

  bucket = aws_s3_bucket.site_bucket[each.key].id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "site_bucket" {
  for_each = local.sites

  bucket                  = aws_s3_bucket.site_bucket[each.key].id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "site_bucket" {
  for_each = local.sites

  bucket = aws_s3_bucket.site_bucket[each.key].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "site_bucket" {
  for_each = local.sites

  bucket = aws_s3_bucket.site_bucket[each.key].id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "site_bucket" {
  for_each = local.sites

  bucket = aws_s3_bucket.site_bucket[each.key].id

  rule {
    id     = "expire-noncurrent-content"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 30
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

data "aws_iam_policy_document" "view_objects_policy" {
  for_each = local.sites

  statement {
    sid = "AllowCloudFrontServiceReadOnly"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site_bucket[each.key].arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values = [
        each.key == local.primary_profile_id ? aws_cloudfront_distribution.web_distribution.arn : aws_cloudfront_distribution.additional[each.key].arn
      ]
    }
  }

  statement {
    sid    = "DenyInsecureTransport"
    effect = "Deny"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = ["s3:*"]
    resources = [
      aws_s3_bucket.site_bucket[each.key].arn,
      "${aws_s3_bucket.site_bucket[each.key].arn}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "site_access_policy" {
  for_each = local.sites

  bucket = aws_s3_bucket.site_bucket[each.key].id
  policy = data.aws_iam_policy_document.view_objects_policy[each.key].json
}
