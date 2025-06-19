# Analytics Platform Consent Management

## Overview

This document outlines the consent management framework for the PM Tools Analytics Platform, covering consent collection, management, and compliance with privacy regulations including GDPR and CCPA.

## Consent Framework

### Legal Basis for Processing
- **Consent:** Explicit, informed consent for optional features
- **Contract:** Processing necessary for service delivery
- **Legitimate Interest:** Analytics for platform improvement
- **Legal Obligation:** Compliance with applicable laws

### Consent Principles
- **Freely Given:** No coercion or bundling
- **Specific:** Clear purpose and scope
- **Informed:** Transparent information provided
- **Unambiguous:** Clear affirmative action required

## Consent Categories

### Essential Analytics Consent
**Purpose:** Core platform functionality and security
**Legal Basis:** Contract / Legitimate Interest
**User Control:** Limited (essential for service)

```json
{
  "consent_type": "essential_analytics",
  "required": true,
  "description": "Essential analytics for platform security and functionality",
  "data_types": [
    "Login events",
    "Security monitoring",
    "Error tracking",
    "Basic usage patterns"
  ],
  "retention_period": "2 years",
  "can_withdraw": false
}
```

### Performance Analytics Consent
**Purpose:** Platform optimization and improvement
**Legal Basis:** Consent
**User Control:** Full opt-in/opt-out

```json
{
  "consent_type": "performance_analytics", 
  "required": false,
  "description": "Analytics to improve platform performance and user experience",
  "data_types": [
    "Feature usage patterns",
    "Page load times",
    "Click tracking",
    "Navigation patterns"
  ],
  "retention_period": "18 months",
  "can_withdraw": true
}
```

### Marketing Analytics Consent
**Purpose:** Product communication and recommendations
**Legal Basis:** Consent
**User Control:** Full opt-in/opt-out

```json
{
  "consent_type": "marketing_analytics",
  "required": false,
  "description": "Analytics for product recommendations and communications",
  "data_types": [
    "Email engagement",
    "Feature preferences",
    "Usage insights",
    "Communication history"
  ],
  "retention_period": "12 months",
  "can_withdraw": true
}
```

## Consent Collection Interface

### Initial Consent Banner
```html
<!-- Consent banner implementation -->
<div id="consent-banner" class="consent-banner">
  <div class="consent-content">
    <h3>Manage Your Privacy Preferences</h3>
    <p>We use analytics to improve your experience. Choose your preferences below.</p>
    
    <div class="consent-categories">
      <div class="consent-item">
        <input type="checkbox" id="essential" checked disabled>
        <label for="essential">
          <strong>Essential Analytics</strong>
          <span>Required for platform security and functionality</span>
        </label>
      </div>
      
      <div class="consent-item">
        <input type="checkbox" id="performance">
        <label for="performance">
          <strong>Performance Analytics</strong>
          <span>Help us improve platform performance</span>
        </label>
      </div>
      
      <div class="consent-item">
        <input type="checkbox" id="marketing">
        <label for="marketing">
          <strong>Marketing Analytics</strong>
          <span>Personalized recommendations and communications</span>
        </label>
      </div>
    </div>
    
    <div class="consent-actions">
      <button id="accept-all">Accept All</button>
      <button id="save-preferences">Save Preferences</button>
      <button id="decline-optional">Decline Optional</button>
    </div>
    
    <div class="consent-links">
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/cookie-policy">Cookie Policy</a>
      <a href="#" id="manage-preferences">Manage Preferences</a>
    </div>
  </div>
</div>
```

### Consent Management Dashboard
```typescript
interface ConsentPreferences {
  essential_analytics: boolean;
  performance_analytics: boolean;
  marketing_analytics: boolean;
  timestamp: string;
  consent_version: string;
}

class ConsentManager {
  private preferences: ConsentPreferences;
  
  constructor() {
    this.preferences = this.loadPreferences();
  }
  
  async updateConsent(category: string, granted: boolean): Promise<void> {
    this.preferences[category] = granted;
    this.preferences.timestamp = new Date().toISOString();
    
    await this.savePreferences();
    await this.notifyServices();
  }
  
  async withdrawConsent(category: string): Promise<void> {
    if (category === 'essential_analytics') {
      throw new Error('Cannot withdraw consent for essential analytics');
    }
    
    await this.updateConsent(category, false);
    await this.purgeData(category);
  }
  
  private async savePreferences(): Promise<void> {
    // Save to backend API
    await fetch('/api/consent/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.preferences)
    });
    
    // Save to local storage
    localStorage.setItem('consent_preferences', JSON.stringify(this.preferences));
  }
}
```

## Consent Enforcement

