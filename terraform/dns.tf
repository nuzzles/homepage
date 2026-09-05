
resource "cloudflare_record" "web_distribution_naked_spencer" {
  zone_id = local.cloudflare_zone_id
  name    = local.domain_name
  value   = aws_cloudfront_distribution.web_distribution.domain_name
  type    = "CNAME"
  proxied = false
}
