locals {
  cloudflare_zone_id = "9aad55f2e0a8d9373badd4361227cabe"
  s3_origin_id       = "WebS3Origin"
  profile_config     = jsondecode(file("${path.module}/../profiles.json"))
  primary_profile_id = one([
    for profile, config in local.profile_config : profile if try(config.primaryInfrastructure, false)
  ])

  selector_domains = {
    dev  = "dev.imbleau.com"
    stg  = "stg.imbleau.com"
    prod = "imbleau.com"
  }
  domains = {
    for environment in ["dev", "stg", "prod"] : environment => merge(
      { selector = local.selector_domains[environment] },
      { for profile, config in local.profile_config : profile => config.hostnames[environment] }
    )
  }

  selector_domain_name = local.domains[var.environment].selector
  primary_domain_name  = local.domains[var.environment][local.primary_profile_id]
  bucket_name          = "homepage-${data.aws_caller_identity.current.account_id}-${var.environment}"
  profile_sites = {
    for profile, config in local.profile_config : profile => {
      domain_name    = config.hostnames[var.environment]
      key_prefix     = profile
      blog_base_path = try(config.blog.basePath, null)
    }
  }
  sites = merge(
    {
      selector = {
        domain_name    = local.selector_domain_name
        key_prefix     = "selector"
        blog_base_path = null
      }
    },
    local.profile_sites
  )
}
