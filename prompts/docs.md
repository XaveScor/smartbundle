# SmartBundle Documentation Generation Instructions

This file contains base instructions for an LLM to generate comprehensive documentation for SmartBundle. Use these guidelines and the information from key files (README.md, package.json, docs/ts-guide.md, docs/package-json.md, and docs/issues.md).

## Guidelines
- Extract the overall project description and key features from README.md.
- Use package.json for details on package configuration (e.g. name, version, bin, exports, dependencies).
- Integrate TypeScript integration details from docs/ts-guide.md.
- Rely on docs/package-json.md to explain package.json field constraints and best practices.
- Reference docs/issues.md for known issues, FAQs, and troubleshooting tips.
- Maintain a clear, concise tone and follow SmartBundle's style.

## Documentation Structure
When generating documentation for any part of the repository, consider a modular structure that covers all relevant topics. A generic documentation structure can include, but is not limited to, the following sections:

1. **Introduction / Overview**
   - Describe the purpose and scope of the document.
   - Provide context and background information.
   - GitHub Repository: The source code for SmartBundle is available at [SmartBundle on GitHub](http://github.com/XaveScor/smartbundle) (use that URL for links if needed).

2. **Getting Started / Installation**
   - List prerequisites and setup instructions.
   - Provide installation or configuration commands (highlight CLI commands using shell backticks or fenced code blocks).

3. **Usage / How It Works**
   - Explain core functionalities and usage examples.
   - Include code snippets or examples where applicable.

4. **Configuration / Setup Details**
   - Outline configuration options, file structures, or environment settings.
   - Link directly to detailed configuration sections from related docs.

5. **Advanced Topics / Features**
   - Cover advanced features, edge cases, or integrations with tools.
   - Detail any optional enhancements and how to apply them.

6. **Troubleshooting / FAQ**
   - List common issues, error messages, and solutions.
   - Link to related issues or discussion threads as needed.

7. **Contributing / Additional Resources**
   - Provide guidelines for contributors.
   - List references to related documentation, best practices, or further reading materials.

## Additional Instructions
- When incorporating content from the key files, ensure technical accuracy and consistency.
- Tailor the documentation to be understandable for both new users and experienced contributors.
- Keep sections modular so that individual parts can be updated independently.
- Ensure effective crosslinking between documentation files. When possible, create the most specific links by linking directly to the relevant section (for example, linking directly to the 'Bin Field' section in docs/package-json.md rather than just the file) to enhance navigation and context.
- Maximize the usage of GitHub Markdown formatting to improve readability and structure. Follow the guidelines provided at: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
- Place links as close as possible to or within the relevant content. For example, if a documentation section mentions the .tsx extension in the context of React, insert an information alert immediately after that paragraph (e.g. 'Note: you need to configure the TS integration to add .tsx support') so that users get context-sensitive guidance.
- Ensure that all CLI commands, such as package installation or build commands, are highlighted using shell backticks for inline commands or fenced code blocks with appropriate syntax (e.g. ```bash ... ```). This makes command examples stand out and easily copyable.
- Don't use 'Note:' or similar prefixes. Always use GitHub Markdown alerts for context-sensitive guidance.
- Do not create a "Community and Support" section anywhere except in the main README.md file.

## GitHub Alerts Markdown

> [!NOTE]  
> Useful information that users should know, even when skimming content.

> [!TIP]  
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]  
> Key information users need to know to achieve their goal.

> [!WARNING]  
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]  
> Advises about risks or negative outcomes of certain actions.
