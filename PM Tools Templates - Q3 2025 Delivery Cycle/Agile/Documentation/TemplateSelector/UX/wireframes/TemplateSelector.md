# Template Selector Wireframes
## PM Tools Templates - Q3 2025 Delivery Cycle

### 1. Main Layout
```
+------------------------------------------+
|             Header Navigation             |
+------------------------------------------+
|  Search  | Filters | Find | Sort | Help   |
+------------------------------------------+
|            Filters applied: Agile ×       |
+------------------------------------------+
|                                          |
|   +──────────+  +──────────+  +──────────+   |
|   | Card 1   |  | Card 2   |  | Card 3   |   |
|   | Loading... | Loading... | Loading... |   |
|   +──────────+  +──────────+  +──────────+   |
|                                          |
|   +──────────+  +──────────+  +──────────+   |
|   | Card 4   |  | Card 5   |  | Card 6   |   |
|   | Loading... | Loading... | Loading... |   |
|   +──────────+  +──────────+  +──────────+   |
|                                          |
+------------------------------------------+
|           Pagination / Load More          |
+------------------------------------------+
```

### 2. Template Card
```
+----------------------------------------+
|  [Icon] Template Name          [Star]   |
|----------------------------------------|
|  Description text...                    |
|  Continues here...                      |
|----------------------------------------|
|  [Method]  [Category]  [Complexity]     |
|----------------------------------------|
|  Rating: ★★★★☆  |  Used: 1.2k times    |
+----------------------------------------+
```

### 3. Search & Filter Bar
```
+------------------------------------------+
| 🔍 Search | Filters | Quick Find | ℹ Info |
+------------------------------------------+
| Active Filters: Agile ×, Planning ×        |
|------------------------------------------|
| Filters applied (3)                      |
+------------------------------------------+
```
*Filter status and quick information are clearly displayed.

### 4. Filter Panel
```
+-------------------------------------------+
| Filters                           [?]Help |
|-------------------------------------------|
| Methodology                               |
| ▼ Agile                                   |
|   ☐ Planning                              |
|   ☐ Execution                             |
|   ☐ Monitoring                            |
|                                           |
| ▼ Waterfall                               |
|   ☐ Planning                              |
|   ☐ Execution                             |
|   ☐ Monitoring                            |
|                                           |
| ➤ More...                                 |
+-------------------------------------------+
```
*Note: Only the top three categories are expanded, with icons explained in tooltips.

### 5. Template Preview
```
+------------------------------------------+
| Template Preview               [×] Close  |
|------------------------------------------|
| Project Charter Template                  |
|------------------------------------------|
| Preview Content                           |
| ...                                      |
| ...                                      |
|------------------------------------------|
| [Download] [Use Template] [Share]        |
+------------------------------------------+
```

### 6. Mobile Layout
```
+------------------------------------------+
| 🔍 Search...                    [Filters] |
+------------------------------------------+
|  Recommended for you                     |
| +-------------------------------------+  |
| | [Card 1]   Project Charter          |  |
| | [Used 2.3k times]                   |  |
| +-------------------------------------+  |
| +-------------------------------------+  |
| | [Card 2]   Risk Register            |  |
| | [Starred]                           |  |
| +-------------------------------------+  |
| +-------------------------------------+  |
| | [Card 3]   Schedule Management      |  |
| | [Frequently Used]                   |  |
| +-------------------------------------+  |
+------------------------------------------+
```
*Smart suggestions based on user behavior.

### 7. Progressive Disclosure Flow
```
Step 1: Methodology Selection
+------------------------------------------+
| Select Your Methodology                   |
|------------------------------------------|
| [Agile]  [Waterfall]  [Hybrid]          |
+------------------------------------------+

Step 2: Category Selection
+------------------------------------------+
| Select Template Category                  |
|------------------------------------------|
| [Planning]  [Execution]  [Monitoring]    |
+------------------------------------------+

Step 3: Template Grid
+------------------------------------------+
| Showing Agile Planning Templates         |
|------------------------------------------|
| [Template Cards...]                      |
+------------------------------------------+
```

### 8. List View
```
+------------------------------------------+
| Name         | Method | Category | Rating |
|------------------------------------------|
| Template 1   | Agile  | Planning | ★★★★☆ |
| Template 2   | Hybrid | Execute  | ★★★★★ |
| Template 3   | Water. | Monitor  | ★★★☆☆ |
+------------------------------------------+
```

### 9. Component Specifications

