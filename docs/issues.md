# @babel/core is installed by SmartBundle
The SmartBundle versions under v0.11.1 have the @babel/core dep in its optionalDependencies. Pnpm and other package managers can install it because it is acceptable behaviour.

pnpm issue: https://github.com/pnpm/pnpm/issues/5928

Please, update up to any version above v0.11.1 and reinstall the SmartBundle package. It should remove the @babel/core from your project.
