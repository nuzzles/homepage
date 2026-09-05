# Website deployment infrastructure

The website is served from a private S3 origin through CloudFront. Cloudflare
provides authoritative DNS and ACM certificates are validated with Cloudflare
DNS records. Each deployment environment has isolated Terraform state and
infrastructure. The selector, Spencer, and Sara sites each have an independent
S3 bucket and CloudFront distribution.

Profile hostnames and the primary infrastructure profile come from the shared
[`profiles.json`](../profiles.json) registry.

Buckets are account-scoped and named `homepage-<root|profile-id>-<account-id>-<environment>`.
The former shared bucket is retained during migration but removed from Terraform
state so its versioned contents are not destroyed automatically.

| Environment | Variables                  | State key               | Selector URL              | Spencer URL                       | Sara URL                       |
| ----------- | -------------------------- | ----------------------- | ------------------------- | --------------------------------- | ------------------------------ |
| `dev`       | `environments/dev.tfvars`  | `homepage-tfstate-dev`  | `https://dev.imbleau.com` | `https://spencer-dev.imbleau.com` | `https://sara-dev.imbleau.com` |
| `stg`       | `environments/stg.tfvars`  | `homepage-tfstate-stg`  | `https://stg.imbleau.com` | `https://spencer-stg.imbleau.com` | `https://sara-stg.imbleau.com` |
| `prod`      | `environments/prod.tfvars` | `homepage-tfstate-prod` | `https://imbleau.com`     | `https://spencer.imbleau.com`     | `https://sara.imbleau.com`     |

The dev and staging website records are proxied through Cloudflare so Access
policies can protect them. Production website records remain DNS-only.

## Redirects

| Environment | Source                    | Destination           |
| ----------- | ------------------------- | --------------------- |
| `prod`      | `https://www.imbleau.com` | `https://imbleau.com` |

All three keys live in the existing `imbleau-terraform-state` bucket. The
production state was migrated from its original `terraform.tfstate` key.

## GitHub configuration

Create GitHub Environments named `dev`, `stg`, and `prod`. Require reviewers
for `stg` and `prod`; `dev` deploys automatically after `main` CI succeeds.
The existing repository secrets can be used by every environment, or the
following secrets can be scoped independently to each environment:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `CLOUDFLARE_API_TOKEN`

The Cloudflare token needs `DNS: Edit` and `Page Rules: Edit` permissions for
the `imbleau.com` zone.

Every successful `main` CI run deploys the exact tested commit to `dev`. The
**Promote Website** workflow deploys the current `main` commit to `stg` or
`prod`, with GitHub Environment protection acting as the approval gate.

## Local validation

```sh
terraform -chdir=terraform init -backend=false -lockfile=readonly
terraform -chdir=terraform fmt -check -recursive
terraform -chdir=terraform validate
```

To plan an environment with your configured AWS and Cloudflare credentials:

```sh
terraform -chdir=terraform init -reconfigure \
  -backend-config=backend-configs/dev.hcl
terraform -chdir=terraform plan -var-file=environments/dev.tfvars
```
