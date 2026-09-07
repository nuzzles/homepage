# Profile blogs

Jekyll blog sources live in a directory named for their profile. A profile opts into a blog with the
`blog` entry in `profiles.json`; profiles without a blog use `null`.

All profile blogs share this directory's `Gemfile` and `Gemfile.lock`. Install the Ruby dependencies
once from this directory:

```sh
BUNDLE_PATH=vendor/bundle bundle install
```

The normal workspace commands build and serve the configured blogs. `pnpm dev` serves the complete
local site with profile-specific paths such as <http://localhost:5173/spencer/blog/> and
<http://localhost:5173/sara/blog/>. Set `HOMEPAGE_SITE` to preview a specific deployed profile at
<http://localhost:5173/blog/>.
