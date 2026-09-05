
resource "cloudflare_record" "profiles" {
  for_each = local.profile_sites

  zone_id = local.cloudflare_zone_id
  name    = each.value.domain_name
  value = each.key == local.primary_profile_id ? (
    aws_cloudfront_distribution.web_distribution.domain_name
  ) : aws_cloudfront_distribution.additional[each.key].domain_name
  type    = "CNAME"
  proxied = var.environment != "prod"
}

resource "cloudflare_record" "selector" {
  zone_id = local.cloudflare_zone_id
  comment = "Profile selector for ${var.environment}"
  name    = local.selector_domain_name
  value   = aws_cloudfront_distribution.additional["selector"].domain_name
  type    = "CNAME"
  proxied = var.environment != "prod"
}
