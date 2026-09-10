---
name: accessibility
description: >-
  Design, implement, and audit React and Next.js web applications for WCAG 2.2 Level AA compliance. Use when creating UI components, modals, forms, navigation, or auditing code for keyboard navigation, color contrast, focus management, and screen-reader support.
---

# Web Accessibility (WCAG 2.2 Level AA)

This skill ensures that React and Next.js web interfaces are **Perceivable, Operable, Understandable, and Robust (POUR)** for all users, including keyboard-only users, screen-reader users, and people with low vision or motor impairments.

---

## 1. Core Principles (WCAG 2.2 Level AA)

### A. Perceivable (Sensory Access)
1. **Color Contrast:**
   * Normal body text: Minimum **4.5:1** contrast ratio against its background.
   * Large text (≥ 18pt / 24px regular or ≥ 14pt / ~18.5px bold) & UI component boundaries/icons: Minimum **3:1** contrast ratio.
2. **Never Rely on Color Alone:**
   * Do not convey status or validation errors exclusively through color (e.g., turning a border red). Always pair color changes with an icon or clear descriptive text.
3. **Non-Text Content:**
   * Meaningful images require concise `alt` text.
   * Purely decorative images or SVG icons must be hidden with `aria-hidden="true"`.
   * Icon-only buttons must have an accessible name via `aria-label` or `<span className="sr-only">Label</span>`.

### B. Operable (Keyboard & Interaction)
1. **Full Keyboard Navigation:**
   * Every interactive element must be reachable via `Tab` and activatable via `Enter` / `Space`.
2. **Visible Focus Indicators (WCAG 2.2 SC 2.4.11 / 2.4.13):**
   * Never write `outline-none` alone. Always provide high-contrast visible focus rings using Tailwind `focus-visible:` utilities:
     ```tsx
     className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
     ```
3. **Minimum Target Size (WCAG 2.2 SC 2.5.8):**
   * Interactive targets must measure at least **24×24 CSS pixels**, or provide adequate padding (recommended **44×44px** for touch viewports).
4. **Modal / Dialog Focus Containment:**
   * Open modals must trap focus within the dialog.
   * Pressing `Escape` must close the dialog.
   * Closing the dialog must return focus to the trigger button that opened it.

### C. Understandable (Predictable & Clear)
1. **Form Labels & Error Association:**
   * Every form input must have a `<label htmlFor={id}>` or an explicit `aria-label`.
   * Error messages must be programmatically linked via `aria-describedby={`${id}-error`}` and marked with `aria-invalid={true}`.
2. **Predictable Navigation & Expansion:**
   * Collapsible sections, dropdowns, and accordions must announce their state using `aria-expanded={isOpen}` and identify the controlled panel via `aria-controls={panelId}`.

### D. Robust (Semantic HTML5 First)
* **The "Anti-Div" Rule:** Always use native semantic HTML elements (`<button>`, `<a>`, `<input>`, `<select>`, `<dialog>`, `<nav>`, `<main>`, `<header>`, `<footer>`).
* **Never use `<div onClick={...}>` or `<span onClick={...}>`** for interactive actions. If it triggers an action, it is a `<button>`. If it changes the URL, it is an `<a>` or Next.js `<Link>`.

---

## 2. React & Next.js Implementation Patterns

> **Note:** The utility classes below use standard Tailwind CSS. Adapt them as needed to match your project's theme or design system tokens (e.g., `ring-primary`, `bg-background`, `border-border`).

### Pattern 1: Accessible Icon-Only Button
```tsx
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
}

export function IconButton({ label, icon, className = "", ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-md p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 ${className}`}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
```

### Pattern 2: Form Input with Accessible Validation
```tsx
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function TextInput({ id, label, error, className = "", ...props }: TextInputProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`rounded-md bg-transparent px-3 py-2 text-neutral-900 dark:text-neutral-100 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
          error ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
```

### Pattern 3: Expandable Disclosure / Accordion
```tsx
interface DisclosureProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function Disclosure({ id, title, isOpen, onToggle, children }: DisclosureProps) {
  const contentId = `${id}-content`;

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <button
        type="button"
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left font-medium text-neutral-900 dark:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
      >
        <span>{title}</span>
        <span aria-hidden="true" className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={`${id}-trigger`}
        hidden={!isOpen}
        className="pb-4 text-neutral-600 dark:text-neutral-400 text-sm"
      >
        {children}
      </div>
    </div>
  );
}
```

### Pattern 4: Accessible Live Status Announcements
For dynamic updates (e.g., "Copied to clipboard", search count updates, or background saving):
```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>
```

---

## 3. Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | Correction |
| :--- | :--- | :--- |
| `<div onClick={handleClick}>Click me</div>` | Inaccessible to keyboard, switches, and screen readers | Use `<button type="button" onClick={handleClick}>` |
| `className="outline-none"` | Strips the focus indicator for keyboard users (WCAG SC 2.4.7) | Replace with `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400` |
| `<button><Icon /></button>` without text or label | Announced as "Button" with no context to screen-reader users | Add `aria-label="Action description"` and `<Icon aria-hidden="true" />` |
| Red border as the only indication of input error | Fails color-blind and low-vision users (WCAG SC 1.4.1) | Add an explicit error text block and `aria-invalid="true"` |
| Modal with no focus trap or `Escape` key handler | Traps keyboard users in the background DOM | Contain focus inside modal; close on `Escape`; restore focus to trigger |
| `alt="Image of user avatar"` | Redundant words ("image of") announced twice by screen readers | Use `alt="User avatar"` or `alt=""` if decorative |

---

## 4. Accessibility Checklist for Every PR / Component

- [ ] All interactive elements are native `<button>` or `<a>` elements (or have explicit ARIA role + keyboard handlers).
- [ ] No raw `outline-none` without `focus-visible:` ring styling.
- [ ] Every icon-only button has `aria-label` or `<span className="sr-only">`.
- [ ] Decorative SVGs and icons have `aria-hidden="true"`.
- [ ] Inputs have associated `<label htmlFor="...">` and error descriptions via `aria-describedby`.
- [ ] Modals trap focus, close on `Escape`, and return focus upon close.
- [ ] Dynamic expand/collapse controls use `aria-expanded` and `aria-controls`.
- [ ] Contrast ratios meet minimum 4.5:1 (body) and 3:1 (large text / UI borders).
