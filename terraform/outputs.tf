output "bucket_names" {
  description = "Private S3 bucket for each independently deployed site."
  value       = { for site, bucket in aws_s3_bucket.site_bucket : site => bucket.bucket }
}

output "cloudfront_distribution_ids" {
  description = "CloudFront distribution ID for each independently deployed site."
  value = merge(
    { (local.primary_profile_id) = aws_cloudfront_distribution.web_distribution.id },
    { for site, distribution in aws_cloudfront_distribution.additional : site => distribution.id }
  )
}

output "website_urls" {
  description = "Canonical site URLs for this environment."
  value       = { for site, config in local.sites : site => "https://${config.domain_name}" }
}

output "website_url" {
  description = "Profile selector URL for this environment."
  value       = "https://${local.selector_domain_name}"
}
