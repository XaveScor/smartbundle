# @babel/core is installed by SmartBundle
The SmartBundle versions under v0.11.1 have the @babel/core dep in its optionalDependencies. Pnpm and other package managers can install it because it is acceptable behaviour.

pnpm issue: https://github.com/pnpm/pnpm/issues/5928

Please, update up to any version above v0.11.1 and reinstall the SmartBundle package. It should remove the @babel/core from your project.

For more information about package configuration, see our [Package.json Configuration Guide](./package-json.md).
For monorepo-specific issues, see our [Monorepo Support Guide](./monorepo.md).

### Community and Support
If you need assistance or wish to contribute, please check out our [discussion forum](https://github.com/your-org/smartbundle/discussions) and [issue tracker](https://github.com/your-org/smartbundle/issues).
