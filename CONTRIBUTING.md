# Contributing to Azure DevOps MCP with PAT Authentication

Thank you for your interest in contributing! 🎉

## 🌟 How to Contribute

### Reporting Issues

- Check if the issue already exists
- Provide clear steps to reproduce
- Include your environment (OS, Node version, Claude Desktop version)
- For PAT-specific issues, include any error messages (but **never** include your actual PAT!)

### Suggesting Features

- Open an issue describing the feature
- Explain the use case and why it would be helpful
- Be open to discussion and feedback

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly**:
   ```bash
   npm run build
   npm test
   ```
5. **Commit with clear messages**:
   ```bash
   git commit -m "Add: Brief description of your change"
   ```
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request** with a clear description

## 🔒 Security Guidelines

**NEVER commit:**
- Personal Access Tokens (PATs)
- Organization names
- Project names
- Any credentials or API keys
- Real configuration files

**ALWAYS:**
- Use placeholder values in examples (e.g., `YOUR_ORG`, `YOUR_PAT`)
- Test with dummy data when possible
- Review `git diff` before committing

## 🧪 Testing

Before submitting a PR:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Test manually with Claude Desktop
# (Use test organization and PAT)
```

## 📝 Code Style

- Follow the existing code style
- Use TypeScript where applicable
- Add comments for complex logic
- Keep functions focused and simple

## 🤝 Code of Conduct

Be respectful, inclusive, and constructive. We're all here to make this project better!

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Questions?** Open an issue and we'll help you get started!