### Data Collection Gates
```python
# Backend consent enforcement
from functools import wraps
from flask import request, session

def require_consent(consent_type):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user_consent = get_user_consent(session.get('user_id'))
            
            if not user_consent.get(consent_type, False):
                return {'error': 'Consent required for this operation'}, 403
            
            return func(*args, **kwargs)
        return wrapper
    return decorator

@app.route('/api/analytics/track-feature-usage', methods=['POST'])
@require_consent('performance_analytics')
def track_feature_usage():
    # Track feature usage only if consent granted
    analytics.track_event(
        user_id=session['user_id'],
        event='feature_usage',
        data=request.json
    )
    return {'status': 'tracked'}
```

### Frontend Consent Checks
```javascript
// Frontend consent enforcement
class AnalyticsService {
  constructor(consentManager) {
    this.consentManager = consentManager;
  }
  
  trackEvent(eventType, data) {
    const requiredConsent = this.getRequiredConsent(eventType);
    
    if (!this.consentManager.hasConsent(requiredConsent)) {
      console.log(`Skipping ${eventType} - consent not granted`);
      return;
    }
    
    // Proceed with tracking
    this.sendTrackingData(eventType, data);
  }
  
  getRequiredConsent(eventType) {
    const consentMap = {
      'page_view': 'essential_analytics',
      'feature_usage': 'performance_analytics',
      'email_click': 'marketing_analytics'
    };
    
    return consentMap[eventType] || 'essential_analytics';
  }
}
```

## Consent Records and Audit

### Consent Audit Trail
```python
# Consent audit logging
class ConsentAuditLogger:
    def __init__(self, db_connection):
        self.db = db_connection
    
    def log_consent_action(self, user_id, action, consent_type, details=None):
        audit_record = {
            'user_id': user_id,
            'action': action,  # 'granted', 'withdrawn', 'updated'
            'consent_type': consent_type,
            'timestamp': datetime.utcnow(),
            'ip_address': request.remote_addr,
            'user_agent': request.headers.get('User-Agent'),
            'details': details
        }
        
        self.db.consent_audit.insert_one(audit_record)
    
    def get_consent_history(self, user_id):
        return list(self.db.consent_audit.find(
            {'user_id': user_id},
            sort=[('timestamp', -1)]
        ))
```

### Consent Reporting
```sql
-- Consent analytics queries
-- Overall consent rates by category
SELECT 
    consent_type,
    COUNT(*) as total_users,
    SUM(CASE WHEN granted = true THEN 1 ELSE 0 END) as consented_users,
    (SUM(CASE WHEN granted = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as consent_rate
FROM user_consent_preferences 
WHERE is_latest = true
GROUP BY consent_type;

-- Consent trends over time
SELECT 
    DATE(created_at) as consent_date,
    consent_type,
    COUNT(*) as new_consents,
    AVG(CASE WHEN granted = true THEN 1.0 ELSE 0.0 END) as consent_rate
FROM user_consent_preferences
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), consent_type
ORDER BY consent_date, consent_type;
```

## Consent Withdrawal and Data Purging

### Withdrawal Process
```python
class ConsentWithdrawalService:
    def __init__(self, analytics_service, data_purge_service):
        self.analytics = analytics_service
        self.data_purge = data_purge_service
    
    async def process_withdrawal(self, user_id, consent_type):
        # 1. Update consent preferences
        await self.update_consent_preference(user_id, consent_type, False)
        
        # 2. Stop future data collection
        await self.analytics.disable_tracking(user_id, consent_type)
        
        # 3. Schedule data purging
        purge_job_id = await self.data_purge.schedule_purge(
            user_id=user_id,
            data_categories=self.get_data_categories(consent_type),
            effective_date=datetime.utcnow() + timedelta(days=30)
        )
        
        # 4. Notify user
        await self.send_withdrawal_confirmation(user_id, consent_type, purge_job_id)
        
        return {
            'status': 'withdrawal_processed',
            'purge_job_id': purge_job_id,
            'effective_date': (datetime.utcnow() + timedelta(days=30)).isoformat()
        }
```

### Data Purging Implementation
```python
class DataPurgeService:
    def __init__(self, database, queue_service):
        self.db = database
        self.queue = queue_service
    
    async def schedule_purge(self, user_id, data_categories, effective_date):
        purge_job = {
            'job_id': str(uuid.uuid4()),
            'user_id': user_id,
            'data_categories': data_categories,
            'scheduled_date': effective_date,
            'status': 'scheduled',
            'created_at': datetime.utcnow()
        }
        
        # Store job record
        await self.db.purge_jobs.insert_one(purge_job)
        
        # Schedule execution
        await self.queue.schedule_task(
            task='execute_data_purge',
            payload=purge_job,
            eta=effective_date
        )
        
        return purge_job['job_id']
    
    async def execute_purge(self, job_id):
        job = await self.db.purge_jobs.find_one({'job_id': job_id})
        
        if not job:
            raise ValueError(f"Purge job {job_id} not found")
        
        try:
            # Execute purge for each data category
            for category in job['data_categories']:
                await self.purge_category_data(job['user_id'], category)
            
            # Update job status
            await self.db.purge_jobs.update_one(
                {'job_id': job_id},
                {'$set': {'status': 'completed', 'completed_at': datetime.utcnow()}}
            )
            
        except Exception as e:
            await self.db.purge_jobs.update_one(
                {'job_id': job_id},
                {'$set': {'status': 'failed', 'error': str(e)}}
            )
            raise
```

