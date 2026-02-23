# Shabrang Marketing Management System

Complete marketing automation and funnel management for "The Liquid Fortress" book project. This system integrates GoHighLevel (GHL) CRM with social media, email automation, analytics, and paywall management.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SHABRANG MARKETING ECOSYSTEM                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │  MASTER MANAGER │───▶│   FUNNEL       │───▶│   PAYWALL   │ │
│  │  (Orchestrator) │    │   MANAGER      │    │   MANAGER   │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│           │                      │                     │        │
│           ▼                      ▼                     ▼        │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │  SOCIAL MANAGER │    │ EMAIL AUTOMATION│    │ ANALYTICS  │ │
│  │  (Content &     │    │ (Sequences)     │    │ DASHBOARD  │ │
│  │   Engagement)   │    │                 │    │            │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│                                                                 │
│  All systems integrate with GoHighLevel CRM via Python SDK     │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
cd /opt/shabrang/repo/marketing

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install gohighlevel-api-client

# Copy and configure environment
cp .env.example .env
# Edit .env with your GHL credentials
```

### 2. Authenticate with GHL

```bash
# Authenticate and get access token
python ghl_sdk.py --auth

# Follow browser link, authorize, copy code
python ghl_sdk.py --token YOUR_AUTH_CODE
```

### 3. Test System

```bash
# Test complete system
python master_manager.py --status

# View master dashboard
python master_manager.py --dashboard
```

## 📋 Core Components

### Master Manager (`master_manager.py`)
Unified control center for the entire marketing ecosystem.

```bash
# Complete marketing dashboard
python master_manager.py --dashboard

# Process new lead through entire funnel
python master_manager.py --process-lead user@example.com "John" "Doe" --source landing-page

# Launch integrated campaign
python master_manager.py --campaign "Spring Viral Push" viral 7

# Run system optimization
python master_manager.py --optimize
```

### Funnel Manager (`funnel_manager.py`)
Manages lead progression through the marketing funnel using GHL tags and custom fields.

```bash
# Initialize funnel workflows
python funnel_manager.py --init

# Add lead to specific funnel stage
python funnel_manager.py --add-lead user@example.com --source social-media

# Track social media engagement
python funnel_manager.py --social-share user@example.com share twitter chapter1

# View funnel analytics
python funnel_manager.py --analytics
```

### Social Manager (`social_manager.py`)
Handles social media content creation, scheduling, and engagement tracking.

```bash
# Schedule content for social posting
python social_manager.py --schedule chapter1-quote1 instagram twitter

# Track user engagement
python social_manager.py --track user@example.com like instagram chapter1

# Launch viral campaign
python social_manager.py --campaign "Chapter Launch" chapter1-quote1,chapter3-binary 5

# View social analytics
python social_manager.py --analytics
```

### Email Automation (`email_automation.py`)
Automated email sequences and nurture campaigns.

```bash
# Trigger welcome sequence
python email_automation.py --sequence free-chapter-nurture user@example.com first_name="John"

# Send scheduled emails
python email_automation.py --schedule

# Test email template
python email_automation.py --test user@example.com welcome-free-chapter

# View email performance
python email_automation.py --analytics
```

### Paywall Manager (`paywall_manager.py`)
Premium content access control and membership management.

```bash
# Check membership status
python paywall_manager.py --check user@example.com

# Grant premium access
python paywall_manager.py --grant user@example.com payment

# Generate access token
python paywall_manager.py --token user@example.com chapter 6

# View subscription overview
python paywall_manager.py --status
```

### Analytics Dashboard (`analytics_dashboard.py`)
Comprehensive marketing analytics and reporting.

```bash
# Complete overview
python analytics_dashboard.py --overview

# Export data to CSV
python analytics_dashboard.py --export analytics_20241215.csv
```

## 🎯 Marketing Funnel Stages

The system manages leads through these funnel stages:

1. **Awareness** - Initial social media exposure
2. **Interest** - Landing page visit
3. **Curious** - Free content engagement
4. **Lead** - Email capture
5. **Nurture** - Email sequence
6. **Premium** - Paid conversion
7. **Engaged** - Active community member
8. **Advocate** - Content sharing
9. **Upsell** - Advanced offerings

## 📊 Key Metrics Tracked

- **Funnel Conversion Rates** - Stage-to-stage progression
- **Engagement Scores** - Social media interaction levels
- **Email Performance** - Open rates, click rates
- **Revenue Attribution** - Channel contribution
- **Content Performance** - Which pieces drive most engagement

## 🔧 Configuration Files

### Environment Variables (.env)
```bash
# GoHighLevel Configuration
GHL_CLIENT_ID=your_client_id
GHL_CLIENT_SECRET=your_client_secret
GHL_LOCATION_ID=your_location_id
GHL_REDIRECT_URI=https://yourdomain.com/callback

