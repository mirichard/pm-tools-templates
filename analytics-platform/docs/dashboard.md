# Analytics Platform Dashboard Configuration

## Overview

This guide provides comprehensive instructions for configuring, customizing, and managing dashboards in the PM Tools Analytics Platform. Learn how to create effective visualizations, configure widgets, and optimize dashboard performance.

## Dashboard Architecture

### Dashboard Components
- **Widgets:** Individual visualization components (charts, tables, metrics)
- **Layout Engine:** Grid-based responsive layout system
- **Data Sources:** APIs, databases, and real-time streams
- **Filters:** Interactive controls for data filtering and drilling down
- **Actions:** Click handlers, navigation, and interaction behaviors

### Dashboard Types

#### Executive Dashboard
**Purpose:** High-level KPIs and strategic metrics
**Audience:** C-level executives, senior management
**Update Frequency:** Daily/Weekly
**Key Metrics:** Portfolio health, budget variance, strategic goal progress

#### Project Dashboard
**Purpose:** Detailed project performance and progress tracking
**Audience:** Project managers, team leads
**Update Frequency:** Real-time/Daily
**Key Metrics:** Sprint velocity, task completion, resource utilization

#### Team Dashboard
**Purpose:** Team performance and productivity insights
**Audience:** Team members, scrum masters
**Update Frequency:** Real-time
**Key Metrics:** Individual contributions, team collaboration, skill development

## Dashboard Configuration

### Basic Dashboard Structure
```json
{
  "dashboard_id": "exec_portfolio_overview",
  "name": "Executive Portfolio Overview",
  "description": "High-level view of portfolio performance and strategic metrics",
  "category": "executive",
  "layout": {
    "type": "grid",
    "columns": 12,
    "rows": 8,
    "responsive_breakpoints": {
      "desktop": 1200,
      "tablet": 768,
      "mobile": 480
    }
  },
  "refresh_settings": {
    "auto_refresh": true,
    "interval_minutes": 15,
    "refresh_on_focus": true
  },
  "access_control": {
    "roles": ["executive", "portfolio_manager"],
    "permissions": ["view", "export"],
    "sharing_enabled": true
  }
}
```

### Widget Configuration Schema
```json
{
  "widget_id": "portfolio_health_score",
  "type": "metric_card",
  "title": "Portfolio Health Score",
  "position": {
    "row": 1,
    "column": 1,
    "width": 3,
    "height": 2
  },
  "data_source": {
    "type": "api_endpoint",
    "url": "/api/v1/portfolio/health-score",
    "method": "GET",
    "refresh_interval": 300,
    "cache_ttl": 600
  },
  "visualization": {
    "display_type": "gauge",
    "value_field": "health_score",
    "min_value": 0,
    "max_value": 100,
    "color_thresholds": [
      {"min": 0, "max": 30, "color": "#ff4444"},
      {"min": 30, "max": 70, "color": "#ffaa00"},
      {"min": 70, "max": 100, "color": "#44aa44"}
    ],
    "format": {
      "type": "percentage",
      "decimal_places": 1
    }
  },
  "interactions": {
    "click_action": "drill_down",
    "drill_down_dashboard": "portfolio_details",
    "hover_tooltip": true
  }
}
```

## Widget Types and Configuration

### 1. Metric Cards
**Purpose:** Display single KPI values with trend indicators

```json
{
  "type": "metric_card",
  "config": {
    "primary_metric": {
      "field": "total_budget",
      "label": "Total Portfolio Budget",
      "format": "currency"
    },
    "comparison": {
      "field": "budget_change",
      "period": "previous_month",
      "display": "percentage_change"
    },
    "trend": {
      "field": "budget_trend",
      "periods": 12,
      "chart_type": "sparkline"
    },
    "alert_thresholds": {
      "warning": -10,
      "critical": -25
    }
  }
}
```

### 2. Chart Widgets
**Purpose:** Visual representation of data trends and relationships

#### Line Chart Configuration
```json
{
  "type": "line_chart",
  "config": {
    "x_axis": {
      "field": "date",
      "type": "datetime",
      "format": "MMM YYYY"
    },
    "y_axes": [
      {
        "field": "budget_spent",
        "label": "Budget Spent",
        "format": "currency",
        "color": "#1f77b4"
      },
      {
        "field": "budget_planned",
        "label": "Budget Planned", 
        "format": "currency",
        "color": "#ff7f0e",
        "line_style": "dashed"
      }
    ],
    "legend": {
      "position": "bottom",
      "show": true
    },
    "grid": {
      "show": true,
      "color": "#e0e0e0"
    },
    "zoom": {
      "enabled": true,
      "type": "x"
    }
  }
}
```

