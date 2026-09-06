resource "aws_acm_certificate" "tls_cert" {
  domain_name = local.primary_domain_name
  subject_alternative_names = [
    for profile, config in local.profile_sites : config.domain_name if profile != local.primary_profile_id
  ]
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

locals {
  tls_validation_options = {
    for option in aws_acm_certificate.tls_cert.domain_validation_options : option.domain_name => {
      name  = trimsuffix(option.resource_record_name, ".")
      type  = option.resource_record_type
      value = trimsuffix(option.resource_record_value, ".")
    }
  }
}

resource "cloudflare_record" "profile_tls_dns_validation" {
  for_each = local.profile_sites

  zone_id = local.cloudflare_zone_id
  comment = "ACM Verification for ${each.value.domain_name}"
  name    = local.tls_validation_options[each.value.domain_name].name
  value   = local.tls_validation_options[each.value.domain_name].value
  type    = local.tls_validation_options[each.value.domain_name].type
  proxied = false
}

resource "aws_acm_certificate_validation" "tls_cert" {
  certificate_arn         = aws_acm_certificate.tls_cert.arn
  validation_record_fqdns = [for record in cloudflare_record.profile_tls_dns_validation : record.hostname]
}

resource "aws_acm_certificate" "selector" {
  domain_name       = local.selector_domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

locals {
  selector_tls_validation = one(aws_acm_certificate.selector.domain_validation_options)
}

resource "cloudflare_record" "selector_tls_dns_validation" {
  zone_id = local.cloudflare_zone_id
  comment = "ACM Verification for ${local.selector_domain_name}"
  name    = trimsuffix(local.selector_tls_validation.resource_record_name, ".")
  value   = trimsuffix(local.selector_tls_validation.resource_record_value, ".")
  type    = local.selector_tls_validation.resource_record_type
  proxied = false
}

resource "aws_acm_certificate_validation" "selector" {
  certificate_arn         = aws_acm_certificate.selector.arn
  validation_record_fqdns = [cloudflare_record.selector_tls_dns_validation.hostname]
}
