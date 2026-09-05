locals {
  cloudflare_zone_id = "9aad55f2e0a8d9373badd4361227cabe"
  s3_origin_id       = "WebS3Origin"

  domains = {
    dev = {
      spencer = "spencer-dev.imbleau.com"
      sara    = "sara-dev.imbleau.com"
    }
    stg = {
      spencer = "spencer-stg.imbleau.com"
      sara    = "sara-stg.imbleau.com"
    }
    prod = {
      spencer = "spencer.imbleau.com"
      sara    = "sara.imbleau.com"
    }
  }

  redirects = {
    dev = {
      source = "dev.imbleau.com"
      target = local.domains.dev.spencer
    }
    stg = {
      source = "stg.imbleau.com"
      target = local.domains.stg.spencer
    }
    prod = {
      source = "www.imbleau.com"
      target = "imbleau.com"
    }
  }

  # Keep the existing production bucket name. It is an internal origin name,
  # not the website's canonical URL, and changing it would replace the bucket.
  bucket_names = {
    dev  = "dev.spencer.imbleau.com"
    stg  = "stg.spencer.imbleau.com"
    prod = "www.spencer.imbleau.com"
  }

  spencer_domain_name = local.domains[var.environment].spencer
  sara_domain_name    = local.domains[var.environment].sara
  domain_names        = [local.spencer_domain_name, local.sara_domain_name]
  redirect            = local.redirects[var.environment]

  # Spencer remains the primary environment URL for deployment status links.
  domain_name = local.spencer_domain_name
  bucket_name = local.bucket_names[var.environment]
}
