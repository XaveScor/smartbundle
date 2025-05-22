node

pnpm add -D /smartbundle --silent --workspace-root
pnpm run -r smartbundle:monorepo-init --silent
pnpm install --silent
pnpm run -r build --silent
pnpm publish -r --access public --dry-run
# TODO: Create tests later
