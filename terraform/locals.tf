locals {
  cloudflare_zone_id = "9aad55f2e0a8d9373badd4361227cabe"
  s3_origin_id       = "WebS3Origin"

  domains = {
    dev  = "dev.spencer.imbleau.com"
    stg  = "stg.spencer.imbleau.com"
    prod = "www.spencer.imbleau.com"
  }

  domain_name = local.domains[var.environment]
  bucket_name = local.domain_name
}
