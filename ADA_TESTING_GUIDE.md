# ADA 2.0 / WCAG 2.0 Compliance Testing Guide

## Overview

This guide provides comprehensive instructions for testing the Pinnacle Live Client UI for ADA 2.0 / WCAG 2.0 compliance. The application has been updated with proper ARIA labels, semantic HTML, and accessibility features.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Automated Testing Tools](#automated-testing-tools)
3. [Manual Testing Procedures](#manual-testing-procedures)
4. [Screen Reader Testing](#screen-reader-testing)
5. [Keyboard Navigation Testing](#keyboard-navigation-testing)
6. [Color Contrast Testing](#color-contrast-testing)
7. [Component-Specific Testing](#component-specific-testing)
8. [Common Issues and Solutions](#common-issues-and-solutions)
9. [Compliance Checklist](#compliance-checklist)

---

## Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, or Safari)
- Screen reader software (NVDA, JAWS, or VoiceOver)
- Keyboard (for keyboard navigation testing)
- Browser extensions for accessibility testing

### Testing Environment Setup
```bash
# 1. Install the application
npm install

# 2. Run the development server
npm run dev

# 3. Access the application at http://localhost:5173
```

---

## Automated Testing Tools

### Recommended Browser Extensions

#### 1. **axe DevTools** (Chrome/Firefox/Edge)
- **Download**: [Chrome Web Store](https://chrome.google.com/webstore) or [Firefox Add-ons](https://addons.mozilla.org/)
- **Usage**:
  1. Open DevTools (F12)
  2. Navigate to "axe DevTools" tab
  3. Click "Scan All of My Page"
  4. Review and fix any violations

#### 2. **WAVE (Web Accessibility Evaluation Tool)**
- **Download**: [wave.webaim.org/extension](https://wave.webaim.org/extension/)
- **Usage**:
  1. Click the WAVE extension icon
  2. Review errors, alerts, and features
  3. Check for missing ARIA labels and contrast issues

#### 3. **Lighthouse** (Built into Chrome DevTools)
- **Usage**:
  1. Open DevTools (F12)
  2. Navigate to "Lighthouse" tab
  3. Select "Accessibility" category
  4. Click "Generate report"
  5. Aim for a score of 95+ out of 100

#### 4. **Accessibility Insights for Web**
- **Download**: [Microsoft Accessibility Insights](https://accessibilityinsights.io/downloads/)
- **Usage**:
  1. Install the extension
  2. Click the extension icon
  3. Run "FastPass" for quick assessment
  4. Run "Assessment" for comprehensive evaluation

---

## Manual Testing Procedures

### 1. Skip Links Testing

**What to test**: Skip link functionality for keyboard users

**Steps**:
1. Load any proposal page
2. Press `Tab` key once
3. **Expected**: A "Skip to main content" link should appear visually
4. Press `Enter`
5. **Expected**: Focus should jump to the main content area
6. **Verify**: Tab order continues from main content, not from the header

**WCAG Criteria**: 2.4.1 Bypass Blocks (Level A)

---

### 2. Page Structure Testing

**What to test**: Proper heading hierarchy and landmark regions

**Steps**:
1. Open browser DevTools
2. Install and use the "HeadingsMap" extension or use axe DevTools
3. **Expected**: Headings should follow logical order (h1 → h2 → h3)
4. **Expected**: Page should have proper landmarks:
   - `<header>` or `role="banner"`
   - `<main>` or `role="main"`
   - `<nav>` or `role="navigation"`
   - `<footer>` or `role="contentinfo"`

**WCAG Criteria**: 1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)

---

### 3. Form Labels Testing

**What to test**: All form inputs have associated labels

**Steps**:
1. Navigate to the Questions panel
2. Click "Submit Request" button
3. **Inspect each form field**:
   - Subject/Topic input
   - Question textarea
4. **Verify**: Each input has a visible `<label>` element with `for` attribute matching the input's `id`
5. **Verify**: Labels are properly associated (click label should focus input)

**WCAG Criteria**: 1.3.1 Info and Relationships (Level A), 3.3.2 Labels or Instructions (Level A)

---

### 4. Button and Link Testing

**What to test**: All interactive elements have descriptive accessible names

**Steps**:
1. **Inspect icon-only buttons** (question icons, trash icons, etc.):
   - Right-click → Inspect
   - **Verify**: Has `aria-label` attribute
   - **Verify**: Icon has `aria-hidden="true"`
   - **Verify**: Optional: Has `<span class="sr-only">` with descriptive text

2. **Test example buttons**:
   - Expand/Collapse All buttons: Should have `aria-label` describing action
   - Question icon buttons: Should announce "Ask question about [item name]"
   - Remove buttons: Should announce "Remove [item name] from proposal"
   - Tab triggers: Should announce tab purpose

**WCAG Criteria**: 1.1.1 Non-text Content (Level A), 2.4.4 Link Purpose (Level A), 4.1.2 Name, Role, Value (Level A)

---

### 5. Status Messages Testing

**What to test**: Dynamic content changes are announced to screen readers

**Steps**:
1. **Test loading states**:
   - Navigate to Questions tab
   - **Expected**: Screen reader should announce "Loading questions, please wait"
   - **Verify**: Element has `role="status"` or `aria-live="polite"`

2. **Test error states**:
   - Force an error (e.g., invalid token)
   - **Expected**: Error message should be announced immediately
   - **Verify**: Element has `role="alert"` or `aria-live="assertive"`

3. **Test success messages**:
   - Submit a question
   - **Expected**: Success toast should be announced
   - **Verify**: Uses `aria-live="polite"` region

**WCAG Criteria**: 4.1.3 Status Messages (Level AA)

---

### 6. Table Testing

**What to test**: Data tables have proper semantic structure

**Steps**:
1. Expand any proposal section (Audio, Lighting, etc.)
2. **Inspect the table**:
   - **Verify**: Uses proper `<table>`, `<thead>`, `<tbody>` elements
   - **Verify**: Header cells use `<th scope="col">`
   - **Verify**: Table has `role="table"` and `aria-label`
   - **Verify**: Table container is keyboard focusable with `tabIndex={0}` for scrolling

3. **Use screen reader table navigation**:
   - Navigate to table
   - Use table navigation commands (Ctrl+Alt+Arrow keys in NVDA)
   - **Expected**: Screen reader should announce column headers as you navigate cells

**WCAG Criteria**: 1.3.1 Info and Relationships (Level A)

---

### 7. Color Contrast Testing

**What to test**: Text has sufficient contrast against backgrounds

**Steps**:
1. Use WAVE or axe DevTools
2. Check all text elements:
   - Body text: Should have at least 4.5:1 contrast ratio
   - Large text (18px+ or 14px+ bold): Should have at least 3:1 contrast ratio
   - UI components: Should have at least 3:1 contrast ratio

3. **Manual verification**:
   - Status badges (green, yellow, red)
   - Button text on colored backgrounds
   - Muted text / secondary text
   - Link colors

**WCAG Criteria**: 1.4.3 Contrast (Minimum) (Level AA)

---

### 8. Focus Indicators Testing

**What to test**: All interactive elements have visible focus indicators

**Steps**:
1. Use keyboard to tab through all interactive elements
2. **Verify each element has**:
   - Visible outline or border change when focused
   - Color change when focused
   - Sufficient contrast (at least 3:1) between focused and unfocused states

3. **Elements to check**:
   - Buttons
   - Links
   - Form inputs
   - Tab triggers
   - Collapsible section headers

**WCAG Criteria**: 2.4.7 Focus Visible (Level AA)

---

## Screen Reader Testing

### NVDA (Windows) - Free

**Download**: [nvaccess.org](https://www.nvaccess.org/)

**Basic Commands**:
- `Ctrl` - Stop speech
- `Insert + Down Arrow` - Start reading from current position
- `H` - Next heading
- `Shift + H` - Previous heading
- `T` - Next table
- `B` - Next button
- `F` - Next form field
- `K` - Next link
- `L` - Next list
- `Insert + F7` - List all elements (headings, links, landmarks)

**Testing Procedure**:
1. Start NVDA
2. Navigate to the proposal page
3. Press `Insert + F7` to view elements list
4. **Verify**:
   - All headings are in logical order
   - All buttons have descriptive names
   - All links have meaningful text
   - All form fields have labels
5. Navigate through the page using heading navigation (H key)
6. Navigate through forms using F key
7. Interact with buttons and verify announcements

---

### JAWS (Windows) - Commercial

**Download**: [freedomscientific.com](https://www.freedomscientific.com/products/software/jaws/)

**Basic Commands** (similar to NVDA):
- `Insert + Down Arrow` - Start reading
- `H` / `Shift + H` - Heading navigation
- `T` - Table navigation
- `B` - Button navigation
- `F` - Form field navigation
- `Insert + F5` - Form fields list
- `Insert + F6` - Headings list
- `Insert + F7` - Links list

**Testing Procedure**:
1. Follow same procedure as NVDA testing
2. Verify all interactive elements are announced correctly
3. Test table navigation with `Ctrl + Alt + Arrow keys`

---

### VoiceOver (macOS) - Built-in

**Activation**: `Cmd + F5`

**Basic Commands**:
- `VO` = `Ctrl + Option` (VoiceOver modifier)
- `VO + A` - Start reading
- `VO + Right Arrow` - Next item
- `VO + Left Arrow` - Previous item
- `VO + U` - Open rotor (elements list)
- `VO + H` - Next heading
- `VO + J` - Next form control
- `VO + Cmd + H` - Next heading of same level

**Testing Procedure**:
1. Activate VoiceOver
2. Press `VO + U` to open rotor
3. Navigate through headings, links, form controls
4. **Verify**:
   - All elements have proper labels
   - Navigation is logical
   - Status updates are announced

---

## Keyboard Navigation Testing

### Essential Keyboard Commands

| Key | Expected Behavior |
|-----|-------------------|
| `Tab` | Move focus to next interactive element |
| `Shift + Tab` | Move focus to previous interactive element |
| `Enter` | Activate button, link, or submit form |
| `Space` | Activate button, toggle checkbox |
| `Arrow Keys` | Navigate within tabs, menus, radio groups |
| `Escape` | Close modal or dropdown |
| `Home` | Jump to first item in list |
| `End` | Jump to last item in list |

---

### Keyboard Navigation Test Procedure

#### 1. **Tab Order Test**
**Steps**:
1. Load the proposal page
2. Press `Tab` repeatedly
3. **Verify**:
   - Focus moves in logical order (left to right, top to bottom)
   - All interactive elements are reachable
   - No focus traps (can always move forward and backward)
   - Skip link appears first when tabbing
   - No hidden elements receive focus

**WCAG Criteria**: 2.4.3 Focus Order (Level A), 2.1.2 No Keyboard Trap (Level A)

---

#### 2. **Modal Dialog Navigation**
**Steps**:
1. Click "Approve Proposal" button
2. **Verify modal behavior**:
   - Focus moves to modal immediately
   - `Tab` cycles only through modal elements (focus trap)
   - `Shift + Tab` works in reverse within modal
   - `Escape` closes the modal
   - Focus returns to trigger button after closing

**WCAG Criteria**: 2.1.2 No Keyboard Trap (Level A), 2.4.3 Focus Order (Level A)

---

#### 3. **Collapsible Sections**
**Steps**:
1. Navigate to proposal sections
2. Tab to a section header
3. Press `Enter` or `Space`
4. **Verify**:
   - Section expands/collapses
   - `aria-expanded` attribute toggles (inspect with DevTools)
   - Screen reader announces state change

**WCAG Criteria**: 4.1.2 Name, Role, Value (Level A)

---

#### 4. **Tab Navigation**
**Steps**:
1. Navigate to the tab list (Timeline, Proposal Details, Requests, Suggestions)
2. Tab to first tab trigger
3. Use `Arrow Left/Right` keys
4. **Verify**:
   - Arrow keys move between tabs
   - `Enter` or `Space` activates selected tab
   - `Home` jumps to first tab
   - `End` jumps to last tab
   - Tab panel content updates when tab changes

**WCAG Criteria**: 2.1.1 Keyboard (Level A), 4.1.2 Name, Role, Value (Level A)

---

#### 5. **Form Navigation**
**Steps**:
1. Navigate to Questions panel
2. Click "Submit Request"
3. **Verify form navigation**:
   - `Tab` moves between form fields in logical order
   - `Enter` submits the form (not just any button press)
   - `Escape` closes the form
   - All fields are reachable via keyboard

**WCAG Criteria**: 2.1.1 Keyboard (Level A)

---

## Color Contrast Testing

### Manual Contrast Testing

**Tools**:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Browser extension: "Colour Contrast Analyser"

**Procedure**:
1. Take screenshots of different UI states
2. Use color picker to get foreground and background colors
3. Input colors into contrast checker
4. **Verify ratios**:
   - Normal text: ≥ 4.5:1
   - Large text (18px+ or 14px+ bold): ≥ 3:1
   - UI components and graphics: ≥ 3:1

---

### Elements to Check

| Element | Min. Contrast | Notes |
|---------|---------------|-------|
| Body text on white background | 4.5:1 | Black/dark gray on white |
| Muted text (labels, descriptions) | 4.5:1 | Often fails - check carefully |
| Button text on colored background | 4.5:1 | Green button with white text |
| Link text | 4.5:1 | Should be distinguishable without color alone |
| Status badges (green, yellow, red) | 4.5:1 | Text inside badges |
| Focus indicators | 3:1 | Border/outline vs. background |
| Icon colors | 3:1 | Icons that convey meaning |
| Table headers | 4.5:1 | Muted foreground text |

---

## Component-Specific Testing

### ProposalView (Main Page)

**Accessibility Features**:
- Skip link to main content
- Proper `<header>`, `<main>` landmarks
- Loading state with `aria-live="polite"` and `aria-busy="true"`
- Error state with `role="alert"` and `aria-live="assertive"`
- Secure access banner with status indicator

**Test Cases**:
1. **Skip Link**:
   - Tab once, verify skip link appears
   - Press Enter, verify focus jumps to main content

2. **Loading State**:
   - Load page with slow network
   - Verify screen reader announces "Validating your access, please wait"

3. **Error State**:
   - Use invalid token
   - Verify screen reader announces error immediately
   - Verify error is in `role="alert"` region

4. **Secure Access Banner**:
   - Verify email is announced as "Logged in as [email]"
   - Verify expiration timer is announced with `aria-live="polite"`

---

### ProposalDashboard

**Accessibility Features**:
- Logo with `role="img"` and `aria-label`
- Approve button with descriptive `aria-label`
- Status badge with `role="status"`
- Tab list with proper `role="tablist"` and `aria-label`
- Pending count badge with screen reader text
- Expand/Collapse All buttons with `aria-controls`

**Test Cases**:
1. **Tab Navigation**:
   - Tab to tab list
   - Use Arrow keys to navigate tabs
   - Verify screen reader announces:
     - "Timeline" - "View event timeline"
     - "Proposal Details" - "View proposal details and breakdown"
     - "Requests" - "View requests and questions (X pending)"
     - "Sales Suggestions" - "View sales suggestions and recommendations"

2. **Pending Badge**:
   - Navigate to "Requests" tab trigger
   - Verify screen reader announces number of pending requests
   - Verify badge has `role="status"` and screen reader text

3. **Expand/Collapse Buttons**:
   - Navigate to Proposal Details tab
   - Tab to "Expand All" button
   - Verify `aria-label` announces: "Expand all sections to view all items"
   - Press Enter, verify all sections expand
   - Verify screen reader announces state change

---

### ProposalSection (Collapsible Tables)

**Accessibility Features**:
- Collapsible button with `aria-expanded` and `aria-controls`
- Semantic `<table>` with `<thead>`, `<tbody>`
- Table headers with `scope="col"`
- Hover card with `role="tooltip"`
- Action buttons with `aria-label` and `sr-only` text
- Table wrapper with `role="region"` for scrolling

**Test Cases**:
1. **Collapsible Header**:
   - Tab to section header
   - Verify screen reader announces: "[Expanded/Collapsed] [Section Name] section with [X] items"
   - Press Enter to toggle
   - Verify `aria-expanded` value changes (inspect DevTools)
   - Verify screen reader announces expansion state

2. **Table Structure**:
   - Enable screen reader table mode
   - Navigate to table
   - Verify screen reader announces:
     - "Table with 7 columns, X rows"
     - Column headers as you move through cells
   - Use Ctrl+Alt+Arrow keys (NVDA/JAWS) to navigate table

3. **Item Details Hover Card**:
   - Tab to item name with info icon
   - Press Enter or hover
   - Verify tooltip appears
   - Verify tooltip has `role="tooltip"`
   - Verify content is readable by screen reader

4. **Action Buttons**:
   - Tab to question icon button
   - Verify screen reader announces: "Ask question about [item name]"
   - Tab to remove button (Additional Services section)
   - Verify screen reader announces: "Remove [item name] from proposal"

---

### TimelineView

**Accessibility Features**:
- View toggle buttons with `aria-pressed`
- Timeline with `role="list"` and items with `role="listitem"`
- Status badges with text alternatives (not color-only)
- Event details with `role="list"`
- Labor schedule tables with proper semantics
- Cost displays with `aria-label`

**Test Cases**:
1. **View Toggle**:
   - Tab to "Event View" button
   - Verify screen reader announces: "Switch to event timeline view"
   - Verify `aria-pressed="true"` when active
   - Click "Labor View"
   - Verify `aria-pressed` updates

2. **Timeline Events**:
   - Navigate to timeline
   - Verify screen reader announces: "Event timeline, list"
   - Tab through events
   - Verify each event is announced as list item

3. **Status Badges**:
   - Inspect status badges (completed, confirmed, in-progress)
   - Verify screen reader announces: "Status: [status name]"
   - Verify includes `<span class="sr-only">` with full description
   - Verify not relying on color alone

4. **Labor Schedule Tables**:
   - Expand labor schedule section
   - Verify table has `role="table"` and `aria-label`
   - Verify all headers have `scope="col"`
   - Test screen reader table navigation

---

### QuestionsPanel

**Accessibility Features**:
- Submit Request button with descriptive `aria-label`
- Form with `role="form"` and `aria-label`
- Input labels properly associated with inputs
- Tab list with `role="tablist"` and ARIA labels
- Question lists with `role="list"` and `role="listitem"`
- Section groupings with `<section>` and `aria-label`

**Test Cases**:
1. **Submit Request Form**:
   - Click "Submit Request"
   - Verify form appears with `role="form"`
   - Tab through form fields
   - Verify each label is associated with input (click label focuses input)
   - Verify quick topic badges are keyboard accessible
   - Verify submit button is disabled when fields are empty
   - Verify `aria-label` describes button state

2. **Tab Filters**:
   - Navigate to tab list
   - Use Arrow keys to navigate between "All", "Pending", "Answered"
   - Verify screen reader announces count for each tab
   - Verify `aria-label` includes count: "View X pending questions"

3. **Question Lists**:
   - Navigate to questions
   - Verify list has `role="list"` and descriptive `aria-label`
   - Verify each question is in `role="listitem"`
   - Verify sections are properly marked with `<section>` and `aria-label`

---

### SuggestionPanel

**Accessibility Features**:
- Suggestion list with `role="list"`
- Each suggestion as `<article>` with `role="listitem"`
- Product title with unique `id` for `aria-labelledby`
- Badges with descriptive `aria-label`
- Feature and benefit lists with proper semantics
- Add button with full context in `aria-label`

**Test Cases**:
1. **Suggestion List**:
   - Navigate to suggestions
   - Verify screen reader announces: "Product suggestions, list"
   - Tab through suggestions
   - Verify each is announced as article/listitem

2. **Product Details**:
   - Navigate to product title
   - Verify unique ID and proper heading level
   - Navigate to badges
   - Verify "Recommended" badge has `role="status"` and is announced
   - Verify type and category badges have descriptive `aria-label`

3. **Features and Benefits**:
   - Navigate to features list
   - Verify list has `role="list"` and `aria-label`
   - Verify items have `role="listitem"`
   - Verify screen reader announces list name and item count

4. **Add to Proposal Button**:
   - Tab to "Add to Proposal" button
   - Verify screen reader announces: "Add [Product Name] to proposal for $[Price]"
   - Press Enter
   - Verify success message is announced (toast notification)

---

## Common Issues and Solutions

### Issue 1: Focus Trap in Modal

**Symptom**: Tab key escapes modal dialog

**Solution**: Ensure modal uses Radix UI Dialog component (already implemented). If custom modal, use `focus-trap-react` library.

**Verification**:
```javascript
// Modal should have:
<Dialog>
  <DialogContent> {/* Focus trap is automatic with Radix UI */}
    {/* Modal content */}
  </DialogContent>
</Dialog>
```

---

### Issue 2: Icon Buttons Not Announced

**Symptom**: Screen reader says "button" without context

**Solution**: Add `aria-label` and `aria-hidden="true"` to icon:

```jsx
// ✅ CORRECT
<Button aria-label="Ask question about Audio Mixer">
  <HelpCircle aria-hidden="true" />
  <span className="sr-only">Ask question about Audio Mixer</span>
</Button>

// ❌ INCORRECT
<Button>
  <HelpCircle />
</Button>
```

---

### Issue 3: Color-Only Status Indicators

**Symptom**: Status badges use only color (green/yellow/red)

**Solution**: Add screen reader text and/or icons:

```jsx
// ✅ CORRECT
<Badge className="bg-green-500" role="status" aria-label="Status: Completed">
  Completed
  <span className="sr-only">. Status is completed</span>
</Badge>

// ❌ INCORRECT
<Badge className="bg-green-500">
  {/* Color only, no text */}
</Badge>
```

---

### Issue 4: Missing Form Labels

**Symptom**: Form input not associated with label

**Solution**: Use proper label association:

```jsx
// ✅ CORRECT
<Label htmlFor="subject">Subject</Label>
<Input id="subject" name="subject" />

// ❌ INCORRECT
<div>Subject</div>
<Input name="subject" />
```

---

### Issue 5: Table Not Announced Properly

**Symptom**: Screen reader doesn't announce table structure

**Solution**: Use semantic table elements and scope attributes:

```jsx
// ✅ CORRECT
<table role="table" aria-label="Proposal items">
  <thead>
    <tr>
      <th scope="col">Item</th>
      <th scope="col">Quantity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Speaker</td>
      <td>5</td>
    </tr>
  </tbody>
</table>

// ❌ INCORRECT
<div className="table">
  <div className="row">
    <div className="cell">Item</div>
    <div className="cell">Quantity</div>
  </div>
</div>
```

---

### Issue 6: Dynamic Content Not Announced

**Symptom**: Loading/error states not announced by screen reader

**Solution**: Use `aria-live` regions:

```jsx
// ✅ CORRECT - Loading
<div role="status" aria-live="polite" aria-busy="true">
  <Loader2 aria-hidden="true" />
  <span className="sr-only">Loading, please wait</span>
</div>

// ✅ CORRECT - Error
<div role="alert" aria-live="assertive">
  <AlertCircle aria-hidden="true" />
  <p>{errorMessage}</p>
</div>

// ❌ INCORRECT
<div>
  <Loader2 />
</div>
```

---

### Issue 7: Collapsible Sections Missing State

**Symptom**: Screen reader doesn't announce expanded/collapsed state

**Solution**: Use button with `aria-expanded` and `aria-controls`:

```jsx
// ✅ CORRECT
<button
  aria-expanded={isExpanded}
  aria-controls="section-content-audio"
  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} Audio section`}
>
  {isExpanded ? <ChevronDown aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
  Audio Equipment
</button>

<div id="section-content-audio">
  {/* Section content */}
</div>

// ❌ INCORRECT
<div onClick={toggle}>
  {isExpanded ? <ChevronDown /> : <ChevronRight />}
  Audio Equipment
</div>
```

---

## Compliance Checklist

Use this checklist to verify WCAG 2.0 Level AA compliance:

### Level A (Must Pass)

- [ ] **1.1.1 Non-text Content**: All images, icons, and non-text content have text alternatives
- [ ] **1.3.1 Info and Relationships**: Content structure is programmatically determined (headings, lists, tables)
- [ ] **1.3.2 Meaningful Sequence**: Content order makes sense when linearized
- [ ] **1.3.3 Sensory Characteristics**: Instructions don't rely solely on sensory characteristics
- [ ] **2.1.1 Keyboard**: All functionality available via keyboard
- [ ] **2.1.2 No Keyboard Trap**: Keyboard focus can be moved away from any component
- [ ] **2.2.1 Timing Adjustable**: Time limits can be adjusted (N/A for this app)
- [ ] **2.2.2 Pause, Stop, Hide**: Moving content can be paused (N/A for this app)
- [ ] **2.4.1 Bypass Blocks**: Skip link provided to bypass repeated content
- [ ] **2.4.2 Page Titled**: Page has descriptive title
- [ ] **2.4.3 Focus Order**: Focus order is logical and follows visual order
- [ ] **2.4.4 Link Purpose**: Link purpose can be determined from link text or context
- [ ] **3.1.1 Language of Page**: Page language is specified in HTML
- [ ] **3.2.1 On Focus**: Focus doesn't trigger unexpected context change
- [ ] **3.2.2 On Input**: Input doesn't trigger unexpected context change
- [ ] **3.3.1 Error Identification**: Errors are clearly identified
- [ ] **3.3.2 Labels or Instructions**: Form fields have labels or instructions
- [ ] **4.1.1 Parsing**: HTML is valid (no duplicate IDs, proper nesting)
- [ ] **4.1.2 Name, Role, Value**: UI components have accessible names and roles

### Level AA (Should Pass)

- [ ] **1.4.3 Contrast (Minimum)**: Text has at least 4.5:1 contrast ratio (3:1 for large text)
- [ ] **1.4.4 Resize Text**: Text can be resized up to 200% without loss of content
- [ ] **1.4.5 Images of Text**: Text is used instead of images of text (with exceptions)
- [ ] **2.4.5 Multiple Ways**: Multiple ways to access pages (N/A for single-page app)
- [ ] **2.4.6 Headings and Labels**: Headings and labels are descriptive
- [ ] **2.4.7 Focus Visible**: Keyboard focus indicator is visible
- [ ] **3.1.2 Language of Parts**: Language changes are marked (if applicable)
- [ ] **3.2.3 Consistent Navigation**: Navigation is consistent across pages
- [ ] **3.2.4 Consistent Identification**: Components are identified consistently
- [ ] **3.3.3 Error Suggestion**: Error suggestions are provided
- [ ] **3.3.4 Error Prevention**: Important submissions can be reviewed/confirmed
- [ ] **4.1.3 Status Messages**: Status messages are programmatically determined

---

## Additional Resources

### Official Guidelines
- [WCAG 2.0 Guidelines](https://www.w3.org/WAI/WCAG20/quickref/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Section 508 Standards](https://www.section508.gov/)
- [ADA Requirements](https://www.ada.gov/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Pa11y](https://pa11y.org/) - Automated testing CLI tool
- [Accessibility Insights](https://accessibilityinsights.io/)

### Screen Readers
- [NVDA (Free)](https://www.nvaccess.org/)
- [JAWS (Commercial)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (macOS/iOS - Built-in)](https://www.apple.com/accessibility/voiceover/)
- [TalkBack (Android - Built-in)](https://support.google.com/accessibility/android/answer/6283677)

### Learning Resources
- [WebAIM Articles](https://webaim.org/articles/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Inclusive Components](https://inclusive-components.design/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

### Community
- [WebAIM Discussion List](https://webaim.org/discussion/)
- [A11y Slack](https://web-a11y.slack.com/)
- [Accessibility Reddit](https://www.reddit.com/r/accessibility/)

---

## Support

If you encounter accessibility issues or have questions:

1. **Report Issues**: Open an issue on the GitHub repository
2. **Contact**: Reach out to the development team
3. **Documentation**: Refer to this guide and WCAG guidelines
4. **Accessibility Statement**: Review the application's accessibility statement (if available)

---

## Conclusion

This Pinnacle Live Client UI has been designed and implemented with ADA 2.0 / WCAG 2.0 Level AA compliance in mind. Regular testing with automated tools, screen readers, and keyboard navigation is essential to maintain accessibility standards.

**Key Takeaways**:
- ✅ All interactive elements have proper ARIA labels
- ✅ Semantic HTML structure with proper landmarks
- ✅ Keyboard navigation is fully supported
- ✅ Screen reader compatibility tested
- ✅ Color contrast meets WCAG AA standards
- ✅ Skip links and focus management implemented
- ✅ Dynamic content changes are announced
- ✅ Tables and forms are properly structured

**Next Steps**:
1. Run automated tests regularly (axe, WAVE, Lighthouse)
2. Conduct manual keyboard navigation testing
3. Test with real screen reader users
4. Monitor for new WCAG updates and guidelines
5. Include accessibility testing in CI/CD pipeline

---

**Document Version**: 1.0
**Last Updated**: December 5, 2025
**Maintained By**: Development Team