#### Bar Chart Configuration
```json
{
  "type": "bar_chart",
  "config": {
    "orientation": "vertical",
    "categories": {
      "field": "project_name",
      "sort": "value_desc"
    },
    "values": {
      "field": "completion_percentage",
      "format": "percentage"
    },
    "colors": {
      "type": "conditional",
      "conditions": [
        {"condition": "value >= 90", "color": "#4caf50"},
        {"condition": "value >= 70", "color": "#ff9800"},
        {"condition": "value < 70", "color": "#f44336"}
      ]
    },
    "labels": {
      "show": true,
      "position": "top"
    }
  }
}
```

### 3. Table Widgets
**Purpose:** Detailed data display with sorting and filtering

```json
{
  "type": "data_table",
  "config": {
    "columns": [
      {
        "field": "project_name",
        "title": "Project Name",
        "width": "200px",
        "sortable": true,
        "searchable": true
      },
      {
        "field": "status",
        "title": "Status",
        "width": "100px",
        "sortable": true,
        "render": "status_badge"
      },
      {
        "field": "budget_variance",
        "title": "Budget Variance",
        "width": "120px",
        "sortable": true,
        "format": "percentage",
        "conditional_formatting": {
          "positive": {"color": "#4caf50"},
          "negative": {"color": "#f44336"}
        }
      }
    ],
    "pagination": {
      "enabled": true,
      "page_size": 20,
      "show_size_selector": true
    },
    "sorting": {
      "default_sort": "project_name",
      "default_order": "asc"
    },
    "export": {
      "enabled": true,
      "formats": ["csv", "excel", "pdf"]
    }
  }
}
```

### 4. Map Widgets
**Purpose:** Geographical data visualization

```json
{
  "type": "choropleth_map",
  "config": {
    "map_data": "world_countries",
    "location_field": "country_code",
    "value_field": "project_count",
    "color_scale": {
      "type": "sequential",
      "scheme": "Blues",
      "steps": 5
    },
    "tooltip": {
      "fields": ["country_name", "project_count", "total_budget"],
      "format": {
        "total_budget": "currency"
      }
    },
    "zoom": {
      "enabled": true,
      "initial_zoom": 1,
      "center": [0, 20]
    }
  }
}
```

## Advanced Dashboard Features

### 1. Interactive Filters
```json
{
  "dashboard_filters": [
    {
      "filter_id": "date_range",
      "type": "date_range_picker",
      "label": "Date Range",
      "default_value": {
        "start": "2024-01-01",
        "end": "2024-12-31"
      },
      "applies_to": ["all_widgets"],
      "position": {
        "area": "header",
        "order": 1
      }
    },
    {
      "filter_id": "project_status",
      "type": "multi_select",
      "label": "Project Status",
      "options": [
        {"value": "active", "label": "Active"},
        {"value": "completed", "label": "Completed"},
        {"value": "on_hold", "label": "On Hold"}
      ],
      "default_value": ["active"],
      "applies_to": ["project_list", "status_chart"],
      "position": {
        "area": "sidebar",
        "order": 1
      }
    }
  ]
}
```

### 2. Drill-Down Navigation
```json
{
  "drill_down_config": {
    "source_widget": "portfolio_overview_chart",
    "target_dashboard": "project_details",
    "parameter_mapping": {
      "project_id": "clicked_project_id",
      "date_range": "current_filter_date_range"
    },
    "navigation_type": "modal",
    "modal_config": {
      "width": "80%",
      "height": "70%",
      "resizable": true
    }
  }
}
```

### 3. Real-Time Data Streaming
```json
{
  "real_time_config": {
    "enabled": true,
    "websocket_endpoint": "wss://api.pmtools.com/ws/dashboard",
    "subscription_channels": [
      "project.metrics.updates",
      "team.activity.events"
    ],
    "update_strategy": "incremental",
    "buffer_size": 1000,
    "auto_scroll": true
  }
}
```

## Dashboard Templates

### Executive Portfolio Template
```json
{
  "template_id": "executive_portfolio",
  "name": "Executive Portfolio Dashboard",
  "category": "executive",
  "layout": {
    "columns": 12,
    "rows": 10
  },
  "widgets": [
    {
      "type": "metric_card",
      "title": "Total Portfolio Value",
      "position": {"row": 1, "col": 1, "width": 3, "height": 2},
      "data_source": "/api/portfolio/total-value"
    },
    {
      "type": "metric_card", 
      "title": "Active Projects",
      "position": {"row": 1, "col": 4, "width": 3, "height": 2},
      "data_source": "/api/portfolio/project-count"
    },
    {
      "type": "donut_chart",
      "title": "Projects by Status",
      "position": {"row": 1, "col": 7, "width": 6, "height": 4},
      "data_source": "/api/portfolio/status-distribution"
    },
    {
      "type": "line_chart",
      "title": "Budget vs Actual Spending",
      "position": {"row": 3, "col": 1, "width": 6, "height": 4},
      "data_source": "/api/portfolio/budget-trends"
    },
    {
      "type": "data_table",
      "title": "Top 10 Projects by Value",
      "position": {"row": 5, "col": 1, "width": 12, "height": 6},
      "data_source": "/api/portfolio/top-projects"
    }
  ]
}
```

