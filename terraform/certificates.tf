resource "aws_acm_certificate" "tls_cert" {
  domain_name       = local.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "cloudflare_record" "tls_dns_validation" {
  zone_id = local.cloudflare_zone_id
  comment = "ACM Verification for ${aws_acm_certificate.tls_cert.domain_name}"
  name    = trimsuffix(tolist(aws_acm_certificate.tls_cert.domain_validation_options)[0].resource_record_name, ".")
  value   = trimsuffix(tolist(aws_acm_certificate.tls_cert.domain_validation_options)[0].resource_record_value, ".")
  type    = tolist(aws_acm_certificate.tls_cert.domain_validation_options)[0].resource_record_type
  proxied = false
}

resource "aws_acm_certificate_validation" "tls_cert" {
  certificate_arn         = aws_acm_certificate.tls_cert.arn
  validation_record_fqdns = [cloudflare_record.tls_dns_validation.hostname]
}
