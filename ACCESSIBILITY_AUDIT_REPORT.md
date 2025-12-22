# ICJIA R3 Website - Comprehensive Accessibility Audit Report
**WCAG 2.1 Level AA Compliance Assessment**

**Audit Date:** December 12, 2025  
**Testing Tool:** Axe DevTools (axe-core 4.10.3)  
**Testing Environment:** Local development server (http://localhost:8000)  
**Total Pages Audited:** 35 pages  
**Audit Status:** ✅ COMPLETE

---

## Executive Summary

The ICJIA R3 website has been comprehensively audited for WCAG 2.1 Level AA compliance using automated accessibility testing with Axe DevTools. The audit identified **11 total violations** across **5 pages**, with the majority of pages (30 out of 35) passing all automated accessibility checks.

### Key Metrics
- **Total Pages Tested:** 35
- **Pages with Violations:** 5 (14.3%)
- **Pages with No Violations:** 30 (85.7%)
- **Total Violations Found:** 11
- **Unique Violation Rules:** 10
- **Total Passed Checks:** 1,415
- **Incomplete Checks:** 12
- **Inapplicable Checks:** 1,698

### Violation Severity Breakdown
| Severity | Count | Pages Affected |
|----------|-------|----------------|
| **Critical** | 1 | 1 |
| **Serious** | 10 | 4 |
| **Moderate** | 0 | 0 |
| **Minor** | 0 | 0 |

---

## Detailed Violation Analysis

### 1. **Color Contrast Issues** (Serious)
**WCAG Criterion:** 1.4.3 Contrast (Minimum)  
**Impact Level:** Serious  
**Total Occurrences:** 38 across 2 pages

#### Affected Pages:
1. **`/accessibility/audit-log`** - 37 violations
   - **Issue:** Text on colored backgrounds (success, warning, info) lacks sufficient contrast
   - **Affected Elements:** 
     - `.bg-success.text-center.pa-4` (green background with text)
     - `.bg-warning` (yellow background with text)
     - `.bg-info.text-center.pa-4` (blue background with text)
     - Table cells with colored backgrounds
   - **Root Cause:** Vuetify theme colors combined with text colors don't meet WCAG AA 4.5:1 ratio for normal text
   - **Remediation:**
     - Increase text color darkness or reduce background color brightness
     - Use contrast checker tools to verify 4.5:1 minimum ratio
     - Consider using darker text colors on light backgrounds
     - Update Vuetify theme configuration for better contrast

2. **`/contact`** - 1 violation
   - **Issue:** `.white-text` class on colored background
   - **Affected Element:** White text on insufficient contrast background
   - **Remediation:** Change text color to darker shade or adjust background color

---

### 2. **ARIA Required Attributes** (Critical)
**WCAG Criterion:** 4.1.2 Name, Role, Value  
**Impact Level:** Critical  
**Total Occurrences:** 1 on 1 page

#### Affected Page:
- **`/contact`** - 1 violation
  - **Issue:** `.v-field--active` element missing required ARIA attributes
  - **Root Cause:** Vuetify form field component not properly configured with ARIA attributes
  - **Remediation:**
    - Add `aria-label` or `aria-labelledby` to form fields
    - Ensure all form inputs have associated labels
    - Review Vuetify form component configuration

---

### 3. **ARIA Hidden Focus** (Serious)
**WCAG Criterion:** 4.1.2 Name, Role, Value  
**Impact Level:** Serious  
**Total Occurrences:** 1 on 1 page

#### Affected Page:
- **`/eligibility`** - 1 violation
  - **Issue:** `aria-hidden="true"` element is focusable (tabindex="101")
  - **Affected Element:** `iframe #skip_map` - "Skip to Map" link
  - **Root Cause:** Esri map widget skip link has aria-hidden but is still in tab order
  - **Remediation:**
    - Remove `aria-hidden` attribute if element should be accessible
    - OR set `tabindex="-1"` to remove from tab order
    - Coordinate with Esri map widget configuration

---

### 4. **ARIA Prohibited Attributes** (Serious)
**WCAG Criterion:** 4.1.2 Name, Role, Value  
**Impact Level:** Serious  
**Total Occurrences:** 2 on 1 page

#### Affected Page:
- **`/eligibility`** - 2 violations
  - **Issue:** ARIA attributes used on elements where they're not permitted
  - **Affected Elements:**
    - `iframe #skipContainer`
    - `iframe .lastTrapLinkNode`
  - **Root Cause:** Esri map widget using ARIA attributes on iframe elements
  - **Remediation:**
    - Review Esri widget ARIA implementation
    - Remove prohibited ARIA attributes from iframe elements
    - Ensure proper ARIA usage per HTML spec

---

### 5. **Form Label Issues** (Serious)
**WCAG Criterion:** 1.3.1 Info and Relationships / 3.3.2 Labels or Instructions  
**Impact Level:** Serious  
**Total Occurrences:** 1 on 1 page

#### Affected Page:
- **`/eligibility`** - 1 violation
  - **Issue:** Form input lacks visible label (title-only labeling)
  - **Affected Element:** `iframe #esri_dijit_Search_0_input` - Esri search widget
  - **Root Cause:** Esri search widget uses title attribute instead of visible label
  - **Remediation:**
    - Add visible label to search input
    - Use `<label>` element associated with input
    - Configure Esri widget to include visible labels

---

### 6. **Nested Interactive Elements** (Serious)
**WCAG Criterion:** 4.1.2 Name, Role, Value  
**Impact Level:** Serious  
**Total Occurrences:** 1 on 1 page

#### Affected Page:
- **`/eligibility`** - 1 violation
  - **Issue:** Interactive controls nested within other interactive elements
  - **Affected Element:** `iframe #widgets_HomeButton_Widget_22` - Esri home button
  - **Root Cause:** Esri map widget structure has nested interactive elements
  - **Remediation:**
    - Restructure widget to avoid nesting
    - Ensure only one interactive element per control
    - Review Esri widget documentation for accessibility options

---

### 7. **Scrollable Region Focusability** (Serious)
**WCAG Criterion:** 2.1.1 Keyboard  
**Impact Level:** Serious  
**Total Occurrences:** 1 on 1 page

#### Affected Page:
- **`/eligibility`** - 1 violation
  - **Issue:** Scrollable content area not keyboard accessible
  - **Affected Element:** `div:nth-child(11) > div:nth-child(2)` - Likely map container
  - **Root Cause:** Scrollable div without keyboard focus capability
  - **Remediation:**
    - Add `tabindex="0"` to scrollable container
    - Ensure keyboard navigation works for scrollable regions
    - Test with keyboard-only navigation

---

### 8. **Tabindex Issues** (Serious)
**WCAG Criterion:** 2.4.3 Focus Order  
**Impact Level:** Serious  
**Total Occurrences:** 7 on 1 page

#### Affected Page:
- **`/eligibility`** - 7 violations
  - **Issue:** `tabindex` values greater than 0 (should be -1 or 0 only)
  - **Affected Elements:**
    - `iframe #map` (tabindex > 0)
    - `iframe #dijit__WidgetBase_0` (tabindex > 0)
    - `iframe #widgets_Search_Widget_20` (tabindex > 0)
    - `iframe #widgets_ZoomSlider_Widget_21` (tabindex > 0)
    - `iframe #widgets_HomeButton_Widget_22` (tabindex > 0)
    - `iframe #widgets_Scalebar_Widget_24` (tabindex > 0)
    - `iframe #skipContainer` (tabindex > 0)
  - **Root Cause:** Esri map widgets using positive tabindex values
  - **Remediation:**
    - Change all positive tabindex values to 0 or -1
    - Use CSS `order` property for visual ordering instead
    - Configure Esri widgets to use proper tabindex values

---

### 9. **Link Name Issues** (Serious)
**WCAG Criterion:** 2.4.4 Link Purpose (In Context)  
**Impact Level:** Serious  
**Total Occurrences:** 1 on 1 page

#### Affected Page:
- **`/faqs/2025-r3-frequently-asked-questions`** - 1 violation
  - **Issue:** Link without discernible text
  - **Affected Element:** `p:nth-child(41) > a:nth-child(1)`
  - **Root Cause:** Link element with no text content or aria-label
  - **Remediation:**
    - Add descriptive text to link
    - OR add `aria-label` with descriptive text
    - Ensure all links have clear, descriptive text

---

### 10. **Heading Order Issues** (Serious)
**WCAG Criterion:** 1.3.1 Info and Relationships  
**Impact Level:** Serious  
**Total Occurrences:** 1 on 1 page

#### Affected Page:
- **`/resources/r3-nofo-instructions-and-appendices`** - 1 violation
  - **Issue:** Heading hierarchy not semantically correct
  - **Affected Element:** `#sfy2025-r3-nofo-instructions`
  - **Root Cause:** Heading levels skip (e.g., h1 → h3, missing h2)
  - **Remediation:**
    - Ensure heading hierarchy is sequential (h1 → h2 → h3, etc.)
    - Don't skip heading levels
    - Use proper heading structure for document outline

---

## Pages with Violations Summary

| Page | URL | Violations | Violation Types |
|------|-----|-----------|-----------------|
| Accessibility Audit Log | `/accessibility/audit-log` | 1 | color-contrast |
| Contact | `/contact` | 2 | aria-required-attr, color-contrast |
| Eligibility | `/eligibility` | 6 | aria-hidden-focus, aria-prohibited-attr, label-title-only, nested-interactive, scrollable-region-focusable, tabindex |
| FAQs - 2025 Questions | `/faqs/2025-r3-frequently-asked-questions` | 1 | link-name |
| Resources - NOFO Instructions | `/resources/r3-nofo-instructions-and-appendices` | 1 | heading-order |

---

## Pages with No Violations (30 pages)

✅ All of the following pages passed automated accessibility testing:

- `/` (Home)
- `/board`
- `/collaboratives`
- `/funding`
- `/meetings`
- `/privacy`
- `/news/r3-2022-annual-report`
- `/news/2023-04-06-annual-report-2023`
- `/news/r3-2021-annual-report`
- `/news/2021-01-21-release`
- `/news/2022-06-23-r3-grants-list`
- `/news/icjia-awards-35-million-in-restore-reinvest-and-renew-r3-program-grants`
- `/faqs/03-08-24-2025-r3-nofo-applicant-questions`
- `/faqs/03-15-24-2025-r3-nofo-applicant-questions`
- `/faqs/03-22-24-2025-r3-nofo-applicant-questions`
- `/faqs/03-29-24-2025-r3-nofo-applicant-questions`
- `/faqs/04-05-24-2025-r3-nofo-applicant-questions`
- `/faqs/04-12-24-2025-r3-nofo-applicant-questions`
- `/faqs/04-19-24-2025-r3-nofo-applicant-questions`
- `/faqs/04-26-24-2025-r3-nofo-applicant-questions`
- `/resources/spanish-language-materials`
- `/resources/video-resources`
- `/resources/ampli-fund-portal-guide-and-tip-sheet`
- `/resources/nofo-informational-webinars`
- `/resources/prequalification-steps`
- `/search`
- `/translate`
- `/resources`
- `/resources/single-page`
- `/faqs`

---

## Remediation Priority Matrix

### Priority 1: Critical Issues (Must Fix)
1. **ARIA Required Attributes** (`/contact`)
   - **Effort:** Low
   - **Impact:** High
   - **Timeline:** Immediate

### Priority 2: High-Impact Serious Issues (Should Fix)
1. **Color Contrast** (`/accessibility/audit-log`, `/contact`)
   - **Effort:** Medium
   - **Impact:** High
   - **Timeline:** 1-2 weeks

2. **Esri Map Widget Issues** (`/eligibility`)
   - **Effort:** High (requires Esri widget configuration)
   - **Impact:** High
   - **Timeline:** 2-4 weeks

### Priority 3: Content-Specific Issues (Should Fix)
1. **Link Name** (`/faqs/2025-r3-frequently-asked-questions`)
   - **Effort:** Low
   - **Impact:** Medium
   - **Timeline:** 1 week

2. **Heading Order** (`/resources/r3-nofo-instructions-and-appendices`)
   - **Effort:** Low
   - **Impact:** Medium
   - **Timeline:** 1 week

---

## Important Notes

### Automated Testing Limitations
⚠️ **Important:** Axe DevTools can only detect 20-50% of accessibility issues. This report covers automated findings only. Additional manual testing is required for:
- Keyboard navigation
- Screen reader compatibility
- Color blindness simulation
- Cognitive accessibility
- Mobile accessibility
- Touch target sizing
- Focus management
- ARIA live regions

### Esri Map Widget Considerations
The `/eligibility` page contains an Esri ArcGIS map widget which accounts for 6 of the 11 violations. These issues are primarily within the third-party widget's iframe and may require:
- Esri widget configuration updates
- Custom wrapper components
- Alternative accessibility approaches
- Vendor coordination

### Vuetify Component Issues
Color contrast issues on `/accessibility/audit-log` are related to Vuetify theme colors. Consider:
- Updating Vuetify theme configuration
- Using higher contrast color combinations
- Testing with WCAG contrast checker tools

---

## Recommendations

### Immediate Actions (Week 1)
1. Fix ARIA required attributes on `/contact` form
2. Add visible label to link on `/faqs/2025-r3-frequently-asked-questions`
3. Fix heading hierarchy on `/resources/r3-nofo-instructions-and-appendices`

### Short-term Actions (Weeks 2-4)
1. Improve color contrast on `/accessibility/audit-log`
2. Investigate Esri map widget accessibility options
3. Implement keyboard navigation testing

### Long-term Actions (Ongoing)
1. Establish accessibility testing in CI/CD pipeline
2. Conduct manual accessibility audit
3. Implement accessibility training for development team
4. Regular automated testing (monthly)

---

## Testing Methodology

- **Tool:** Axe DevTools (axe-core 4.10.3)
- **Standard:** WCAG 2.1 Level AA
- **Browser:** Chrome Headless
- **Environment:** Local development server
- **Date:** December 12, 2025
- **Duration:** ~2 hours
- **Pages Tested:** 35

---

## Audit Files

All detailed audit reports are available in `/public/a11y/`:
- `axe-summary.json` - Aggregated summary
- `axe-local-*.json` - Individual page reports

---

**Report Generated:** December 12, 2025  
**Next Audit Recommended:** January 12, 2026 (Monthly)

