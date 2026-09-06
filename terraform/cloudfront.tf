locals {
  additional_sites = {
    for site, config in local.sites : site => config if site != local.primary_profile_id
  }
}

resource "aws_cloudfront_origin_access_control" "web_oac" {
  name = var.environment == "prod" ? "WebsiteAccessControl" : "WebsiteAccessControl-${var.environment}"

  description                       = "Web OAC Policy"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_cache_policy" "web" {
  name        = "homepage-${var.environment}-site"
  comment     = "Honor cache headers emitted by website deployments."
  default_ttl = 86400
  max_ttl     = 31536000
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_response_headers_policy" "web" {
  name    = "homepage-${var.environment}-security"
  comment = "Browser security headers for website deployments."

  security_headers_config {
    content_security_policy {
      content_security_policy = "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' https://fonts.gstatic.com; form-action 'self'; frame-ancestors 'none'; frame-src https://nuzzles.github.io; img-src 'self' data:; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; upgrade-insecure-requests"
      override                = true
    }
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
    strict_transport_security {
      access_control_max_age_sec = 63072000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
  }

  custom_headers_config {
    items {
      header   = "Permissions-Policy"
      value    = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()"
      override = true
    }
    dynamic "items" {
      for_each = var.environment == "prod" ? [] : [true]
      content {
        header   = "X-Robots-Tag"
        value    = "noindex, nofollow"
        override = true
      }
    }
  }
}

resource "aws_cloudfront_distribution" "web_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${upper(var.environment)} - ${title(local.primary_profile_id)} Website Distribution"
  aliases             = [local.primary_domain_name]
  default_root_object = "index.html"
  price_class         = "PriceClass_All"
  wait_for_deployment = true

  origin {
    domain_name              = aws_s3_bucket.site_bucket.bucket_regional_domain_name
    origin_path              = "/${local.sites[local.primary_profile_id].key_prefix}"
    origin_access_control_id = aws_cloudfront_origin_access_control.web_oac.id
    origin_id                = local.s3_origin_id
  }

  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD", "OPTIONS"]
    cache_policy_id            = aws_cloudfront_cache_policy.web.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.web.id
    target_origin_id           = local.s3_origin_id
    viewer_protocol_policy     = "redirect-to-https"
    compress                   = true
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.tls_cert.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

resource "aws_cloudfront_distribution" "additional" {
  for_each = local.additional_sites

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${upper(var.environment)} - ${title(each.key)} Website Distribution"
  aliases             = [each.value.domain_name]
  default_root_object = "index.html"
  price_class         = "PriceClass_All"
  wait_for_deployment = true

  origin {
    domain_name              = aws_s3_bucket.site_bucket.bucket_regional_domain_name
    origin_path              = "/${each.value.key_prefix}"
    origin_access_control_id = aws_cloudfront_origin_access_control.web_oac.id
    origin_id                = local.s3_origin_id
  }

  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD", "OPTIONS"]
    cache_policy_id            = aws_cloudfront_cache_policy.web.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.web.id
    target_origin_id           = local.s3_origin_id
    viewer_protocol_policy     = "redirect-to-https"
    compress                   = true
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn = each.key == "selector" ? (
      aws_acm_certificate_validation.selector.certificate_arn
    ) : aws_acm_certificate_validation.tls_cert.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # The existing distribution must release moved aliases before a new
  # distribution can claim them during the first multi-site deployment.
  depends_on = [aws_cloudfront_distribution.web_distribution]
}
