output "bucket_name" {
  description = "Private S3 bucket receiving the built website."
  value       = aws_s3_bucket.web_bucket.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution to invalidate after publishing."
  value       = aws_cloudfront_distribution.web_distribution.id
}

output "website_url" {
  description = "Canonical Spencer URL for this environment."
  value       = "https://${local.spencer_domain_name}"
}

output "sara_website_url" {
  description = "Canonical Sara URL for this environment."
  value       = "https://${local.sara_domain_name}"
}
