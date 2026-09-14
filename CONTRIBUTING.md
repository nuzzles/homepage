# Contributing to Homepage

This guide defines the branch, pull request, and validation conventions for the website. See
[README.md](README.md) for setup, development commands, and profile builds.

## Keep one coherent scope

Each PR should address one feature, bug, post, or maintenance task. Describe the intended outcome
and keep unrelated cleanup, refactors, and dependency updates in separate PRs. Include supporting
changes only when they are needed for that outcome, and explain non-obvious dependencies in the
PR description.

## Branches

Start from the latest `main` and use this format:

```text
simbleau/description
```

Descriptions must be short, descriptive, and lowercase kebab-case. Examples:

- `simbleau/halo-theater-blog`
- `simbleau/fix-profile-navigation`
- `simbleau/pr-title-lint`

Ticket IDs and `NO-TICKET` placeholders are not required. Work on a branch and open a PR against
`main`; commit directly to `main` only when explicitly requested by the repository owner.

## Pull request titles

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
type: lowercase description
type(scope): lowercase description
```

The scope is optional and describes the affected area, such as `blog`, `profiles`, or `ci`.
Allowed types are `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
`chore`, and `revert`. Keep the entire title within 100 characters, start the description with
lowercase text, and omit a trailing period.

Examples:

```text
feat: add profile language selection
fix(profiles): preserve the selected language
docs(blog): publish halo theater reverse-engineering post
ci: lint pull request titles
```

[The PR title workflow](.github/workflows/pr-title-lint.yml) enforces the Conventional Commits
rules when a PR targeting `main` is opened, edited, updated, or reopened. Branch naming is a
contributor convention. Use squash merge so the PR title becomes the commit message on `main`.

## Implementation and validation

Follow existing patterns, keep dependencies minimal, and update documentation when behavior or
commands change. Test observable behavior and regressions; document reproducible manual checks
when automation is impractical. Never commit secrets or unrelated generated output.

Run focused checks during development and `pnpm check` before a PR is ready for review. For blog
or profile changes, also build each affected profile, for example:

```sh
HOMEPAGE_SITE=spencer pnpm build
```

For Terraform changes, run the same formatting and validation checks as CI:

```sh
terraform -chdir=terraform fmt -check -recursive
terraform -chdir=terraform init -backend=false -input=false -lockfile=readonly
terraform -chdir=terraform validate
```

The PR description should explain the resulting behavior, important decisions, exact validation
commands and manual scenarios, and any known limitations or follow-up work. Before merging,
confirm that the required GitHub checks have passed on the current head commit.