### Project Manager Template
```json
{
  "template_id": "project_manager",
  "name": "Project Manager Dashboard",
  "category": "project_management",
  "layout": {
    "columns": 12,
    "rows": 12
  },
  "widgets": [
    {
      "type": "metric_card",
      "title": "Sprint Velocity",
      "position": {"row": 1, "col": 1, "width": 3, "height": 2}
    },
    {
      "type": "metric_card",
      "title": "Story Points Completed",
      "position": {"row": 1, "col": 4, "width": 3, "height": 2}
    },
    {
      "type": "metric_card",
      "title": "Team Capacity",
      "position": {"row": 1, "col": 7, "width": 3, "height": 2}
    },
    {
      "type": "metric_card",
      "title": "Quality Score",
      "position": {"row": 1, "col": 10, "width": 3, "height": 2}
    },
    {
      "type": "burndown_chart",
      "title": "Sprint Burndown",
      "position": {"row": 3, "col": 1, "width": 6, "height": 4}
    },
    {
      "type": "velocity_chart",
      "title": "Team Velocity Trend",
      "position": {"row": 3, "col": 7, "width": 6, "height": 4}
    },
    {
      "type": "kanban_board",
      "title": "Current Sprint Board",
      "position": {"row": 7, "col": 1, "width": 12, "height": 6}
    }
  ]
}
```

## Dashboard Performance Optimization

### 1. Data Caching Strategy
```python
# Backend caching implementation
from functools import wraps
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_dashboard_data(cache_key_pattern, ttl=300):
    def decorator(func):
        @wraps(func)
        def wrapper(dashboard_id, widget_id, *args, **kwargs):
            cache_key = cache_key_pattern.format(
                dashboard_id=dashboard_id,
                widget_id=widget_id
            )
            
            # Try cache first
            cached_data = redis_client.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
            
            # Generate data and cache
            data = func(dashboard_id, widget_id, *args, **kwargs)
            redis_client.setex(cache_key, ttl, json.dumps(data))
            
            return data
        return wrapper
    return decorator

@cache_dashboard_data("dashboard:{dashboard_id}:widget:{widget_id}", ttl=600)
def get_widget_data(dashboard_id, widget_id, filters=None):
    # Expensive data generation logic
    return generate_widget_data(dashboard_id, widget_id, filters)
```

### 2. Lazy Loading Implementation
```typescript
// Frontend lazy loading
interface WidgetProps {
  config: WidgetConfig;
  visible: boolean;
}

const LazyWidget: React.FC<WidgetProps> = ({ config, visible }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible && !data && !loading) {
      loadWidgetData();
    }
  }, [visible, data, loading]);

  const loadWidgetData = async () => {
    setLoading(true);
    try {
      const response = await fetch(config.data_source.url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) {
    return <div className="widget-placeholder">Widget not visible</div>;
  }

  if (loading) {
    return <WidgetSkeleton />;
  }

  if (error) {
    return <WidgetError message={error} onRetry={loadWidgetData} />;
  }

  return <WidgetRenderer config={config} data={data} />;
};
```

### 3. Progressive Data Loading
```javascript
// Progressive data loading for large datasets
class ProgressiveDataLoader {
  constructor(dataSource, pageSize = 100) {
    this.dataSource = dataSource;
    this.pageSize = pageSize;
    this.loadedData = [];
    this.isLoading = false;
    this.hasMore = true;
  }

  async loadNextPage() {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;
    try {
      const offset = this.loadedData.length;
      const response = await fetch(
        `${this.dataSource}?offset=${offset}&limit=${this.pageSize}`
      );
      const newData = await response.json();

      this.loadedData.push(...newData.items);
      this.hasMore = newData.has_more;

      return newData.items;
    } finally {
      this.isLoading = false;
    }
  }

  getAllLoadedData() {
    return this.loadedData;
  }
}
```

## Dashboard Customization

### 1. Theme Configuration
```json
{
  "theme": {
    "name": "corporate_blue",
    "colors": {
      "primary": "#1976d2",
      "secondary": "#424242",
      "success": "#4caf50",
      "warning": "#ff9800",
      "error": "#f44336",
      "background": "#fafafa",
      "surface": "#ffffff",
      "text_primary": "#212121",
      "text_secondary": "#757575"
    },
    "typography": {
      "font_family": "Roboto, Arial, sans-serif",
      "font_sizes": {
        "small": "12px",
        "medium": "14px",
        "large": "16px",
        "xlarge": "20px"
      },
      "font_weights": {
        "normal": 400,
        "medium": 500,
        "bold": 700
      }
    },
    "spacing": {
      "xs": "4px",
      "sm": "8px",
      "md": "16px",
      "lg": "24px",
      "xl": "32px"
    },
    "borders": {
      "radius": "4px",
      "width": "1px",
      "color": "#e0e0e0"
    }
  }
}
```