# Email Settings
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_password

# Social Media (Optional)
TWITTER_API_KEY=your_key
INSTAGRAM_ACCESS_TOKEN=your_token
```

### Content Library (social_content.json)
Social media content pieces with quotes, images, and hashtags.

### Email Templates (email_templates.json)
HTML and text email templates with variable substitution.

### Campaign Configurations
Automated campaign settings for different marketing scenarios.

## 🚦 API Integration Points

### GoHighLevel Webhooks
- Contact creation/updates
- Tag changes
- Form submissions
- Email events

### Landing Page Integration
```javascript
// Add lead to funnel
fetch('/api/funnel/add-lead', {
  method: 'POST',
  body: JSON.stringify({
    email: 'user@example.com',
    source: 'landing-page'
  })
});
```

### Content Paywall
```javascript
// Check access before showing content
fetch('/api/paywall/check?email=user@example.com&content=chapter6')
  .then(response => {
    if (response.access_granted) {
      showContent();
    } else {
      showPaywall();
    }
  });
```

## 📈 Automation Workflows

### Lead Processing Pipeline
1. **Capture** - Email collected via landing page
2. **Tag** - Applied to GHL contact with funnel stage
3. **Email** - Welcome sequence triggered
4. **Track** - Engagement monitored across channels
5. **Nurture** - Automated follow-ups based on behavior
6. **Convert** - Premium upgrade path

### Social Media Automation
1. **Content Creation** - AI-generated quotes and visuals
2. **Scheduling** - Optimal posting times
3. **Engagement Tracking** - Likes, shares, comments
4. **Funnel Updates** - Social actions advance leads
5. **Analytics** - Performance reporting

## 🛠️ Maintenance & Monitoring

### Daily Tasks
```bash
# Check system health
python master_manager.py --health

# Send scheduled emails
python email_automation.py --schedule

# Update analytics
python analytics_dashboard.py --overview
```

### Weekly Tasks
```bash
# Run optimization analysis
python master_manager.py --optimize

# Review funnel performance
python funnel_manager.py --analytics

# Check social media engagement
python social_manager.py --analytics
```

### Monthly Tasks
```bash
# Export comprehensive report
python analytics_dashboard.py --export monthly_report.csv

# Review campaign performance
python master_manager.py --dashboard

# Optimize underperforming areas
python master_manager.py --optimize
```

## 🚨 Troubleshooting

### Common Issues

**GHL Authentication Failed**
```bash
# Re-authenticate
python ghl_sdk.py --auth
python ghl_sdk.py --token NEW_CODE
```

**Email Not Sending**
```bash
# Check email configuration
python email_automation.py --test your@email.com test-template
```

**Funnel Not Advancing**
```bash
# Check contact tags in GHL
python funnel_manager.py --analytics
```

### Logs and Debugging

All components write to log files:
- `lead_processing_log.json` - Lead processing events
- `social_engagement.log` - Social media interactions
- `email_log.json` - Email sending records
- `paywall_access_log.json` - Access control events

## 📚 Advanced Usage

### Custom Campaign Creation
```python
# Create custom campaign logic
campaign = {
    "name": "Holiday Special",
    "content": ["holiday_quote1", "holiday_quote2"],
    "email_sequence": "holiday_nurture",
    "duration": 14
}
```

### A/B Testing
```python
# Test different email subject lines
test_groups = {
    "A": "Unlock The Secret",
    "B": "The Persian Survival Code",
    "C": "Why Persia Endures"
}
```

### Predictive Analytics
The system includes predictive insights for:
- Next month's lead volume
- Conversion rate forecasting
- Content performance trends
- Optimal posting times

## 🔐 Security & Compliance

- **Data Privacy**: GDPR compliant contact handling
- **Secure Tokens**: Encrypted GHL access tokens
- **Audit Logs**: Complete activity tracking
- **Access Control**: Role-based permissions for team members

## 📞 Support & Documentation

- **API Documentation**: Each manager has detailed docstrings
- **Configuration Guide**: See `.env.example` for all settings
- **Troubleshooting**: Check logs in the marketing directory
- **Updates**: System is designed for modular updates

---

*Shabrang Marketing System — Complete funnel automation for The Liquid Fortress*
*Built with GoHighLevel Python SDK and modern marketing automation practices*
