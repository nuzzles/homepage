# Website deployment infrastructure

The website is served from a private S3 origin through CloudFront. Cloudflare
provides authoritative DNS and ACM certificates are validated with Cloudflare
DNS records. Each deployment environment has isolated Terraform state and
infrastructure.

| Environment | Variables                  | State key               | URL                               |
| ----------- | -------------------------- | ----------------------- | --------------------------------- |
| `dev`       | `environments/dev.tfvars`  | `homepage-tfstate-dev`  | `https://dev.spencer.imbleau.com` |
| `stg`       | `environments/stg.tfvars`  | `homepage-tfstate-stg`  | `https://stg.spencer.imbleau.com` |
| `prod`      | `environments/prod.tfvars` | `homepage-tfstate-prod` | `https://spencer.imbleau.com`     |

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
