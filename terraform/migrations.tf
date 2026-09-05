moved {
  from = aws_cloudfront_origin_access_control.web_oac
  to   = aws_cloudfront_origin_access_control.web_oac["spencer"]
}

moved {
  from = aws_cloudfront_cache_policy.web
  to   = aws_cloudfront_cache_policy.web["spencer"]
}

moved {
  from = aws_cloudfront_response_headers_policy.web
  to   = aws_cloudfront_response_headers_policy.web["spencer"]
}

removed {
  from = aws_s3_bucket.web_bucket

  lifecycle {
    destroy = false
  }
}

removed {
  from = aws_s3_bucket_ownership_controls.web_bucket

  lifecycle {
    destroy = false
  }
}

removed {
  from = aws_s3_bucket_public_access_block.web_bucket

  lifecycle {
    destroy = false
  }
}

removed {
  from = aws_s3_bucket_server_side_encryption_configuration.web_bucket

  lifecycle {
    destroy = false
  }
}

removed {
  from = aws_s3_bucket_versioning.web_bucket

  lifecycle {
    destroy = false
  }
}

removed {
  from = aws_s3_bucket_lifecycle_configuration.web_bucket

  lifecycle {
    destroy = false
  }
}

removed {
  from = aws_s3_bucket_policy.web_access_policy

  lifecycle {
    destroy = false
  }
}

moved {
  from = cloudflare_record.environment_redirect
  to   = cloudflare_record.selector
}

moved {
  from = cloudflare_record.web_distribution_naked_spencer
  to   = cloudflare_record.profiles["spencer"]
}

moved {
  from = cloudflare_record.web_distribution_naked_sara
  to   = cloudflare_record.profiles["sara"]
}

moved {
  from = cloudflare_record.tls_dns_validation
  to   = cloudflare_record.profile_tls_dns_validation["spencer"]
}

moved {
  from = cloudflare_record.tls_dns_validation_sara
  to   = cloudflare_record.profile_tls_dns_validation["sara"]
}
