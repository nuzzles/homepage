mock_provider "aws" {}
mock_provider "cloudflare" {}

variables {
  aws_region  = "us-east-1"
  environment = "dev"
}

run "resume_requests_are_allowed" {
  command = plan

  plan_options {
    target = [aws_cloudfront_response_headers_policy.web]
  }

  assert {
    condition = toset(split(" ", regex(
      "connect-src ([^;]+)",
      aws_cloudfront_response_headers_policy.web.security_headers_config[0].content_security_policy[0].content_security_policy
      )[0])) == toset(concat(["'self'"], [
      for profile in values(jsondecode(file("../profiles.json"))) : profile.resume.pdfUrl
      if profile.resume != null
    ]))
    error_message = "The deployed CSP must allow same-origin fetches and exactly the configured resume PDFs."
  }
}
