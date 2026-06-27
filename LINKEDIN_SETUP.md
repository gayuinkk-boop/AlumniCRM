# Configuring LinkedIn Authentication with Supabase

This guide provides step-by-step instructions for configuring LinkedIn login in this Alumni CRM application.

## Prerequisites
- A **LinkedIn** personal account.
- A **Supabase** account with an active project.
- Access to the codebase's `.env.local` file.

---

## Step 1: Create an App in the LinkedIn Developer Portal

1. Open the [LinkedIn Developer Portal](https://developer.linkedin.com/) and sign in.
2. Click **Create app** (blue button in the top-right).
3. Fill in the required fields:
   - **App name**: (e.g., `VSIT Alumni CRM`)
   - **LinkedIn Page**: Associate the app with your institution's LinkedIn Page (requires page admin verification, or you can link a personal test page).
   - **Privacy policy URL**: Provide a valid URL (e.g., your website's privacy page or a placeholder).
   - **App logo**: Upload a square logo image.
4. Agree to the API Terms and click **Create app**.

---

## Step 2: Request the Sign In Product

1. Navigate to your app dashboard in the LinkedIn Developer Portal.
2. Click on the **Products** tab.
3. Find **"Sign In with LinkedIn using OpenID Connect"** (recommended for standard auth).
4. Click **Request access** next to it.
5. Review and accept terms. The product will be provisioned to your application immediately.

---

## Step 3: Configure Redirect URL in LinkedIn App Settings

1. Go to the **Auth** tab in the LinkedIn Developer Portal.
2. Scroll down to **OAuth 2.0 settings**.
3. Under **Authorized Redirect URLs**, click the pencil icon and click **+ Add redirect URL**.
4. Enter your project's redirect callback URL. 
   - **For local dev**: `http://localhost:3000/auth/callback` (or if using client-side OAuth, `http://localhost:3000/` or your custom router path).
   - **For production (Supabase endpoint)**:
     ```
     https://cjbknnnqxniamznhixkt.supabase.co/auth/v1/callback
     ```
5. Click **Save**.

---

## Step 4: Retrieve Credentials and Add to Supabase Provider

1. In the LinkedIn developer app **Auth** tab, find **Application credentials**.
2. Copy your **Client ID** and **Client Secret**.
3. Open your [Supabase Project Dashboard](https://supabase.com/dashboard).
4. Navigate to **Authentication** (sidebar) > **Providers** > **LinkedIn**.
5. Toggle **Enable LinkedIn Provider** to **ON**.
6. Paste the **Client ID** and **Client Secret** into their respective inputs.
7. Click **Save** at the bottom of the page.

---

## Step 5: Update Local Environment Variables

Ensure your Next.js application connects to your Supabase instance by configuring the local environment.

1. Open `.env.local` in the root of your project.
2. Populate the keys with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_SUPABASE_PROJECT_ID].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
   ```
3. Restart your development server (`npm run dev`).

---

## Verification & Testing
1. Navigate to the login portal at `http://localhost:3000/login`.
2. Click the **"Continue with LinkedIn"** button.
3. You will be redirected to the LinkedIn login page to authorize your account.
4. Upon successful validation, LinkedIn redirects back to your Supabase callback, which authenticates the user and logs them into their respective portal interface.

> [!NOTE]
> In **Mock Mode** (when Supabase credentials in `.env.local` are empty or placeholder values), clicking "Continue with LinkedIn" displays an informative notification recommending users try the **Demo Accounts** panel. The system is designed to run locally without a database setup out-of-the-box.
