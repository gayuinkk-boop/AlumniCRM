-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations (Multi-tenant isolation)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Profiles (Extends Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    role TEXT CHECK (role IN ('student', 'alumni', 'admin', 'faculty', 'mentor')) DEFAULT 'student',
    full_name TEXT NOT NULL,
    headline TEXT,
    industry TEXT,
    linkedin_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_onboarded BOOLEAN DEFAULT FALSE,
    experience JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    stream TEXT,
    alumni_category TEXT DEFAULT 'Working Professional',
    graduation_year TEXT,
    bio TEXT,
    current_company TEXT,
    current_role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Helper function to fetch user's organization ID to prevent RLS recursion
CREATE OR REPLACE FUNCTION get_my_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE id = (SELECT auth.uid());
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- 3. Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Organizations Policies
CREATE POLICY "View organization details" ON organizations
    FOR SELECT USING (TRUE); -- In a multi-tenant environment, you might restrict this further.

-- Profiles Policies: Users can read profiles in their own organization, but only insert/update their own.
CREATE POLICY "View organization profiles" ON profiles
    FOR SELECT USING (organization_id = (SELECT get_my_org_id()));

CREATE POLICY "Insert own profile" ON profiles
    FOR INSERT WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Update own profile" ON profiles
    FOR UPDATE USING (id = (SELECT auth.uid()));

-- 4. Jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    posted_by UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View organization jobs" ON jobs
    FOR SELECT USING (organization_id = (SELECT get_my_org_id()));

CREATE POLICY "Insert job in own organization" ON jobs
    FOR INSERT WITH CHECK (
        organization_id = (SELECT get_my_org_id()) 
        AND posted_by = (SELECT auth.uid())
    );

CREATE POLICY "Update own job" ON jobs
    FOR UPDATE USING (posted_by = (SELECT auth.uid()));

CREATE POLICY "Delete own job" ON jobs
    FOR DELETE USING (posted_by = (SELECT auth.uid()));

-- 5. Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View organization events" ON events
    FOR SELECT USING (organization_id = (SELECT get_my_org_id()));

CREATE POLICY "Insert event in own organization" ON events
    FOR INSERT WITH CHECK (
        organization_id = (SELECT get_my_org_id())
        AND created_by = (SELECT auth.uid())
    );

CREATE POLICY "Update own event" ON events
    FOR UPDATE USING (created_by = (SELECT auth.uid()));

CREATE POLICY "Delete own event" ON events
    FOR DELETE USING (created_by = (SELECT auth.uid()));

-- 6. Mentorship Requests
CREATE TABLE mentorship_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    student_id UUID REFERENCES profiles(id),
    alumni_id UUID REFERENCES profiles(id),
    message TEXT,
    status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own mentorship requests" ON mentorship_requests
    FOR SELECT USING (
        student_id = (SELECT auth.uid()) OR alumni_id = (SELECT auth.uid())
    );

CREATE POLICY "Insert mentorship request" ON mentorship_requests
    FOR INSERT WITH CHECK (
        student_id = (SELECT auth.uid()) 
        AND organization_id = (SELECT get_my_org_id())
    );

CREATE POLICY "Update mentorship request status" ON mentorship_requests
    FOR UPDATE USING (
        alumni_id = (SELECT auth.uid()) OR student_id = (SELECT auth.uid())
    );

CREATE POLICY "Delete mentorship request" ON mentorship_requests
    FOR DELETE USING (student_id = (SELECT auth.uid()));
