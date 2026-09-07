locals {
  additional_sites = {
    for site, config in local.sites : site => config if site != local.primary_profile_id
  }
  blog_sites = {
    for site, config in local.profile_sites : site => config if config.blog_base_path != null
  }
  spa_route_patterns = ["/resume*", "/en*", "/fr*", "/fa*"]
}

resource "aws_cloudfront_function" "blog_router" {
  for_each = local.blog_sites

  name    = "homepage-${var.environment}-${each.key}-blog-router"
  runtime = "cloudfront-js-1.0"
  comment = "Resolve ${each.value.blog_base_path} directory URLs for the ${each.key} blog."
  publish = true
  code = templatefile("${path.module}/functions/blog-router.js", {
    blog_base_path = jsonencode(each.value.blog_base_path)
  })
}

resource "aws_cloudfront_function" "spa_router" {
  name    = "homepage-${var.environment}-spa-router"
  runtime = "cloudfront-js-1.0"
  comment = "Resolve direct requests for client-side website routes."
  publish = true
  code    = file("${path.module}/functions/spa-router.js")
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
      content_security_policy = "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; frame-src https://nuzzles.github.io https://www.youtube.com; img-src 'self' data:; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests"
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

  dynamic "ordered_cache_behavior" {
    for_each = local.sites[local.primary_profile_id].blog_base_path == null ? [] : [local.sites[local.primary_profile_id].blog_base_path]
    content {
      path_pattern               = "${ordered_cache_behavior.value}*"
      allowed_methods            = ["GET", "HEAD", "OPTIONS"]
      cached_methods             = ["GET", "HEAD", "OPTIONS"]
      cache_policy_id            = aws_cloudfront_cache_policy.web.id
      response_headers_policy_id = aws_cloudfront_response_headers_policy.web.id
      target_origin_id           = local.s3_origin_id
      viewer_protocol_policy     = "redirect-to-https"
      compress                   = true

      function_association {
        event_type   = "viewer-request"
        function_arn = aws_cloudfront_function.blog_router[local.primary_profile_id].arn
      }
    }
  }

  dynamic "ordered_cache_behavior" {
    for_each = local.spa_route_patterns
    content {
      path_pattern               = ordered_cache_behavior.value
      allowed_methods            = ["GET", "HEAD", "OPTIONS"]
      cached_methods             = ["GET", "HEAD", "OPTIONS"]
      cache_policy_id            = aws_cloudfront_cache_policy.web.id
      response_headers_policy_id = aws_cloudfront_response_headers_policy.web.id
      target_origin_id           = local.s3_origin_id
      viewer_protocol_policy     = "redirect-to-https"
      compress                   = true

      function_association {
        event_type   = "viewer-request"
        function_arn = aws_cloudfront_function.spa_router.arn
      }
    }
  }

  custom_error_response {
    error_code            = 403
    response_code         = local.sites[local.primary_profile_id].blog_base_path == null ? 200 : 404
    response_page_path    = local.sites[local.primary_profile_id].blog_base_path == null ? "/index.html" : "${local.sites[local.primary_profile_id].blog_base_path}/404.html"
    error_caching_min_ttl = 0
  }
  custom_error_response {
    error_code            = 404
    response_code         = local.sites[local.primary_profile_id].blog_base_path == null ? 200 : 404
    response_page_path    = local.sites[local.primary_profile_id].blog_base_path == null ? "/index.html" : "${local.sites[local.primary_profile_id].blog_base_path}/404.html"
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

  dynamic "ordered_cache_behavior" {
    for_each = each.value.blog_base_path == null ? [] : [each.value.blog_base_path]
    content {
      path_pattern               = "${ordered_cache_behavior.value}*"
      allowed_methods            = ["GET", "HEAD", "OPTIONS"]
      cached_methods             = ["GET", "HEAD", "OPTIONS"]
      cache_policy_id            = aws_cloudfront_cache_policy.web.id
      response_headers_policy_id = aws_cloudfront_response_headers_policy.web.id
      target_origin_id           = local.s3_origin_id
      viewer_protocol_policy     = "redirect-to-https"
      compress                   = true

      function_association {
        event_type   = "viewer-request"
        function_arn = aws_cloudfront_function.blog_router[each.key].arn
      }
    }
  }

  dynamic "ordered_cache_behavior" {
    for_each = local.spa_route_patterns
    content {
      path_pattern               = ordered_cache_behavior.value
      allowed_methods            = ["GET", "HEAD", "OPTIONS"]
      cached_methods             = ["GET", "HEAD", "OPTIONS"]
      cache_policy_id            = aws_cloudfront_cache_policy.web.id
      response_headers_policy_id = aws_cloudfront_response_headers_policy.web.id
      target_origin_id           = local.s3_origin_id
      viewer_protocol_policy     = "redirect-to-https"
      compress                   = true

      function_association {
        event_type   = "viewer-request"
        function_arn = aws_cloudfront_function.spa_router.arn
      }
    }
  }

  custom_error_response {
    error_code            = 403
    response_code         = each.value.blog_base_path == null ? 200 : 404
    response_page_path    = each.value.blog_base_path == null ? "/index.html" : "${each.value.blog_base_path}/404.html"
    error_caching_min_ttl = 0
  }
  custom_error_response {
    error_code            = 404
    response_code         = each.value.blog_base_path == null ? 200 : 404
    response_page_path    = each.value.blog_base_path == null ? "/index.html" : "${each.value.blog_base_path}/404.html"
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
