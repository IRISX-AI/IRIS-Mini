# Contributing to IRIS-MINI

First off, thank you for considering contributing to IRIS-MINI! It's people like you that make the AI and developer community incredible.

Whether you are fixing a bug, adding a new feature to the React UI, or optimizing the CLI, your help is welcome. However, because this project utilizes a custom dual-license structure (Apache 2.0 with a strict Non-Commercial clause), we have a few guidelines to ensure the project remains secure, stable, and legally protected.

## How Can I Contribute?

### 1. Reporting Bugs

If you find a bug, please open an Issue on GitHub. Ensure you include:

- Your operating system (Windows/Linux/Mac).
- How you are running IRIS (Compiled CLI vs. Local Dev Environment).
- Clear steps to reproduce the issue.
- Terminal logs or screenshots if the React UI crashes.
- _Note: If it is a security vulnerability, please see `SECURITY.md` and report it privately._

### 2. Suggesting Enhancements

Got an idea for a new Voice Agent tool? Want to add a new command to the CLI?

- Check the existing Issues to see if someone has already suggested it.
- Open a new Issue tagged as an `enhancement` and describe how it would work and why it benefits the ecosystem.

### 3. Pull Requests

We actively welcome Pull Requests (PRs) for bug fixes, UI improvements, and core optimizations.

**The PR Process:**

1.  Fork the repo and create your branch from `main`.
2.  If you've added code that should be tested, add tests.
3.  Ensure your code follows the existing formatting (TypeScript/ESLint).
4.  Make sure your changes do not break the CLI build process (`npm run release`).
5.  Issue the pull request with a detailed explanation of what you changed.

## Legal & Intellectual Property

By contributing to IRIS-MINI, you agree to the following:

1.  **Code Ownership:** You agree that any code you submit will be merged into the IRIS-MINI repository and licensed under the project's existing license (Apache 2.0 with the Section 0 Commercial Ban).
2.  **No Commercial Backdoors:** You will not introduce code designed to bypass the non-commercial licensing restrictions or alter the core branding/trapdoors of the IRIS architecture.
3.  **Original Work:** You confirm that your contribution is your original work and does not violate any third-party copyrights or patents.

## Setting Up for Development

To set up your local environment for contributing, refer to the **Option B: Local Development** section in the `README.md`.

You will need:

- Node.js (v24+)
- Bun (for testing the CLI builds)
- Your own Google Gemini API Key for testing agent logic.

---

_Developed and maintained by Harsh ([@irisxai](https://www.instagram.com/201harshs/))._

