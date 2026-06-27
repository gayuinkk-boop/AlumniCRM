import { create } from 'zustand';
import { supabase, isMock as checkIsMock } from '@/utils/supabase/client';

export const useAuth = create((set, get) => {
  // Initialize state from localStorage if available (helps persist mock sessions across refreshes)
  let initialUser = null;
  let initialProfile = null;
  
  if (typeof window !== 'undefined') {
    try {
      const storedMockAuth = localStorage.getItem('alumni_crm_mock_auth');
      if (storedMockAuth) {
        const parsed = JSON.parse(storedMockAuth);
        initialUser = parsed.user;
        initialProfile = parsed.profile;
      }
    } catch (e) {
      console.error("Failed to parse stored mock auth", e);
    }
  }

  return {
    user: initialUser,
    profile: initialProfile,
    loading: true,
    isMock: checkIsMock,
    
    initialize: async () => {
      set({ loading: true });
      
      // If a mock session is active in localStorage, restore it and bypass real Supabase Auth
      if (typeof window !== 'undefined' && localStorage.getItem('alumni_crm_mock_auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem('alumni_crm_mock_auth'));
          if (parsed && parsed.user && parsed.profile) {
            set({ user: parsed.user, profile: parsed.profile, loading: false });
            return;
          }
        } catch (e) {
          console.error("Failed to parse stored mock auth during initialize", e);
        }
      }
      
      if (checkIsMock) {
        // If we are in mock mode and have stored session, keep it. Otherwise set to null
        set({ loading: false });
        return;
      }

      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          set({ user: session.user });
          // Fetch profile from db
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            set({ profile });
          } else {
            // Profile doesn't exist yet, resolve organization ID from email domain
            let organizationId = null;
            try {
              const emailDomain = session.user.email?.split('@')[1];
              if (emailDomain) {
                const { data: org } = await supabase
                  .from('organizations')
                  .select('id')
                  .eq('domain', emailDomain)
                  .single();
                if (org) {
                  organizationId = org.id;
                } else {
                  const { data: orgs } = await supabase
                    .from('organizations')
                    .select('id')
                    .limit(1);
                  if (orgs && orgs.length > 0) {
                    organizationId = orgs[0].id;
                  }
                }
              }
            } catch (e) {
              console.error("Failed to resolve organization_id", e);
            }

            set({
              profile: {
                id: session.user.id,
                organization_id: organizationId,
                full_name: session.user.email?.split('@')[0] || 'User',
                role: 'student',
                is_verified: false,
                is_onboarded: false,
              }
            });
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        set({ loading: false });
      }

      // Listen to auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        // If an active mock session is running in local storage, ignore Supabase auth state updates
        if (typeof window !== 'undefined' && localStorage.getItem('alumni_crm_mock_auth')) {
          return;
        }
        if (session) {
          set({ user: session.user, loading: true });
          
          let dbProfile = null;
          try {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            dbProfile = data;
          } catch (e) {
            console.error("Failed to fetch profile in auth listener", e);
          }

          let placeholderProfile = null;
          if (!dbProfile) {
            let organizationId = null;
            try {
              const emailDomain = session.user.email?.split('@')[1];
              if (emailDomain) {
                const { data: org } = await supabase
                  .from('organizations')
                  .select('id')
                  .eq('domain', emailDomain)
                  .single();
                if (org) {
                  organizationId = org.id;
                } else {
                  const { data: orgs } = await supabase
                    .from('organizations')
                    .select('id')
                    .limit(1);
                  if (orgs && orgs.length > 0) {
                    organizationId = orgs[0].id;
                  }
                }
              }
            } catch (e) {
              console.error("Failed to resolve organization_id inside auth listener", e);
            }

            placeholderProfile = {
              id: session.user.id,
              organization_id: organizationId,
              full_name: session.user.email?.split('@')[0] || 'User',
              role: 'student',
              is_verified: false,
              is_onboarded: false,
            };
          }

          set({ 
            profile: dbProfile || placeholderProfile, 
            loading: false 
          });
        } else {
          set({ user: null, profile: null, loading: false });
        }
      });
    },

    loginAsMock: (role) => {
      const mockId = `mock-${role}-id`;
      const mockOrgId = `mock-org-id`;
      
      let fullName = 'Alex Admin';
      let headline = 'VSIT Chief Administrator';
      let industry = 'Education';
      let stream = 'Administration';
      let alumniCategory = 'Administration';
      let graduationYear = '';
      let experience = [];
      let education = [];
      let skills = [];
      let projects = [];
      let bio = '';
      let currentCompany = 'VSIT';
      let currentRole = 'Administrator';

      if (role === 'student') {
        fullName = 'Jane Student';
        headline = 'Computer Science Student \'26';
        industry = 'Software Development';
        stream = 'Computer Science';
        alumniCategory = 'Student';
        graduationYear = '2026';
        bio = 'Aspiring Frontend Engineer passionate about React, Next.js, and clean user experience designs. Looking for winter and summer internship opportunities.';
        education = [
          { school: 'Vidyalankar School of Information Technology (VSIT)', degree: 'B.Sc. Information Technology', stream: 'Information Technology', duration: '2023 - 2026' }
        ];
        skills = ['React', 'JavaScript', 'HTML5/CSS3', 'Python', 'TailwindCSS', 'UI/UX Design'];
      } else if (role === 'alumni') {
        fullName = 'John Alumni';
        headline = 'Senior Full-Stack Engineer @ Google';
        industry = 'Tech';
        stream = 'Information Technology';
        alumniCategory = 'Working Professional';
        graduationYear = '2021';
        bio = 'Alumni of VSIT Class of 2021. Currently leading full-stack cloud projects at Google. Happy to help current students with mock interviews, tech advice, and resume reviews.';
        currentCompany = 'Google';
        currentRole = 'Senior Software Engineer';
        experience = [
          { title: 'Senior Software Engineer', company: 'Google', duration: '2023 - Present', description: 'Driving core cloud platform infrastructure enhancements. Optimizing microservices and database engines.' },
          { title: 'Software Engineer II', company: 'TCS', duration: '2021 - 2023', description: 'Built robust web products for international banking clients using React and Node.js.' }
        ];
        education = [
          { school: 'Vidyalankar School of Information Technology (VSIT)', degree: 'B.Sc. Information Technology', stream: 'Information Technology', duration: '2018 - 2021' }
        ];
        skills = ['React', 'Next.js', 'System Design', 'PostgreSQL', 'Node.js', 'Kubernetes', 'Cloud Computing'];
        projects = [
          { title: 'G-Cloud Monitoring Panel', description: 'Developed highly customizable system status widgets for Google Cloud clusters.', link: 'https://github.com/google' }
        ];
      } else if (role === 'faculty') {
        fullName = 'Prof. Rajesh Patil';
        headline = 'Professor & Head of Information Technology @ VSIT';
        industry = 'Education';
        stream = 'Information Technology';
        alumniCategory = 'Faculty';
        graduationYear = '1998';
        bio = 'Dedicated educator and head of department at VSIT with over 15 years of instruction experience. Researching automated learning models and career development algorithms.';
        currentCompany = 'VSIT';
        currentRole = 'HOD and Professor';
        experience = [
          { title: 'HOD and Professor (IT)', company: 'Vidyalankar School of Information Technology', duration: '2015 - Present', description: 'Administering academic curriculums, directing department guidelines, and coordinating corporate partnerships.' },
          { title: 'Assistant Professor', company: 'VJTI Mumbai', duration: '2010 - 2015', description: 'Instructed advanced algorithm design and databases.' }
        ];
        education = [
          { school: 'IIT Bombay', degree: 'Ph.D. in Computer Science', stream: 'Computer Science', duration: '2006 - 2010' }
        ];
        skills = ['Pedagogy', 'Academic Writing', 'Curriculum Design', 'Machine Learning', 'Data Structures'];
      } else if (role === 'mentor') {
        fullName = 'Dr. Vikram Mehta';
        headline = 'AI Scientist @ NVIDIA | Distinguished Industry Mentor';
        industry = 'Tech & AI';
        stream = 'Computer Science';
        alumniCategory = 'Mentor';
        graduationYear = '2012';
        bio = 'AI Researcher at NVIDIA and global mentor. Enthusiastic about guiding graduates and students on artificial intelligence pipelines, deep learning models, and industry placement strategies.';
        currentCompany = 'NVIDIA';
        currentRole = 'AI Research Scientist';
        experience = [
          { title: 'AI Research Scientist', company: 'NVIDIA', duration: '2022 - Present', description: 'Developing CUDA kernels for accelerating multi-modal large language models.' },
          { title: 'Senior ML Engineer', company: 'Intel Corporation', duration: '2018 - 2022', description: 'Optimized computer vision architectures on edge platforms.' }
        ];
        education = [
          { school: 'Stanford University', degree: 'M.S. in Computer Science (AI)', stream: 'Computer Science', duration: '2014 - 2016' },
          { school: 'Vidyalankar School of Information Technology (VSIT)', degree: 'B.Sc. Computer Science', stream: 'Computer Science', duration: '2009 - 2012' }
        ];
        skills = ['Generative AI', 'CUDA Parallel Computing', 'Deep Learning', 'PyTorch', 'System Architecture', 'Mentoring'];
        projects = [
          { title: 'CUDA-Speedup NLP', description: 'Open source CUDA library optimizing transformer attention weights.', link: 'https://github.com/nvidia' }
        ];
      }

      const mockUser = {
        id: mockId,
        email: `${role}@vsit.edu.in`,
        user_metadata: {
          full_name: fullName
        }
      };

      const mockProfile = {
        id: mockId,
        organization_id: mockOrgId,
        role: role,
        full_name: fullName,
        headline: headline,
        industry: industry,
        linkedin_url: `https://linkedin.com/in/${role}-vsit`,
        is_verified: role !== 'student',
        is_onboarded: true,
        stream: stream,
        alumni_category: alumniCategory,
        graduation_year: graduationYear,
        bio: bio,
        current_company: currentCompany,
        current_role: currentRole,
        experience: experience,
        education: education,
        skills: skills,
        projects: projects,
        created_at: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('alumni_crm_mock_auth', JSON.stringify({ user: mockUser, profile: mockProfile }));
      }

      set({ user: mockUser, profile: mockProfile, loading: false });
    },

    signOut: async () => {
      set({ loading: true });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('alumni_crm_mock_auth');
      }
      
      if (!checkIsMock) {
        await supabase.auth.signOut();
      }
      
      set({ user: null, profile: null, loading: false });
    },

    updateProfile: async (updates) => {
      const currentProfile = get().profile;
      if (!currentProfile) return;

      const newProfile = { ...currentProfile, ...updates };

      if (get().isMock) {
        set({ profile: newProfile });
        if (typeof window !== 'undefined') {
          localStorage.setItem('alumni_crm_mock_auth', JSON.stringify({ user: get().user, profile: newProfile }));
        }
        return { error: null };
      }

      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: currentProfile.id,
            ...updates
          });

        if (!error) {
          set({ profile: newProfile });
        }
        return { error };
      } catch (err) {
        return { error: err };
      }
    }
  };
});
