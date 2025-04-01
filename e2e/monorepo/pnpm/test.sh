pnpm add -D /smartbundle --silent --workspace-root
pnpm run -r build --silent
pnpm publish -r --access public --dry-run
