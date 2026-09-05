resource "cloudflare_record" "www_redirect" {
  count = var.environment == "prod" ? 1 : 0

  zone_id = local.cloudflare_zone_id
  comment = "Redirect www.imbleau.com to imbleau.com"
  name    = "www.imbleau.com"
  value   = "192.0.2.1"
  type    = "A"
  proxied = true

  depends_on = [cloudflare_record.selector]
}

resource "cloudflare_page_rule" "www_redirect" {
  count = var.environment == "prod" ? 1 : 0

  zone_id = local.cloudflare_zone_id
  target  = "www.imbleau.com/*"
  status  = "active"

  actions {
    forwarding_url {
      url         = "https://imbleau.com/$1"
      status_code = 301
    }
  }

  depends_on = [cloudflare_record.www_redirect]
}
