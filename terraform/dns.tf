# These redirect records are global production DNS. Count is used so the dev
# and staging states cannot take ownership of them.
resource "cloudflare_record" "web_distribution_naked" {
  count = var.environment == "prod" ? 1 : 0

  zone_id = local.cloudflare_zone_id
  name    = "imbleau.com"
  value   = "192.0.2.1"
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "web_distribution_www" {
  count = var.environment == "prod" ? 1 : 0

  zone_id = local.cloudflare_zone_id
  name    = "www.imbleau.com"
  value   = "192.0.2.1"
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "web_distribution_naked_spencer" {
  count = var.environment == "prod" ? 1 : 0

  zone_id = local.cloudflare_zone_id
  name    = "spencer.imbleau.com"
  value   = "192.0.2.1"
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "web_distribution_cn" {
  zone_id = local.cloudflare_zone_id
  name    = local.domain_name
  value   = aws_cloudfront_distribution.web_distribution.domain_name
  type    = "CNAME"
  proxied = false
}

# Preserve the three production DNS resource addresses while making them
# production-only for the new multi-environment configuration.
moved {
  from = cloudflare_record.web_distribution_naked
  to   = cloudflare_record.web_distribution_naked[0]
}

moved {
  from = cloudflare_record.web_distribution_www
  to   = cloudflare_record.web_distribution_www[0]
}

moved {
  from = cloudflare_record.web_distribution_naked_spencer
  to   = cloudflare_record.web_distribution_naked_spencer[0]
}
