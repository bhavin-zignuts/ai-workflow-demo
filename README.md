# AI Workflow & Agent Skills Hub

A premium orchestration workspace and dashboard for custom AI developer agent skills. This project provides a structured development lifecycle with human-in-the-loop validation gates, built to integrate with modern agentic environments like **Antigravity IDE**, **Claude Code (CLI)**, and **GitHub Copilot**.

---

## 🚀 Overview

The **AI Workflow & Agent Skills Hub** is designed to shift AI-assisted coding from ad-hoc prompting to a systematic engineering pipeline. It organizes agent instructions into modular, discrete **Skills** and coordinates them via a central **Master Orchestrator**. 

This repository includes:
* **The Dashboard UI**: A premium Next.js frontend built with Tailwind CSS v4, displaying the interactive orchestrator lifecycle, active agent skill manifests, and universal setup configurations.
* **Modular Agent Skills (`.agents/skills/`)**: Specialized behavioral manuals that direct agents on how to execute specific engineering steps (e.g., requirements capture, code exploration, technical design, implementation, and differential audits).
* **Multi-Agent Configurations**: Shared guidelines (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`) mapping the custom skill sets directly to individual assistant runtimes.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (supporting custom React Server/Client component routing)
* **Runtime & Package Manager**: [Bun 1.3+](https://bun.sh/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **UI Customizations**: Premium dark mode aesthetics, glassmorphic card grids, dynamic radial backdrops, and bespoke typography utilizing Geist Sans & Mono.

---

## 📐 Project Architecture

### 1. Modular Agent Skills
The core intelligence of the workspace is partitioned into specialized skills located in the [.agents/skills/](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/) directory. Each skill contains a `SKILL.md` specifying step rules, input/output schemas, and testing requirements:

* [intake](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/intake/SKILL.md): Requirements capture and scope sizing (resolving raw tickets into clear deliverables).
* [research](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/research/SKILL.md): Codebase mapping and architectural conventions analysis.
* [plan](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/plan/SKILL.md): Design synthesis, generating detailed implementation blueprints.
* [implement](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/implement/SKILL.md): Incremental code synthesis and localized validation.
* [review](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/review/SKILL.md): Git diff auditor ensuring style conformity and logic correctness.
* [debug](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/debug/SKILL.md): Root cause analyst tracing runtime errors and compiling test cases.
* [design-system](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/design-system/SKILL.md): Color tokens, typography tracking values, and UI layout rules.
* [react-development](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/react-development/SKILL.md): Component conventions, React Hook Form + Zod, and React Query patterns.

### 2. The Master Orchestrator
The central [feature](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/feature/SKILL.md) skill implements the core pipeline runtime:
1. **Intake** ➔ 2. **Research** ➔ 3. **Plan** ➔ **[Gate 1: User Approval]** ➔ 4. **Implement** ➔ **[Gate 2: User Validation]** ➔ 5. **Review** ➔ 6. **Report**

- **Gate 1 (Plan Approval)**: The agent halts and writes a proposal to `implementation_plan.md`, resuming only upon explicit human sign-off.
- **Gate 2 (Execution Review)**: The agent records a demo and lists changes in `walkthrough.md`, allowing the developer to run tests and request revisions before finishing.

---

## ⚙️ Multi-Agent Setup & Configuration

This workspace is compatible with multiple AI assistant environments, sharing identical rule boundaries:

### 1. Antigravity IDE (Gemini)
* Discovers skill definitions inside `.agents/` automatically.
* Loads workspace-specific instructions and boundaries from [AGENTS.md](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/AGENTS.md).

### 2. Claude Code (CLI)
* Consumes workspace rules from [CLAUDE.md](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/CLAUDE.md).
* To share skills with Claude, create a symbolic link:
  ```bash
  ln -s ../.agents/skills .claude/skills
  ```

### 3. GitHub Copilot
* Pulls prompt structures from `.github/copilot-instructions.md`.
* To link skills, create a symbolic link:
  ```bash
  ln -s ../.agents/skills .github/skills
  ```

---

## 🏃 Local Development

### 1. Installation
Install project dependencies using Bun:
```bash
bun install
```

### 2. Run the Development Server
Launch the Next.js development server locally:
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the dashboard.

### 3. Linting & Formatting
Verify syntax formatting and code guidelines:
```bash
bun run lint
```

### 4. Type Checking
Perform static type analysis on TypeScript source code:
```bash
bun run type-check
```
