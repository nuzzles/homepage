output "deployment_targets" {
  description = "Deployment details consumed directly by the website matrix."
  value = {
    for site, config in local.sites : site => {
      bucket_name = aws_s3_bucket.site_bucket[site].bucket
      distribution_id = site == local.primary_profile_id ? (
        aws_cloudfront_distribution.web_distribution.id
      ) : aws_cloudfront_distribution.additional[site].id
      distribution_domain_name = site == local.primary_profile_id ? (
        aws_cloudfront_distribution.web_distribution.domain_name
      ) : aws_cloudfront_distribution.additional[site].domain_name
      website_url = "https://${config.domain_name}"
    }
  }
}

output "website_url" {
  description = "Profile selector URL for this environment."
  value       = "https://${local.selector_domain_name}"
}