#### Color Palette & Contrast
- Primary Text: #1F2328 on #FFFFFF (contrast ratio 13.5:1)
- Secondary Text: #57606A on #FFFFFF (contrast ratio 7:1)
- Link Color: #0969DA on #FFFFFF (contrast ratio 5:1)
- Error Text: #CF222E on #FFFFFF (contrast ratio 5.5:1)
- Focus Outline: #0969DA with 2px stroke (meets WCAG 2.1 AA)

#### Icon System
- All icons must have visible text labels
- Tooltip appears on hover with extended description
- Minimum tap target size: 44x44px
- Icon color matches text for proper contrast

#### Template Card
- Height: 200px
- Width: 300px
- Padding: 16px
- Border: 1px solid #e1e4e8
- Border Radius: 6px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)

#### Search Bar
- Height: 40px
- Width: 100% (max 600px)
- Border Radius: 20px
- Padding: 8px 16px

#### Filter Tags
- Height: 24px
- Padding: 4px 8px
- Border Radius: 12px
- Background: #f6f8fa

#### Preview Modal
- Width: 80% (max 1200px)
- Height: 80vh
- Border Radius: 8px
- Padding: 24px

### 10. Keyboard Shortcuts

```
Global:
⌘/Ctrl + K: Open command palette
⌘/Ctrl + F: Focus search
⌘/Ctrl + /: Show keyboard shortcuts

Navigation:
→ ←: Move between cards
↑ ↓: Move between sections
Space/Enter: Select card
Esc: Close modals

Filters:
⌘/Ctrl + 1-9: Quick select category
⌘/Ctrl + 0: Clear all filters
```

### 11. Command Palette
```
+------------------------------------------+
|  🔍 Search templates, actions, and docs    |
|------------------------------------------|
|  Recent                                  |
|  > Create Project Charter                |
|  > Risk Register Template                |
|------------------------------------------|
|  Actions                                 |
|  > Clear all filters                     |
|  > Switch to list view                   |
|  > Show keyboard shortcuts               |
+------------------------------------------+
```

### 12. Interaction States

#### Template Card
```
Normal:
+------------------+
|    Template      |
+------------------+

Hover:
+==================+
|    Template ↗    |
+==================+

Selected:
+##################+
|    Template ✓    |
+##################+
```

#### Search Bar
```
Normal:
[🔍 Search templates...]

Focus:
[🔍 Search templates...   ⌘K]
Recent Searches:
- Project Charter
- Risk Register
```

#### Filter Button
```
Normal:   [Filters ▾]
Active:   [Filters ▾] (3)
Expanded: [Filters ▴]
          [Filter Panel]
```

### 13. Responsive Breakpoints

#### Desktop (1200px+)
- 4 cards per row
- Full sidebar
- Expanded search

#### Tablet (768px - 1199px)
- 2-3 cards per row
- Collapsible sidebar
- Compact search

#### Mobile (< 768px)
- 1 card per row
- Modal filters
- Full-width search

### 14. Animation Specifications

#### Card Hover
- Transform: translateY(-2px)
- Shadow: 0 4px 8px rgba(0,0,0,0.1)
- Duration: 200ms
- Easing: ease-out

#### Filter Panel
- Height: auto
- Transform: translateY(0)
- Duration: 300ms
- Easing: ease-in-out

#### Preview Modal
- Scale: 1
- Opacity: 1
- Duration: 250ms
- Easing: ease-in-out

### 15. Accessibility Features

#### Keyboard Navigation
```
Tab Order:
1. Search Bar
2. Filter Button
3. Template Cards (Left to Right)
4. Pagination Controls
```

#### Screen Reader Support
```
Template Card:
<article role="article" aria-label="Template: Project Charter">
  <h2>Project Charter</h2>
  <p>Description...</p>
  <div role="group" aria-label="Template metadata">
    ...
  </div>
</article>
```

#### Focus Indicators
```css
:focus {
  outline: 2px solid #0969da;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### 16. Loading States

#### Initial Load
```
+------------------+
|   ███████        |
|   ██████████     |
|   ████           |
+------------------+
```

#### Search Results
```
+------------------+
|   Searching...   |
|   [Progress Bar] |
+------------------+
```

#### Preview Load
```
+------------------+
|   Loading...     |
|   ⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏    |
+------------------+
```

### 17. Error States

#### Search Error
```
+------------------+
|      ⚠️          |
| Search failed.   |
| [Try Again]      |
+------------------+
```

#### Load Error
```
+------------------+
|      ❌          |
| Couldn't load    |
| templates.       |
| [Retry]          |
+------------------+
```

### 18. Success States

#### Selection Complete
```
+------------------+
|      ✅          |
| Template ready!  |
| [Start Using]    |
+------------------+
```

#### Filter Applied
```
+------------------+
| Filters applied  |
| Showing 24 of 86 |
+------------------+
```
