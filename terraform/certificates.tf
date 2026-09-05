resource "aws_acm_certificate" "tls_cert" {
  domain_name               = local.spencer_domain_name
  subject_alternative_names = [local.sara_domain_name]
  validation_method         = "DNS"

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

resource "cloudflare_record" "tls_dns_validation" {
  zone_id = local.cloudflare_zone_id
  comment = "ACM Verification for ${local.spencer_domain_name}"
  name    = local.tls_validation_options[local.spencer_domain_name].name
  value   = local.tls_validation_options[local.spencer_domain_name].value
  type    = local.tls_validation_options[local.spencer_domain_name].type
  proxied = false
}

resource "cloudflare_record" "tls_dns_validation_sara" {
  zone_id = local.cloudflare_zone_id
  comment = "ACM Verification for ${local.sara_domain_name}"
  name    = local.tls_validation_options[local.sara_domain_name].name
  value   = local.tls_validation_options[local.sara_domain_name].value
  type    = local.tls_validation_options[local.sara_domain_name].type
  proxied = false
}

resource "aws_acm_certificate_validation" "tls_cert" {
  certificate_arn = aws_acm_certificate.tls_cert.arn
  validation_record_fqdns = [
    cloudflare_record.tls_dns_validation.hostname,
    cloudflare_record.tls_dns_validation_sara.hostname,
  ]
}
