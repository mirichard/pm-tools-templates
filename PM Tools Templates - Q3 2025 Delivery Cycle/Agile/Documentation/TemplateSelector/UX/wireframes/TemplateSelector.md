# Template Selector Wireframes
## PM Tools Templates - Q3 2025 Delivery Cycle

### 1. Main Layout
```
+------------------------------------------+
|             Header Navigation             |
+------------------------------------------+
|  Search  | Filters | View | Sort | Help   |
+------------------------------------------+
|                                          |
|   +--------+  +--------+  +--------+     |
|   | Card 1 |  | Card 2 |  | Card 3 |     |
|   +--------+  +--------+  +--------+     |
|                                          |
|   +--------+  +--------+  +--------+     |
|   | Card 4 |  | Card 5 |  | Card 6 |     |
|   +--------+  +--------+  +--------+     |
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
| 🔍 Search...  | 🔽 Filters | ⚡ Quick Find |
+------------------------------------------+
| Active Filters:                          |
| [Agile ×] [Planning ×] [Beginner ×]     |
+------------------------------------------+
```

### 4. Filter Panel
```
+------------------------------------------+
| Filters                          [Clear] |
|------------------------------------------|
| Methodology                              |
| ☐ Agile                                 |
| ☐ Waterfall                             |
| ☐ Hybrid                                |
|------------------------------------------|
| Category                                 |
| ☐ Planning                              |
| ☐ Execution                             |
| ☐ Monitoring                            |
|------------------------------------------|
| Complexity                               |
| ☐ Beginner                              |
| ☐ Intermediate                          |
| ☐ Advanced                              |
+------------------------------------------+
```

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
| [Card 1]                                 |
|------------------------------------------|
| [Card 2]                                 |
|------------------------------------------|
| [Card 3]                                 |
+------------------------------------------+
```

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

### 10. Interaction States

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

### 11. Responsive Breakpoints

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

### 12. Animation Specifications

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

### 13. Accessibility Features

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

### 14. Loading States

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

### 15. Error States

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

### 16. Success States

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
