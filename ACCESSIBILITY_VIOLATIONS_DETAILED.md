# ICJIA R3 Website - Detailed Accessibility Violations & Remediation Guide

## Violation #1: Color Contrast (Serious)
**WCAG Criterion:** 1.4.3 Contrast (Minimum)  
**Pages Affected:** 2  
**Total Occurrences:** 38  
**Severity:** Serious

### Page 1: `/accessibility/audit-log` (37 violations)

#### Issue Description
Text on colored backgrounds (success/green, warning/yellow, info/blue) does not meet WCAG AA minimum contrast ratio of 4.5:1 for normal text.

#### Affected Elements
- `.bg-success.text-center.pa-4` (green background)
- `.bg-warning` (yellow background)
- `.bg-info.text-center.pa-4` (blue background)
- Table cells with colored backgrounds
- Text within these containers

#### Root Cause
Vuetify Material Design theme colors combined with default text colors don't achieve sufficient contrast. The theme uses:
- Success (green): `#4CAF50` with white/light text
- Warning (yellow): `#FFC107` with white/light text
- Info (blue): `#2196F3` with white/light text

#### Remediation Steps

**Option 1: Darken Text (Recommended)**
```css
.bg-success.text-center.pa-4 {
  background-color: #4CAF50;
  color: #000000; /* Change from white to black */
}

.bg-warning {
  background-color: #FFC107;
  color: #000000; /* Change from white to black */
}

.bg-info.text-center.pa-4 {
  background-color: #2196F3;
  color: #FFFFFF; /* Keep white but darken background */
}
```

**Option 2: Lighten Backgrounds**
```css
.bg-success.text-center.pa-4 {
  background-color: #81C784; /* Lighter green */
  color: #FFFFFF;
}

.bg-warning {
  background-color: #FFD54F; /* Lighter yellow */
  color: #000000;
}

.bg-info.text-center.pa-4 {
  background-color: #64B5F6; /* Lighter blue */
  color: #FFFFFF;
}
```

**Option 3: Update Vuetify Theme**
In `nuxt.config.js`, update the Vuetify theme configuration:
```javascript
vuetify: {
  theme: {
    themes: {
      light: {
        colors: {
          success: '#2E7D32', // Darker green
          warning: '#F57F17', // Darker yellow
          info: '#1565C0',    // Darker blue
        }
      }
    }
  }
}
```

#### Verification
Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Ensure ratio ≥ 4.5:1 for normal text
- Ensure ratio ≥ 3:1 for large text (18pt+)

---

### Page 2: `/contact` (1 violation)

#### Issue Description
White text (`.white-text` class) on colored background lacks sufficient contrast.

#### Affected Element
- `.white-text` class applied to text on colored background

