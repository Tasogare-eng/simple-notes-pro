# Database Setup Guide

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Note down your project URL and keys

## Setup Instructions

### 1. Update Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. Run Database Migration

In your Supabase Dashboard:

1. Go to the SQL Editor
2. Copy and paste the contents of `migrations/001_initial_schema.sql`
3. Click "Run" to execute the migration

This will create:
- `profiles` table with RLS policies
- `notes` table with RLS policies
- Indexes for performance
- Triggers for auto-creating profiles and updating timestamps
- Functions for database operations

### 3. Verify Setup

After running the migration, verify that:

1. **Tables exist**: Check the Table Editor for `profiles` and `notes` tables
2. **RLS is enabled**: Both tables should show "RLS enabled" in the dashboard
3. **Policies are created**: Check the Authentication > Policies section
4. **Triggers are active**: Check the Database > Triggers section

### 4. Test Profile Creation

1. Sign up a new user through your application
2. Check the `profiles` table to ensure a profile was automatically created
3. Verify the user can only see their own profile (RLS working)

## Table Structure

### Profiles Table
- `user_id` (UUID, Primary Key) - References auth.users
- `stripe_customer_id` (TEXT) - Stripe customer ID
- `subscription_status` (TEXT) - Subscription status from Stripe
- `plan` (TEXT) - 'free' or 'pro'
- `created_at` (TIMESTAMPTZ) - Auto-generated
- `updated_at` (TIMESTAMPTZ) - Auto-updated on changes

### Notes Table
- `id` (UUID, Primary Key) - Auto-generated
- `user_id` (UUID) - References auth.users
- `title` (TEXT) - Note title
- `content` (TEXT) - Note content
- `created_at` (TIMESTAMPTZ) - Auto-generated
- `updated_at` (TIMESTAMPTZ) - Auto-updated on changes

## Security Features

### Row Level Security (RLS)
- Users can only access their own profiles and notes
- All operations are automatically filtered by `auth.uid()`

### Triggers
- Profile automatically created on user signup
- Timestamps automatically updated on record changes

### Indexes
- Fast lookups by user_id
- Optimized sorting by creation date
- Efficient Stripe customer ID lookups

## Troubleshooting

### Common Issues

1. **RLS blocking queries**: Ensure you're using the correct client (server vs browser)
2. **Profile not created**: Check if the trigger was created successfully
3. **Permission errors**: Verify your service role key is correct

### Testing RLS

You can test RLS policies in the SQL Editor:

```sql
-- This should work (returns own profile)
SELECT * FROM profiles WHERE user_id = auth.uid();

-- This should return empty (can't see other users)
SELECT * FROM profiles WHERE user_id != auth.uid();
```

## Production Considerations

- Backup your database regularly
- Monitor query performance with the built-in metrics
- Consider adding additional indexes as your app grows
- Review and update RLS policies as needed