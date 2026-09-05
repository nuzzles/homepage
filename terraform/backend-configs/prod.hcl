# Production retains the existing state location; changing this key would
# orphan the infrastructure already managed by Terraform.
bucket       = "imbleau-terraform-state"
key          = "terraform.tfstate"
region       = "us-east-1"
encrypt      = true
use_lockfile = true