### 2. Custom Widget Development
```typescript
// Custom widget interface
interface CustomWidgetProps {
  config: WidgetConfig;
  data: any;
  theme: Theme;
  onInteraction?: (interaction: WidgetInteraction) => void;
}

// Example custom widget implementation
const BurndownChart: React.FC<CustomWidgetProps> = ({ 
  config, 
  data, 
  theme, 
  onInteraction 
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current && data) {
      renderBurndownChart(chartRef.current, data, config, theme);
    }
  }, [data, config, theme]);

  const handleChartClick = (event: MouseEvent) => {
    const clickedPoint = getClickedDataPoint(event, chartRef.current);
    if (clickedPoint && onInteraction) {
      onInteraction({
        type: 'click',
        data: clickedPoint,
        widget_id: config.widget_id
      });
    }
  };

  return (
    <div className="custom-widget burndown-chart">
      <div className="widget-header">
        <h3>{config.title}</h3>
        <WidgetActions config={config} />
      </div>
      <div className="widget-content">
        <canvas
          ref={chartRef}
          onClick={handleChartClick}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

// Register custom widget
WidgetRegistry.register('burndown_chart', BurndownChart);
```

## Dashboard Sharing and Export

### 1. Sharing Configuration
```json
{
  "sharing_config": {
    "public_sharing": {
      "enabled": true,
      "require_authentication": false,
      "expiration_days": 30,
      "watermark": "Company Confidential"
    },
    "internal_sharing": {
      "enabled": true,
      "default_permissions": ["view"],
      "allow_role_inheritance": true
    },
    "external_sharing": {
      "enabled": false,
      "require_approval": true,
      "approver_roles": ["admin", "dashboard_owner"]
    }
  }
}
```

### 2. Export Options
```python
# Dashboard export service
class DashboardExportService:
    def __init__(self, pdf_generator, excel_generator):
        self.pdf_generator = pdf_generator
        self.excel_generator = excel_generator
    
    async def export_dashboard(self, dashboard_id, format, options):
        dashboard = await self.get_dashboard_config(dashboard_id)
        data = await self.get_dashboard_data(dashboard_id, options.get('filters'))
        
        if format == 'pdf':
            return await self.export_to_pdf(dashboard, data, options)
        elif format == 'excel':
            return await self.export_to_excel(dashboard, data, options)
        elif format == 'image':
            return await self.export_to_image(dashboard, data, options)
        else:
            raise ValueError(f"Unsupported export format: {format}")
    
    async def export_to_pdf(self, dashboard, data, options):
        # Generate PDF with charts and tables
        pdf_content = await self.pdf_generator.generate({
            'template': 'dashboard_export',
            'data': {
                'dashboard': dashboard,
                'widgets_data': data,
                'timestamp': datetime.now(),
                'filters_applied': options.get('filters', {})
            },
            'layout': options.get('layout', 'portrait')
        })
        
        return {
            'content': pdf_content,
            'filename': f"dashboard_{dashboard['name']}_{datetime.now().strftime('%Y%m%d')}.pdf",
            'content_type': 'application/pdf'
        }
```

## Best Practices

### 1. Dashboard Design Guidelines
- **Keep It Simple:** Focus on essential metrics, avoid clutter
- **Use Consistent Colors:** Maintain color scheme across widgets
- **Optimize Load Time:** Implement caching and lazy loading
- **Mobile Responsive:** Ensure dashboards work on all devices
- **Clear Labels:** Use descriptive titles and axis labels

### 2. Performance Guidelines
- **Data Aggregation:** Pre-aggregate data at database level
- **Efficient Queries:** Use indexes and optimized queries
- **Caching Strategy:** Cache frequently accessed data
- **Progressive Loading:** Load critical widgets first
- **Error Handling:** Graceful degradation for failed widgets

### 3. User Experience Guidelines
- **Intuitive Navigation:** Clear drill-down paths
- **Contextual Filters:** Relevant filtering options
- **Loading States:** Show progress for long-running operations
- **Error Messages:** Helpful error messages and recovery options
- **Accessibility:** Follow WCAG guidelines for accessibility

---

## Related Resources

- [API Documentation](./api.md)
- [Development Guide](./development.md)
- [Privacy Guidelines](./privacy.md)
- [Widget Library](../widgets/README.md)

---

**Last Updated:** {{ current_date }}
**Version:** 2.4
**Next Review:** {{ next_quarter }}

