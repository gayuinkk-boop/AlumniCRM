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
    role TEXT CHECK (role IN ('student', 'alumni', 'admin')) DEFAULT 'student',
    full_name TEXT NOT NULL,
    headline TEXT,
    industry TEXT,
    linkedin_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policy: Users can read profiles in their own organization, but only update their own.
CREATE POLICY "View organization profiles" ON profiles
    FOR SELECT USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Update own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());
