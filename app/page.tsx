"use client";

import { useState } from "react";

// Types for pipeline steps
interface PipelineStep {
  name: string;
  badge: string;
  role: string;
  description: string;
  files: string[];
}

// Types for skills
interface SkillItem {
  id: string;
  name: string;
  description: string;
  meta: string;
  accent: string;
}

// Types for assistants
interface AssistantSetup {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  description: string;
  setupInstructions: string[];
  configLabel: string;
  configContent: string;
}

export default function Home() {
  // State for interactive pipeline selector
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  
  // State for assistant setup tabs
  const [activeTab, setActiveTab] = useState<string>("antigravity");
  
  // Copy state
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pipeline Data
  const pipelineSteps: PipelineStep[] = [
    {
      name: "Intake",
      badge: "Stage 1",
      role: "Requirements Capture",
      description: "Resolves free-form prompts or tickets into structured tasks, extracting acceptance criteria and sizing.",
      files: [".agents/skills/intake/SKILL.md"]
    },
    {
      name: "Research",
      badge: "Stage 2",
      role: "Codebase Mapping",
      description: "Maps the workspace, detects architectural conventions, and validates code hypotheses before planning.",
      files: [".agents/skills/research/SKILL.md"]
    },
    {
      name: "Plan",
      badge: "Stage 3",
      role: "Technical Blueprint",
      description: "Produces a detailed implementation plan, failure-mode table, line estimate, and security analysis.",
      files: [".agents/skills/plan/SKILL.md", "implementation_plan.md"]
    },
    {
      name: "Gate 1",
      badge: "Human Gate",
      role: "Plan Approval",
      description: "A hard stop requiring explicit user approval to proceed. Ensures alignment on proposed modifications.",
      files: ["task.md"]
    },
    {
      name: "Implement",
      badge: "Stage 4",
      role: "Code Synthesis",
      description: "Executes the approved blueprint file-by-file, maintaining strict code style and validation checks.",
      files: [".agents/skills/implement/SKILL.md"]
    },
    {
      name: "Gate 2",
      badge: "Human Gate",
      role: "Execution Review",
      description: "A secondary stop for running manual verification tests and accepting/requesting code revisions.",
      files: ["walkthrough.md"]
    },
    {
      name: "Review",
      badge: "Stage 5",
      role: "Differential Audit",
      description: "Performs a strict review of the local diff, classifying warnings/errors and delivering a Go/No-Go verdict.",
      files: [".agents/skills/review/SKILL.md"]
    },
    {
      name: "Report",
      badge: "Stage 6",
      role: "Feature Summary",
      description: "Compiles a final report summarizing step metrics, file changes, risk analysis, and review outcomes.",
      files: []
    }
  ];

  // Agent Skills Data
  const skillsList: SkillItem[] = [
    {
      id: "intake",
      name: "Intake",
      description: "Slices incoming feature tickets into structured deliverables, validating success criteria early.",
      meta: "Skill 1 · Intake Analysis",
      accent: "from-blue-500/20 to-indigo-500/10 border-blue-500/30"
    },
    {
      id: "research",
      name: "Research",
      description: "Explores files to auto-detect codebase conventions and dependencies, laying robust foundations.",
      meta: "Skill 2 · Code Explorer",
      accent: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30"
    },
    {
      id: "plan",
      name: "Plan",
      description: "Builds structured implementation proposals with safety buffers and security risk assessments.",
      meta: "Skill 3 · Technical Planner",
      accent: "from-emerald-500/20 to-green-500/10 border-emerald-500/30"
    },
    {
      id: "implement",
      name: "Implement",
      description: "Executes plan modifications carefully, validating state and testing incremental additions.",
      meta: "Skill 4 · Code Synthesizer",
      accent: "from-amber-500/20 to-orange-500/10 border-amber-500/30"
    },
    {
      id: "review",
      name: "Review",
      description: "Ensures code quality by analyzing the final local Git diffs against strict guidelines.",
      meta: "Skill 5 · Code Auditor",
      accent: "from-rose-500/20 to-pink-500/10 border-rose-500/30"
    },
    {
      id: "debug",
      name: "Debug",
      description: "Traces failures deterministically, compiling test cases and identifying root causes.",
      meta: "Skill 6 · Root Cause Analyst",
      accent: "from-purple-500/20 to-violet-500/10 border-purple-500/30"
    }
  ];

  // Assistants Data
  const assistantsData: AssistantSetup[] = [
    {
      id: "antigravity",
      name: "Antigravity",
      icon: "⚡",
      subtitle: "Workspace Companion",
      description: "Google DeepMind's agentic workspace orchestrator. Runs natively inside the Antigravity IDE using built-in skills.",
      setupInstructions: [
        "Discovers skill manifests automatically within the workspace root under `.agents/`.",
        "Allows direct invocation of orchestrator steps using command prompts.",
        "Loads global rules from ~/.gemini/config and local rules from AGENTS.md dynamically."
      ],
      configLabel: "",
      configContent: ""
    },
    {
      id: "claude",
      name: "Claude",
      icon: "💬",
      subtitle: "Claude Code / CLI",
      description: "Anthropic's command-line agent. Configured to recognize workspace-specific commands and style rules.",
      setupInstructions: [
        "Discovers skill guides inside `.claude/skills/` to provide slash command suggestions.",
        "Loads configuration commands and style guidelines automatically from `CLAUDE.md`.",
        "To link skills, execute: `ln -s ../.agents/skills .claude/skills`"
      ],
      configLabel: "",
      configContent: ""
    },
    {
      id: "copilot",
      name: "Copilot",
      icon: "🤖",
      subtitle: "GitHub Copilot",
      description: "Microsoft's coding companion. Wired to align with workspace-specific skill manuals.",
      setupInstructions: [
        "Discovers custom skill guides inside `.github/skills/` to populate triggers.",
        "Consumes prompt configurations automatically from `.github/copilot-instructions.md`.",
        "To link skills, execute: `ln -s ../.agents/skills .github/skills`"
      ],
      configLabel: "",
      configContent: ""
    }
  ];

  const currentAssistant = assistantsData.find(a => a.id === activeTab) || assistantsData[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#ffffff] font-sans font-sans-framer selection:bg-[#0099ff]/30 selection:text-white">
      {/* Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-250px] left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse-glow"></div>
        <div className="absolute top-[-180px] right-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[140px] animate-pulse-glow" style={{ animationDelay: "-3s" }}></div>
      </div>

      {/* Header Sticky Nav */}
      <header className="sticky top-0 w-full z-50 border-b border-[#ffffff]/[0.06] bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Logo */}
            <div className="w-8 h-8 rounded-lg bg-[#ffffff] flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <span className="text-black font-extrabold text-sm tracking-tighter">AI</span>
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              AI Workflow Hub
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#skills" className="hover:text-white transition-colors">Agent Skills</a>
            <a href="#orchestrator" className="hover:text-white transition-colors">Master Orchestrator</a>
            <a href="#setup" className="hover:text-white transition-colors">Assistants Setup</a>
            <a 
              href="file:///Users/ztlab157/Work-Projects/ai-workflow-demo/AGENTS.md" 
              className="hover:text-white transition-colors"
            >
              AGENTS.md
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="#setup"
              className="px-4 py-2 text-xs font-semibold rounded-full bg-[#ffffff] text-black hover:scale-95 transition-transform duration-200 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              Setup Guide
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-6 py-20 text-center z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ffffff]/10 bg-[#121212] text-xs font-medium text-[#0099ff] tracking-wide uppercase shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0099ff]"></span>
            Now supporting multi-agent runtimes
          </div>

          {/* Huge display title */}
          <h1 className="text-5xl md:text-8xl font-bold tracking-[-0.05em] leading-[0.95] text-white">
            AI Workflow <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              Orchestration
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl text-lg md:text-xl text-zinc-400 font-normal leading-relaxed">
            Configure, manage, and run local agentic tasks systematically. Leverage structured development skills across <strong className="text-white">Antigravity</strong>, <strong className="text-white">Claude</strong>, and <strong className="text-white">Copilot</strong>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <a
              href="#skills"
              className="flex items-center justify-center px-8 py-3.5 text-sm font-semibold rounded-full bg-[#ffffff] text-black hover:scale-95 transition-transform duration-200 shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
            >
              Explore Skills
            </a>
            <a
              href="#orchestrator"
              className="flex items-center justify-center px-8 py-3.5 text-sm font-semibold rounded-full bg-[#121212] text-white border border-white/[0.08] hover:scale-95 hover:bg-zinc-900 transition-transform duration-200"
            >
              Learn Orchestrator
            </a>
          </div>
        </div>

        {/* Small Scroll Indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-zinc-500 animate-pulse text-xs tracking-wider uppercase">
          <span>Scroll down</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Skills Grid Section */}
      <section id="skills" className="py-24 border-t border-white/[0.06] bg-[#080808] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-xs font-semibold text-[#0099ff] tracking-widest uppercase mb-3">Modular Architecture</h2>
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Bespoke Agentic Skills
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Our workspace houses structured directories under <code className="text-zinc-200 font-mono bg-zinc-900 px-1 py-0.5 rounded text-sm">.agents/skills/</code>. Each contains an instructions manifest that dictates agent behaviors for specific phases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsList.map((skill) => (
              <div 
                key={skill.id}
                className="p-8 rounded-2xl border border-white/[0.06] bg-[#121212] flex flex-col justify-between hover:border-zinc-700 transition-all duration-300 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
              >
                <div>
                  <span className="text-xs font-semibold text-zinc-500 block mb-6">{skill.meta}</span>
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#0099ff] transition-colors">{skill.name}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">{skill.description}</p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <a 
                    href={`file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/${skill.id}/SKILL.md`}
                    className="text-xs font-medium text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                  >
                    View Manifest
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Orchestrator Showcase Section */}
      <section id="orchestrator" className="py-24 border-t border-white/[0.06] bg-[#050505] relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5">
              <h2 className="text-xs font-semibold text-[#0099ff] tracking-widest uppercase mb-3">Feature Pipeline</h2>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                The Master Orchestrator
              </h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                The orchestrator (<code className="text-zinc-200 font-mono bg-zinc-900 px-1 py-0.5 rounded text-sm">feature</code> skill) drives codebases from ticket descriptions to reviewed implementations. It coordinates the sub-skills in sequence, halting at human authorization gates.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center text-xs text-white shrink-0 mt-0.5">✓</div>
                  <p className="text-sm text-zinc-300"><strong className="text-white">Strict Sequential Stages:</strong> Ensures research and blueprints are established prior to generating code.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center text-xs text-white shrink-0 mt-0.5">✓</div>
                  <p className="text-sm text-zinc-300"><strong className="text-white">Two-Stage Human Gates:</strong> Explicit stops for technical blueprints (Gate 1) and execution testing (Gate 2).</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center text-xs text-white shrink-0 mt-0.5">✓</div>
                  <p className="text-sm text-zinc-300"><strong className="text-white">Automatic Size Routing:</strong> Routes workflows differently based on complexity (trivial bypasses gating, large fires both).</p>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/feature/SKILL.md"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-full bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800 transition-colors"
                >
                  View Orchestrator SKILL.md
                </a>
              </div>
            </div>

            {/* Right: Signature Spotlight Card */}
            <div className="lg:col-span-7 relative">
              {/* Blur backdrop for card */}
              <div className="absolute inset-0 bg-[#0099ff]/10 rounded-[30px] filter blur-xl opacity-40"></div>
              
              {/* Premium Gradient Spotlight Card */}
              <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-gradient-to-br from-violet-600/35 via-indigo-950/20 to-zinc-950/90 p-8 md:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.5)]">
                {/* Ambient glow inside */}
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full bg-[#0099ff]/20 filter blur-3xl pointer-events-none"></div>
                
                <span className="text-xs font-semibold text-[#0099ff] uppercase tracking-wider block mb-4">Core Pipeline Orchestrator</span>
                <h4 className="text-3xl font-extrabold tracking-tight text-white mb-4">
                  feature.run()
                </h4>
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-8">
                  A workflow engine designed for high-context coding environments. Rather than jumping straight to updates, the agent compiles and plans details to secure human feedback, eliminating structural regression.
                </p>

                {/* Micro Pipeline Map inside card */}
                <div className="space-y-3">
                  <div className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-2">Stage Order</div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
                      <div className="text-[10px] text-zinc-500">Stage 1</div>
                      <div className="text-xs font-bold text-white">Intake</div>
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
                      <div className="text-[10px] text-zinc-500">Stage 2</div>
                      <div className="text-xs font-bold text-white">Research</div>
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
                      <div className="text-[10px] text-zinc-500">Stage 3</div>
                      <div className="text-xs font-bold text-white">Plan</div>
                    </div>
                    <div className="p-2 rounded bg-[#0099ff]/10 border border-[#0099ff]/30 text-center">
                      <div className="text-[10px] text-[#0099ff]">GATE 1</div>
                      <div className="text-xs font-bold text-white">Approve</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
                      <div className="text-[10px] text-zinc-500">Stage 4</div>
                      <div className="text-xs font-bold text-white">Implement</div>
                    </div>
                    <div className="p-2 rounded bg-[#0099ff]/10 border border-[#0099ff]/30 text-center">
                      <div className="text-[10px] text-[#0099ff]">GATE 2</div>
                      <div className="text-xs font-bold text-white">Validate</div>
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
                      <div className="text-[10px] text-zinc-500">Stage 5</div>
                      <div className="text-xs font-bold text-white">Review</div>
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
                      <div className="text-[10px] text-zinc-500">Stage 6</div>
                      <div className="text-xs font-bold text-white">Report</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pipeline Map */}
      <section className="py-24 border-t border-white/[0.06] bg-[#080808] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-[#0099ff] tracking-widest uppercase mb-3">Interactive Workflow</h2>
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">Orchestrator Lifecycle</h3>
            <p className="text-zinc-400">
              Click on each step below to inspect its role, outputs, and associated manifests.
            </p>
          </div>

          {/* Interactive Steps Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {pipelineSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActivePipelineStep(idx)}
                className={`p-5 rounded-xl border text-left transition-all duration-200 relative overflow-hidden ${
                  activePipelineStep === idx 
                    ? "border-[#0099ff] bg-[#0099ff]/5 shadow-[0_0_20px_rgba(0,153,255,0.15)]" 
                    : "border-white/5 bg-[#121212] hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${
                    activePipelineStep === idx ? "text-[#0099ff]" : "text-zinc-500"
                  }`}>
                    {step.badge}
                  </span>
                  {activePipelineStep === idx && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0099ff] animate-ping"></span>
                  )}
                </div>
                <div className="text-base font-bold text-white">{step.name}</div>
                <div className="text-xs text-zinc-500 mt-1 truncate">{step.role}</div>
              </button>
            ))}
          </div>

          {/* Active Step Panel */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#121212] p-8 md:p-12 relative">
            <div className="absolute top-0 right-0 p-6 text-sm text-zinc-600 font-mono">
              Step {(activePipelineStep + 1).toString().padStart(2, "0")} / 08
            </div>
            
            <div className="max-w-3xl">
              <span className="text-xs font-semibold text-[#0099ff] tracking-wider uppercase bg-[#0099ff]/10 px-2.5 py-1 rounded-md">
                {pipelineSteps[activePipelineStep].badge}
              </span>
              <h4 className="text-3xl font-extrabold text-white mt-4 mb-3">
                {pipelineSteps[activePipelineStep].name} — <span className="text-zinc-400 font-medium">{pipelineSteps[activePipelineStep].role}</span>
              </h4>
              <p className="text-zinc-300 text-lg leading-relaxed mb-8">
                {pipelineSteps[activePipelineStep].description}
              </p>

              {pipelineSteps[activePipelineStep].files.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Associated Manifests & Documents</div>
                  <div className="flex flex-wrap gap-3">
                    {pipelineSteps[activePipelineStep].files.map((file, fIdx) => (
                      <a
                        key={fIdx}
                        href={`file:///Users/ztlab157/Work-Projects/ai-workflow-demo/${file}`}
                        className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/5 text-xs text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors font-mono"
                      >
                        {file}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Assistants Setup Section (Tabs) */}
      <section id="setup" className="py-24 border-t border-white/[0.06] bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h2 className="text-xs font-semibold text-[#0099ff] tracking-widest uppercase mb-3">Universal Compatibility</h2>
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              AI Assistant Setups
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Select your preferred assistant environment below to copy setup configurations and rules mapping the custom skill frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tabs selector */}
            <div className="lg:col-span-4 space-y-3">
              {assistantsData.map((assistant) => (
                <button
                  key={assistant.id}
                  onClick={() => {
                    setActiveTab(assistant.id);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${
                    activeTab === assistant.id
                      ? "border-[#0099ff] bg-[#0099ff]/5"
                      : "border-white/5 bg-[#121212] hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{assistant.icon}</span>
                    <div>
                      <div className="font-bold text-white text-sm">{assistant.name}</div>
                      <div className="text-xs text-zinc-500">{assistant.subtitle}</div>
                    </div>
                  </div>
                  <span className={`text-xs ${
                    activeTab === assistant.id ? "text-[#0099ff]" : "text-zinc-600 group-hover:text-zinc-400"
                  } transition-colors`}>
                    Setup →
                  </span>
                </button>
              ))}
            </div>

            {/* Config & Code Block Display Panel */}
            <div className="lg:col-span-8 p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-[#121212]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentAssistant.icon}</span>
                    <h4 className="text-2xl font-bold text-white">{currentAssistant.name} Setup</h4>
                  </div>
                  <p className="text-zinc-400 text-sm mt-1">{currentAssistant.description}</p>
                </div>
              </div>

              {/* Instructions list */}
              <div className="mb-6">
                <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Key Features & Setup</h5>
                <ul className="space-y-2">
                  {currentAssistant.setupInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <span className="text-[#0099ff] shrink-0 mt-1">•</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Configuration block */}
              {currentAssistant.configContent && (
                <div>
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-xs font-semibold text-zinc-500 font-mono">{currentAssistant.configLabel}</span>
                    <button
                      onClick={() => handleCopy(currentAssistant.configContent)}
                      className="px-3 py-1 rounded bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      {copied ? "✓ Copied!" : "Copy Configuration"}
                    </button>
                  </div>
                  <pre className="p-4 rounded-lg bg-zinc-950 border border-white/[0.06] text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed shadow-inner">
                    <code>{currentAssistant.configContent}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-white/[0.06] bg-[#050505] text-zinc-500 text-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#ffffff]/10 flex items-center justify-center">
              <span className="text-white font-bold text-xs tracking-tighter">AI</span>
            </div>
            <span className="font-semibold text-zinc-400 text-xs tracking-tight">
              AI Workflow Orchestrator
            </span>
          </div>
          <div className="flex gap-6 text-xs">
            <a 
              href="file:///Users/ztlab157/Work-Projects/ai-workflow-demo/AGENTS.md" 
              className="hover:text-white transition-colors"
            >
              AGENTS.md
            </a>
            <a 
              href="file:///Users/ztlab157/Work-Projects/ai-workflow-demo/CLAUDE.md" 
              className="hover:text-white transition-colors"
            >
              CLAUDE.md
            </a>
            <a 
              href="file:///Users/ztlab157/Work-Projects/ai-workflow-demo/README.md" 
              className="hover:text-white transition-colors"
            >
              README.md
            </a>
          </div>
          <div className="text-xs">
            © 2026 AI Workflow Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
