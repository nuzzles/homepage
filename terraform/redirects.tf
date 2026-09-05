resource "cloudflare_record" "environment_redirect" {
  zone_id = local.cloudflare_zone_id
  comment = "Redirect ${local.redirect.source} to ${local.redirect.target}"
  name    = local.redirect.source
  value   = "192.0.2.1"
  type    = "A"
  proxied = true
}

resource "cloudflare_page_rule" "environment_redirect" {
  zone_id = local.cloudflare_zone_id
  target  = "${local.redirect.source}/*"
  status  = "active"

  actions {
    forwarding_url {
      url         = "https://${local.redirect.target}/$1"
      status_code = 301
    }
  }

  depends_on = [cloudflare_record.environment_redirect]
}
