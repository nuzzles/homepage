locals {
  cloudflare_zone_id = "9aad55f2e0a8d9373badd4361227cabe"
  s3_origin_id       = "WebS3Origin"

  domains = {
    dev  = "dev.spencer.imbleau.com"
    stg  = "stg.spencer.imbleau.com"
    prod = "spencer.imbleau.com"
  }

  # Keep the existing production bucket name. It is an internal origin name,
  # not the website's canonical URL, and changing it would replace the bucket.
  bucket_names = {
    dev  = "dev.spencer.imbleau.com"
    stg  = "stg.spencer.imbleau.com"
    prod = "www.spencer.imbleau.com"
  }

  domain_name = local.domains[var.environment]
  bucket_name = local.bucket_names[var.environment]
}
