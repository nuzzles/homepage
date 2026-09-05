output "bucket_name" {
  description = "Private S3 bucket receiving the built website."
  value       = aws_s3_bucket.web_bucket.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution to invalidate after publishing."
  value       = aws_cloudfront_distribution.web_distribution.id
}

output "website_url" {
  description = "Canonical public URL for this environment."
  value       = "https://${local.domain_name}"
}