#### Root Cause
White text (#FFFFFF) on light or medium-colored backgrounds doesn't provide adequate contrast.

#### Remediation Steps

**Step 1: Identify the background color**
```html
<!-- Find the element with .white-text and its parent background -->
<div class="bg-primary">
  <p class="white-text">Contact Information</p>
</div>
```

**Step 2: Change text color**
```css
.white-text {
  color: #000000; /* Change from white to black */
  /* OR use a dark gray for better readability */
  color: #212121;
}
```

**Step 3: Alternative - Use Vuetify text utilities**
```html
<!-- Instead of .white-text, use semantic color classes -->
<p class="text-dark">Contact Information</p>
```

#### Verification
Test the contrast ratio using WebAIM Contrast Checker.

---

## Violation #2: ARIA Required Attributes (Critical)
**WCAG Criterion:** 4.1.2 Name, Role, Value  
**Pages Affected:** 1  
**Total Occurrences:** 1  
**Severity:** Critical

### Page: `/contact`

#### Issue Description
Form field element (`.v-field--active`) is missing required ARIA attributes for its role.

#### Affected Element
- `.v-field--active` - Vuetify form field component

#### Root Cause
Vuetify form field component not properly configured with ARIA attributes. The field has a role but lacks required `aria-label` or `aria-labelledby`.

#### Remediation Steps

**Step 1: Add aria-label to form field**
```html
<!-- Before -->
<input class="v-field--active" type="text" />

<!-- After -->
<input class="v-field--active" type="text" aria-label="Contact Name" />
```

**Step 2: Or use aria-labelledby with label element**
```html
<label id="contact-name-label">Contact Name</label>
<input class="v-field--active" type="text" aria-labelledby="contact-name-label" />
```

**Step 3: Ensure Vuetify form component has label**
```vue
<template>
  <v-text-field
    v-model="contactName"
    label="Contact Name"
    aria-label="Contact Name"
    required
  />
</template>
```

#### Verification
- Use Axe DevTools to verify ARIA attributes are present
- Test with screen reader (NVDA, JAWS, VoiceOver)
- Ensure form field is announced with its label

---

## Violation #3: ARIA Hidden Focus (Serious)
**WCAG Criterion:** 4.1.2 Name, Role, Value  
**Pages Affected:** 1  
**Total Occurrences:** 1  
**Severity:** Serious

### Page: `/eligibility`

#### Issue Description
Element with `aria-hidden="true"` is focusable via keyboard (has `tabindex="101"`).

#### Affected Element
- `iframe #skip_map` - "Skip to Map" link in Esri map widget

#### Root Cause
Esri map widget's skip link has `aria-hidden="true"` to hide from screen readers but is still in the tab order with `tabindex="101"`.

#### Remediation Steps

**Option 1: Remove aria-hidden (Recommended)**
```html
<!-- Before -->
<a role="link" id="skip_map" aria-hidden="true" tabindex="101">Skip to Map</a>

<!-- After -->
<a role="link" id="skip_map" tabindex="0">Skip to Map</a>
```

**Option 2: Remove from tab order**
```html
<!-- Before -->
<a role="link" id="skip_map" aria-hidden="true" tabindex="101">Skip to Map</a>

<!-- After -->
<a role="link" id="skip_map" aria-hidden="true" tabindex="-1">Skip to Map</a>
```

**Step 2: Configure Esri widget**
Check Esri ArcGIS API documentation for accessibility options:
- Look for `skipLink` or `accessibility` configuration
- Disable skip link if not needed
- Or configure it properly with correct ARIA attributes

#### Verification
- Test with keyboard navigation (Tab key)
- Verify element is not announced by screen reader if aria-hidden
- Or verify element IS announced if aria-hidden is removed

---

## Violation #4: ARIA Prohibited Attributes (Serious)
**WCAG Criterion:** 4.1.2 Name, Role, Value  
**Pages Affected:** 1  
**Total Occurrences:** 2  
**Severity:** Serious

### Page: `/eligibility`

#### Issue Description
ARIA attributes are used on iframe elements where they are not permitted.

#### Affected Elements
- `iframe #skipContainer`
- `iframe .lastTrapLinkNode`

#### Root Cause
Esri map widget applies ARIA attributes to iframe elements, which is not valid per HTML specification.

#### Remediation Steps

**Step 1: Identify the ARIA attributes**
```html
<!-- Before (Invalid) -->
<iframe id="skipContainer" aria-label="Map Container" aria-hidden="false"></iframe>
<iframe class="lastTrapLinkNode" role="region"></iframe>

<!-- After (Valid) -->
<iframe id="skipContainer"></iframe>
<iframe class="lastTrapLinkNode"></iframe>
```

**Step 2: Move ARIA attributes to wrapper**
```html
<!-- Wrap iframe with accessible container -->
<div aria-label="Map Container" role="region">
  <iframe id="skipContainer"></iframe>
</div>
```

**Step 3: Configure Esri widget**
- Review Esri widget source code
- Remove ARIA attributes from iframe elements
- Apply ARIA attributes to appropriate wrapper elements
- Contact Esri support if needed

#### Verification
- Run Axe DevTools to verify no ARIA on iframe
- Check HTML validation
- Test with screen reader

---

## Violation #5: Form Label Issues (Serious)
**WCAG Criterion:** 1.3.1 Info and Relationships / 3.3.2 Labels or Instructions  
**Pages Affected:** 1  
**Total Occurrences:** 1  
**Severity:** Serious

### Page: `/eligibility`

#### Issue Description
Form input (Esri search widget) lacks visible label and uses only title attribute.

#### Affected Element
- `iframe #esri_dijit_Search_0_input` - Esri search input

#### Root Cause
Esri search widget uses `title` attribute for labeling instead of visible `<label>` element.

#### Remediation Steps

**Step 1: Add visible label**
```html
<!-- Before -->
<input id="esri_dijit_Search_0_input" type="text" title="Search" />

<!-- After -->
<label for="esri_dijit_Search_0_input">Search</label>
<input id="esri_dijit_Search_0_input" type="text" />
```

**Step 2: Configure Esri widget**
```javascript
const searchWidget = new Search({
  view: view,
  // Add accessibility configuration
  label: "Search",
  placeholder: "Search for locations..."
});
```

**Step 3: Add aria-label as fallback**
```html
<input 
  id="esri_dijit_Search_0_input" 
  type="text" 
  aria-label="Search for locations"
  placeholder="Search for locations..."
/>
```

#### Verification
- Visible label appears above/beside input
- Label is associated with input via `for` attribute
- Screen reader announces label when input is focused

---

## Violation #6: Nested Interactive Elements (Serious)
**WCAG Criterion:** 4.1.2 Name, Role, Value  
**Pages Affected:** 1  
**Total Occurrences:** 1  
**Severity:** Serious

### Page: `/eligibility`

#### Issue Description
Interactive controls are nested within other interactive elements.

#### Affected Element
- `iframe #widgets_HomeButton_Widget_22` - Esri home button widget

#### Root Cause
Esri map widget structure has nested interactive elements (button within button or link within button).

#### Remediation Steps

**Step 1: Identify nesting**
```html
<!-- Before (Invalid) -->
<button>
  <button id="widgets_HomeButton_Widget_22">Home</button>
</button>

<!-- After (Valid) -->
<button id="widgets_HomeButton_Widget_22">Home</button>
```

**Step 2: Restructure widget**
- Remove outer interactive element
- Keep only one interactive element per control
- Use CSS for styling instead of nested elements

**Step 3: Configure Esri widget**
- Check Esri widget documentation
- Look for `container` or `parent` configuration
- Ensure widget is placed in non-interactive container

#### Verification
- Inspect element structure in DevTools
- Verify no nested interactive elements
- Test with keyboard navigation

---

## Violation #7: Scrollable Region Focusability (Serious)
**WCAG Criterion:** 2.1.1 Keyboard  
**Pages Affected:** 1  
**Total Occurrences:** 1  
**Severity:** Serious

### Page: `/eligibility`

#### Issue Description
Scrollable content area is not keyboard accessible.

#### Affected Element
- `div:nth-child(11) > div:nth-child(2)` - Likely map container div

#### Root Cause
Scrollable div has `overflow: auto` or `overflow: scroll` but no `tabindex` to make it focusable.

#### Remediation Steps

**Step 1: Add tabindex to scrollable container**
```html
<!-- Before -->
<div style="overflow: auto; height: 400px;">
  <!-- Scrollable content -->
</div>

<!-- After -->
<div style="overflow: auto; height: 400px;" tabindex="0">
  <!-- Scrollable content -->
</div>
```

**Step 2: Add keyboard instructions**
```html
<div style="overflow: auto; height: 400px;" tabindex="0" role="region" aria-label="Scrollable content">
  <!-- Scrollable content -->
</div>
```

**Step 3: CSS approach**
```css
.scrollable-region {
  overflow: auto;
  height: 400px;
  outline: none; /* Remove default outline if desired */
}

.scrollable-region:focus {
  outline: 2px solid #4CAF50; /* Add visible focus indicator */
}
```

#### Verification
- Tab to scrollable region
- Verify it receives focus (visible focus indicator)
- Test scrolling with arrow keys

---

## Violation #8: Tabindex Issues (Serious)
**WCAG Criterion:** 2.4.3 Focus Order  
**Pages Affected:** 1  
**Total Occurrences:** 7  
**Severity:** Serious

### Page: `/eligibility`

#### Issue Description
Multiple elements have `tabindex` values greater than 0, which disrupts natural tab order.

#### Affected Elements
- `iframe #map` (tabindex > 0)
- `iframe #dijit__WidgetBase_0` (tabindex > 0)
- `iframe #widgets_Search_Widget_20` (tabindex > 0)
- `iframe #widgets_ZoomSlider_Widget_21` (tabindex > 0)
- `iframe #widgets_HomeButton_Widget_22` (tabindex > 0)
- `iframe #widgets_Scalebar_Widget_24` (tabindex > 0)
- `iframe #skipContainer` (tabindex > 0)

#### Root Cause
Esri map widgets use positive tabindex values (e.g., `tabindex="101"`) to control focus order.

#### Remediation Steps

**Step 1: Change tabindex values**
```html
<!-- Before -->
<iframe id="map" tabindex="101"></iframe>
<iframe id="widgets_Search_Widget_20" tabindex="102"></iframe>

<!-- After -->
<iframe id="map" tabindex="0"></iframe>
<iframe id="widgets_Search_Widget_20" tabindex="0"></iframe>
```

**Step 2: Use CSS order property**
```css
.map-container {
  display: flex;
  flex-direction: column;
}

.map-widget {
  order: 1; /* Control visual order with CSS */
}

.search-widget {
  order: 2;
}
```

**Step 3: Configure Esri widget**
```javascript
const map = new Map({
  basemap: "streets-v11",
  container: "map"
});

// Esri widgets should use tabindex="0" or "-1"
const search = new Search({
  view: view,
  // Check for tabindex configuration option
});
```

#### Verification
- Inspect elements with DevTools
- Verify all tabindex values are 0 or -1
- Test tab order with keyboard navigation
- Ensure focus order is logical

---

## Violation #9: Link Name Issues (Serious)
**WCAG Criterion:** 2.4.4 Link Purpose (In Context)  
**Pages Affected:** 1  
**Total Occurrences:** 1  
**Severity:** Serious

### Page: `/faqs/2025-r3-frequently-asked-questions`

#### Issue Description
Link element has no discernible text or aria-label.

#### Affected Element
- `p:nth-child(41) > a:nth-child(1)` - Link without text

#### Root Cause
Link element is empty or contains only whitespace/icon without text alternative.

#### Remediation Steps

**Step 1: Add link text**
```html
<!-- Before -->
<p>
  <a href="/resources/document.pdf"></a>
</p>

<!-- After -->
<p>
  <a href="/resources/document.pdf">Download Document</a>
</p>
```

**Step 2: Or add aria-label**
```html
<!-- Before -->
<p>
  <a href="/resources/document.pdf"><i class="icon-download"></i></a>
</p>

<!-- After -->
<p>
  <a href="/resources/document.pdf" aria-label="Download Document"><i class="icon-download"></i></a>
</p>
```

**Step 3: Use aria-labelledby**
```html
<p id="download-label">Download the FAQ document</p>
<a href="/resources/document.pdf" aria-labelledby="download-label">
  <i class="icon-download"></i>
</a>
```

#### Verification
- Link text is visible and descriptive
- Screen reader announces link purpose
- Link purpose is clear in context

---

## Violation #10: Heading Order Issues (Serious)
**WCAG Criterion:** 1.3.1 Info and Relationships  
**Pages Affected:** 1  
**Total Occurrences:** 1  
**Severity:** Serious

### Page: `/resources/r3-nofo-instructions-and-appendices`

#### Issue Description
Heading hierarchy is not semantically correct (skips heading levels).

#### Affected Element
- `#sfy2025-r3-nofo-instructions` - Heading with incorrect level

#### Root Cause
Heading levels skip (e.g., h1 → h3, missing h2) or start at wrong level.

#### Remediation Steps

**Step 1: Identify heading structure**
```html
<!-- Before (Invalid) -->
<h1>R3 NOFO Instructions</h1>
<h3>Section 1: Overview</h3>  <!-- Skips h2 -->
<h3>Section 2: Requirements</h3>
<h4>Subsection 2.1</h4>

<!-- After (Valid) -->
<h1>R3 NOFO Instructions</h1>
<h2>Section 1: Overview</h2>
<h2>Section 2: Requirements</h2>
<h3>Subsection 2.1</h3>
```

**Step 2: Fix heading levels**
```html
<!-- Ensure sequential hierarchy -->
<h1>Main Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>
```

**Step 3: Use heading checker tool**
- WebAIM Heading Checker: https://webaim.org/articles/screenreader_testing/#headings
- Axe DevTools heading audit
- WAVE browser extension

#### Verification
- Document outline is logical and sequential
- No heading levels are skipped
- Screen reader announces correct heading levels

---

## Summary Table

| Violation | Pages | Count | Severity | Effort | Priority |
|-----------|-------|-------|----------|--------|----------|
| Color Contrast | 2 | 38 | Serious | Medium | High |
| ARIA Required Attr | 1 | 1 | Critical | Low | Critical |
| ARIA Hidden Focus | 1 | 1 | Serious | Medium | High |
| ARIA Prohibited Attr | 1 | 2 | Serious | High | High |
| Form Label | 1 | 1 | Serious | High | High |
| Nested Interactive | 1 | 1 | Serious | High | High |
| Scrollable Region | 1 | 1 | Serious | Low | Medium |
| Tabindex | 1 | 7 | Serious | Medium | High |
| Link Name | 1 | 1 | Serious | Low | Medium |
| Heading Order | 1 | 1 | Serious | Low | Medium |

---

**Last Updated:** December 12, 2025  
**Next Review:** January 12, 2026

