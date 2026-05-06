# Supabase Setup for Vantade Contact Forms

## 1. Create a Supabase project
1. Go to https://app.supabase.com and sign in.
2. Create a new project and note the project `URL` and `anon` public key.
3. Replace the placeholders in `script.js`:
   - `https://YOUR_SUPABASE_URL.supabase.co`
   - `YOUR_SUPABASE_ANON_KEY`

## 2. Create the `contacts` table
Run this SQL in the Supabase SQL editor:

```sql
create table contacts (
  id bigserial primary key,
  name text not null,
  mobile text not null,
  email text,
  technology text,
  message text,
  source text,
  created_at timestamp with time zone default now()
);
```

## 3. Deploy the Edge Function and Set SMTP Secrets via CLI

The function is already created at `supabase/functions/notify-contact/index.ts`. Now set it up using the CLI.

### Step 1: Authenticate with Supabase CLI
```bash
npx supabase login
```
Complete the browser authentication and enter the verification code when prompted.

### Step 2: Link Your Project
```bash
npx supabase link --project-ref ujcqwbkxbkvastfkbxas
```

### Step 3: Set SMTP Secrets
Replace the values with your actual SMTP credentials:
```bash
npx supabase secrets set SMTP_HOST=smtp.gmail.com
npx supabase secrets set SMTP_PORT=587
npx supabase secrets set SMTP_USER=your-email@gmail.com
npx supabase secrets set SMTP_PASSWORD=your-app-password
npx supabase secrets set SMTP_FROM=your-email@gmail.com
npx supabase secrets set NOTIFY_EMAIL=your-email@gmail.com
```

**For Gmail users**: Use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

### Step 4: Deploy the Function
```bash
npx supabase functions deploy notify-contact
```

### Step 5: Verify Deployment
Check your Supabase dashboard under **Functions** to confirm `notify-contact` is deployed and active.

## 4. Test Your Integration
1. Run your site locally with the live Supabase project.
2. Submit a contact form from any of the contact sections.
3. Check your Supabase dashboard under the `contacts` table — the data should appear instantly.
4. Check your email inbox for the notification (check spam folder too).
5. If no email arrives, check the Supabase function logs for errors.

## Troubleshooting
- **Gmail users**: Use [App Passwords](https://support.google.com/accounts/answer/185833) instead of your regular password.
- **Function not triggering**: Verify your secrets are set correctly in the Supabase dashboard.
- **Email not received**: Check your email provider's spam folder and Supabase function logs.
