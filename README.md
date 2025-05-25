# Medusa Phyllo Creator Portal Plugin - Installation & Setup Guide

This guide will help you install and configure the Phyllo Creator Portal plugin for your Medusa.js and Next.js e-commerce store.

## Overview

The Medusa Phyllo Creator Portal plugin enables you to:
- Manage influencers and content creators through your admin dashboard
- Allow creators to connect their social media accounts via Phyllo's SDK
- Track creator metrics, engagement, and audience demographics
- Manage influencer marketing campaigns and collaborations
- Verify creator identities and income data

## Prerequisites

- Medusa.js v2.3.0 or higher
- Next.js 13+ for storefront
- PostgreSQL database
- Node.js 18+ 
- Phyllo API account ([Sign up here](https://dashboard.getphyllo.com))

## Step 1: Get Phyllo API Credentials

1. Sign up for a Phyllo account at [dashboard.getphyllo.com](https://dashboard.getphyllo.com)
2. Create a new application in your Phyllo dashboard
3. Note down your:
   - Client ID
   - Client Secret
   - Environment (sandbox/production)

## Step 2: Install the Plugin

### Backend (Medusa.js)

1. **Install the plugin** (when published to npm):
```bash
npm install medusa-plugin-phyllo-creator
# or
yarn add medusa-plugin-phyllo-creator
```

2. **Add plugin to medusa-config.js**:
```javascript
module.exports = defineConfig({
  projectConfig: {
    // ... other config
  },
  plugins: [
    // ... other plugins
    {
      resolve: "medusa-plugin-phyllo-creator",
      options: {
        phylloClientId: process.env.PHYLLO_CLIENT_ID,
        phylloClientSecret: process.env.PHYLLO_CLIENT_SECRET,
        phylloEnvironment: process.env.PHYLLO_ENVIRONMENT || "sandbox",
        phylloBaseUrl: process.env.PHYLLO_BASE_URL || "https://api.getphyllo.com",
        enabledPlatforms: ["youtube", "instagram", "tiktok", "twitch", "linkedin"],
        webhookSecret: process.env.PHYLLO_WEBHOOK_SECRET
      }
    }
  ]
})
```

3. **Environment Variables (.env)**:
```bash
# Phyllo Configuration
PHYLLO_CLIENT_ID=your_phyllo_client_id
PHYLLO_CLIENT_SECRET=your_phyllo_client_secret
PHYLLO_ENVIRONMENT=sandbox # or production
PHYLLO_BASE_URL=https://api.getphyllo.com
PHYLLO_WEBHOOK_SECRET=your_webhook_secret

# Admin API Token for Next.js integration
MEDUSA_ADMIN_TOKEN=your_admin_api_token
```

4. **Run database migrations**:
```bash
npx medusa migrations run
```

### Frontend (Next.js)

1. **Install dependencies**:
```bash
npm install axios
# or
yarn add axios
```

2. **Environment Variables (.env.local)**:
```bash
MEDUSA_BACKEND_URL=http://localhost:9000
PHYLLO_CLIENT_ID=your_phyllo_client_id
PHYLLO_ENVIRONMENT=sandbox
```

3. **Copy the provided components** to your Next.js project:
   - `lib/phyllo-sdk.ts`
   - `components/creator-portal/PhylloConnect.tsx`
   - `components/creator-portal/CreatorDashboard.tsx`
   - `components/creator-portal/CreatorOnboarding.tsx`
   - `hooks/useCreatorAuth.ts`
   - API routes in `pages/api/`

## Step 3: Configure Phyllo Webhooks

1. In your Phyllo dashboard, set up webhooks to point to:
   ```
   https://your-domain.com/hooks/phyllo
   ```

2. The plugin automatically handles these webhook events:
   - `ACCOUNT.CONNECTED`
   - `ACCOUNT.DISCONNECTED`
   - `ACCOUNT.UPDATED`
   - `DATA.SYNC_COMPLETED`

## Step 4: Admin Dashboard Setup

The plugin automatically adds:

### Admin Widgets
- **Creator Dashboard Widget**: Shows creator stats on the main dashboard
- **Creator Analytics Widget**: Displays engagement metrics and platform performance

### Admin Routes
- **Creator Management**: `/admin/creators` - Manage all creators
- **Creator Details**: `/admin/creators/:id` - View individual creator profiles
- **Campaign Management**: `/admin/campaigns` - Manage influencer campaigns

### Key Features
- Search and filter creators by platform, followers, engagement rate
- Verify creator accounts and update status
- Sync creator data from connected platforms
- View detailed analytics and audience demographics

## Step 5: Creator Portal Integration

### Basic Implementation

1. **Add creator onboarding page** (`pages/creator/onboard.tsx`):
```tsx
import { CreatorOnboarding } from '../components/creator-portal/CreatorOnboarding'
import { useRouter } from 'next/router'

export default function CreatorOnboardPage() {
  const router = useRouter()

  const handleOnboardingComplete = (creatorData) => {
    router.push('/creator/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <CreatorOnboarding onComplete={handleOnboardingComplete} />
      </div>
    </div>
  )
}
```

2. **Add creator dashboard** (already provided in the artifacts)

3. **Add navigation links**:
```tsx
// In your header/navigation component
<nav>
  <Link href="/creator/onboard">Become a Creator</Link>
  <Link href="/creator/dashboard">Creator Dashboard</Link>
</nav>
```

## Step 6: Authentication Integration

Integrate with your existing authentication system:

```typescript
// pages/api/auth/me.ts
export default async function handler(req, res) {
  // Get user from your auth system
  const user = await getCurrentUser(req)
  
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // Check if user has an associated creator profile
  const creator = await getCreatorByUserId(user.id)
  
  res.json({
    userId: user.id,
    creatorId: creator?.id || null,
    isCreator: !!creator
  })
}
```

## Step 7: Styling and Customization

The components use Tailwind CSS classes. To customize:

1. **Install Tailwind CSS** (if not already installed):
```bash
npm install tailwindcss @tailwindcss/forms
```

2. **Configure Tailwind** (`tailwind.config.js`):
```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your brand colors
        primary: '#your-primary-color',
        secondary: '#your-secondary-color',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

3. **Customize component styles** by modifying the className props in the components.

## Step 8: Testing

### Backend Testing
```bash
# Test creator creation
curl -X POST http://localhost:9000/admin/creators \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Test Creator",
    "email": "test@creator.com",
    "bio": "Test bio"
  }'

# Test creator sync
curl -X POST http://localhost:9000/admin/creators/CREATOR_ID/sync \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Frontend Testing
1. Navigate to `/creator/onboard`
2. Fill out the onboarding form
3. Test Phyllo SDK integration
4. Verify data appears in admin dashboard

## Step 9: Production Deployment

### Environment Configuration
1. Update environment variables for production:
```bash
PHYLLO_ENVIRONMENT=production
PHYLLO_BASE_URL=https://api.getphyllo.com
```

2. **Configure CORS** in medusa-config.js:
```javascript
module.exports = defineConfig({
  projectConfig: {
    http: {
      storeCors: "https://your-storefront-domain.com",
      adminCors: "https://your-admin-domain.com",
    }
  }
})
```

### Security Considerations
- Use HTTPS in production
- Validate webhook signatures
- Implement rate limiting
- Secure admin endpoints with proper authentication
- Validate all user inputs

## API Endpoints

### Admin Endpoints
- `GET /admin/creators` - List creators with filters
- `POST /admin/creators` - Create new creator
- `GET /admin/creators/:id` - Get creator details
- `PUT /admin/creators/:id` - Update creator
- `POST /admin/creators/:id/sync` - Sync creator platforms
- `GET /admin/campaigns` - List campaigns
- `POST /admin/campaigns` - Create campaign

### Store Endpoints
- `POST /store/creator-portal` - Get Phyllo SDK token
- `GET /store/creators/:id` - Get creator public profile

### Webhook Endpoints
- `POST /hooks/phyllo` - Handle Phyllo webhooks

## Troubleshooting

### Common Issues

1. **Phyllo SDK not loading**:
   - Check that the script URL is accessible
   - Verify CORS settings
   - Check browser console for errors

2. **Authentication errors**:
   - Verify Phyllo credentials
   - Check token expiration
   - Ensure proper headers are sent

3. **Database connection issues**:
   - Verify PostgreSQL is running
   - Check database credentials
   - Run migrations

4. **Admin dashboard not showing creator widgets**:
   - Verify plugin is properly installed
   - Check admin build process
   - Clear browser cache

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=medusa:plugin:phyllo
```

## Support

- [Phyllo Documentation](https://docs.getphyllo.com)
- [Medusa Documentation](https://docs.medusajs.com)
- [GitHub Issues](https://github.com/your-repo/medusa-plugin-phyllo-creator/issues)

## License

MIT License - see LICENSE file for details.