## Consent UI Components

### React Consent Components
```typescript
import React, { useState, useEffect } from 'react';

interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

const ConsentManager: React.FC = () => {
  const [categories, setCategories] = useState<ConsentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsentPreferences();
  }, []);

  const loadConsentPreferences = async () => {
    try {
      const response = await fetch('/api/consent/preferences');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to load consent preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConsent = async (categoryId: string, enabled: boolean) => {
    try {
      await fetch(`/api/consent/preferences/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });

      setCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId ? { ...cat, enabled } : cat
        )
      );
    } catch (error) {
      console.error('Failed to update consent:', error);
    }
  };

  if (loading) return <div>Loading preferences...</div>;

  return (
    <div className="consent-manager">
      <h2>Privacy Preferences</h2>
      <p>Manage how your data is used for analytics and communications.</p>

      <div className="consent-categories">
        {categories.map(category => (
          <ConsentCategory
            key={category.id}
            category={category}
            onUpdate={updateConsent}
          />
        ))}
      </div>

      <div className="consent-info">
        <p>
          <strong>Data Retention:</strong> We retain your data according to our 
          <a href="/privacy-policy"> Privacy Policy</a>.
        </p>
        <p>
          <strong>Withdrawal:</strong> You can withdraw consent at any time. 
          Data will be deleted within 30 days.
        </p>
      </div>
    </div>
  );
};

const ConsentCategory: React.FC<{
  category: ConsentCategory;
  onUpdate: (id: string, enabled: boolean) => void;
}> = ({ category, onUpdate }) => {
  return (
    <div className="consent-category">
      <div className="category-header">
        <label className="category-toggle">
          <input
            type="checkbox"
            checked={category.enabled}
            disabled={category.required}
            onChange={(e) => onUpdate(category.id, e.target.checked)}
          />
          <span className="category-name">{category.name}</span>
          {category.required && <span className="required-badge">Required</span>}
        </label>
      </div>
      <p className="category-description">{category.description}</p>
    </div>
  );
};
```

## Compliance and Monitoring

### Consent Compliance Dashboard
```python
# Compliance monitoring
class ConsentComplianceMonitor:
    def __init__(self, db, alert_service):
        self.db = db
        self.alerts = alert_service
    
    async def check_compliance(self):
        issues = []
        
        # Check for stale consent records
        stale_consents = await self.find_stale_consents()
        if stale_consents:
            issues.append(f"Found {len(stale_consents)} stale consent records")
        
        # Check for missing consent for active users
        missing_consents = await self.find_missing_consents()
        if missing_consents:
            issues.append(f"Found {len(missing_consents)} users without consent records")
        
        # Check data purge job failures
        failed_purges = await self.find_failed_purge_jobs()
        if failed_purges:
            issues.append(f"Found {len(failed_purges)} failed data purge jobs")
        
        if issues:
            await self.alerts.send_compliance_alert(issues)
        
        return {
            'status': 'compliant' if not issues else 'issues_found',
            'issues': issues,
            'timestamp': datetime.utcnow().isoformat()
        }
```

### Automated Consent Renewal
```python
# Automated consent renewal reminders
class ConsentRenewalService:
    def __init__(self, email_service, db):
        self.email = email_service
        self.db = db
    
    async def send_renewal_reminders(self):
        # Find consents expiring in 30 days
        expiring_consents = await self.db.user_consent_preferences.find({
            'expires_at': {
                '$lte': datetime.utcnow() + timedelta(days=30),
                '$gte': datetime.utcnow()
            },
            'renewal_reminder_sent': {'$ne': True}
        }).to_list(length=None)
        
        for consent in expiring_consents:
            await self.send_renewal_email(consent)
            
            # Mark reminder as sent
            await self.db.user_consent_preferences.update_one(
                {'_id': consent['_id']},
                {'$set': {'renewal_reminder_sent': True}}
            )
    
    async def send_renewal_email(self, consent_record):
        template_data = {
            'user_name': consent_record['user_name'],
            'expiry_date': consent_record['expires_at'].strftime('%B %d, %Y'),
            'renewal_url': f"https://pmtools.com/consent/renew?token={consent_record['renewal_token']}"
        }
        
        await self.email.send_template(
            template='consent_renewal_reminder',
            recipient=consent_record['user_email'],
            data=template_data
        )
```

---

## Related Resources

- [Privacy Guidelines](./privacy.md)
- [API Documentation](./api.md)
- [Development Guide](./development.md)
- [Legal Framework](../legal/privacy-compliance.md)

---

**Last Updated:** {{ current_date }}
**Version:** 1.1
**Next Review:** {{ next_quarter }}

