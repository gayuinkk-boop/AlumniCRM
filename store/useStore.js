import { create } from 'zustand';
import { supabase, isMock } from '@/utils/supabase/client';

// Generate random IDs for our mock data
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create((set, get) => ({
  // ── JOBS ──
  jobs: [
    { id: generateId(), title: "Frontend Engineer Intern", company: "Google", location: "Remote", type: "Internship", applicants: 12, status: "Active", posted: "2d ago", description: "Looking for an expert frontend React developer intern." },
    { id: generateId(), title: "Junior Data Analyst", company: "Spotify", location: "New York, NY", type: "Full-time", applicants: 45, status: "Active", posted: "5h ago", description: "Analyze big music stream data using SQL and Python." },
    { id: generateId(), title: "Product Marketing Associate", company: "Stripe", location: "San Francisco, CA", type: "Full-time", applicants: 2, status: "Active", posted: "1w ago", description: "Help us launch the next generation of financial infrastructure APIs." },
    { id: generateId(), title: "Software Engineer I", company: "Microsoft", location: "Seattle, WA", type: "Full-time", applicants: 89, status: "Active", posted: "3d ago", description: "Design cloud computing services using C# and TypeScript." },
  ],
  
  fetchJobs: async (organizationId) => {
    if (isMock) return;
    if (!organizationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(organizationId)) return;
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description || "",
          type: "Full-time",
          applicants: 0,
          status: job.is_active ? "Active" : "Closed",
          posted: "Recently",
          posted_by: job.posted_by
        }));
        set({ jobs: mapped });
      }
    } catch (e) {
      console.error("Error fetching jobs:", e);
    }
  },

  addJob: async (job) => {
    if (isMock) {
      set((state) => ({ 
        jobs: [{ id: generateId(), applicants: 0, status: "Active", posted: "Just now", ...job }, ...state.jobs] 
      }));
      return { error: null };
    }

    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          organization_id: job.organization_id,
          posted_by: job.posted_by,
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description || "",
          is_active: true
        }])
        .select()
        .single();

      if (!error && data) {
        await get().fetchJobs(job.organization_id);
      }
      return { error };
    } catch (e) {
      console.error("Error adding job:", e);
      return { error: e };
    }
  },

  deleteJob: async (id, organizationId) => {
    if (isMock || (id && id.toString().startsWith("mock-"))) {
      set((state) => ({
        jobs: state.jobs.filter(job => job.id !== id)
      }));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (!error) {
        await get().fetchJobs(organizationId);
      }
      return { error };
    } catch (e) {
      console.error("Error deleting job:", e);
      return { error: e };
    }
  },

  // ── MENTORSHIP REQUESTS ──
  mentorshipRequests: [
    { id: generateId(), name: "Sarah Jenkins", major: "Computer Science '25", message: "Hi! I saw your profile and I am very interested in learning about your transition from college to a FAANG company. Would love to chat!", status: "pending", student_id: "student-1", alumni_id: "mock-alumni-id" },
    { id: generateId(), name: "Michael Chen", major: "Data Science '26", message: "I am looking for guidance on building a portfolio for data engineering roles. Your experience at Spotify seems super relevant.", status: "pending", student_id: "student-2", alumni_id: "mock-alumni-id" },
  ],

  fetchMentorshipRequests: async (profileId, role) => {
    if (isMock) return;
    try {
      let query = supabase.from('mentorship_requests').select(`
        *,
        student_profile:profiles!student_id(full_name, headline),
        alumni_profile:profiles!alumni_id(full_name, headline)
      `);
      
      if (role === 'student') {
        query = query.eq('student_id', profileId);
      } else if (role === 'alumni') {
        query = query.eq('alumni_id', profileId);
      }

      const { data, error } = await query;
      if (!error && data) {
        const mapped = data.map(req => ({
          id: req.id,
          student_id: req.student_id,
          alumni_id: req.alumni_id,
          name: role === 'alumni' ? (req.student_profile?.full_name || "Student") : (req.alumni_profile?.full_name || "Alumni"),
          major: role === 'alumni' ? (req.student_profile?.headline || "Computer Science") : (req.alumni_profile?.headline || "Mentor"),
          message: req.message,
          status: req.status
        }));
        set({ mentorshipRequests: mapped });
      }
    } catch (e) {
      console.error("Error fetching mentorship requests:", e);
    }
  },

  addMentorshipRequest: async (request) => {
    if (isMock) {
      set((state) => ({
        mentorshipRequests: [{ id: generateId(), status: "pending", ...request }, ...state.mentorshipRequests]
      }));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .insert([{
          organization_id: request.organization_id,
          student_id: request.student_id,
          alumni_id: request.alumni_id,
          message: request.message,
          status: 'pending'
        }]);

      if (!error) {
        await get().fetchMentorshipRequests(request.student_id, 'student');
      }
      return { error };
    } catch (e) {
      console.error("Error adding mentorship request:", e);
      return { error: e };
    }
  },

  updateMentorshipStatus: async (id, status, profileId, role) => {
    if (isMock || (id && id.toString().startsWith("mock-"))) {
      set((state) => ({
        mentorshipRequests: state.mentorshipRequests.map(req => 
          req.id === id ? { ...req, status } : req
        )
      }));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .update({ status })
        .eq('id', id);

      if (!error) {
        await get().fetchMentorshipRequests(profileId, role);
      }
      return { error };
    } catch (e) {
      console.error("Error updating mentorship status:", e);
      return { error: e };
    }
  },

  // ── EVENTS ──
  events: [
    { id: generateId(), title: "Tech Industry Mixer", date: "Oct 15, 2026", time: "6:00 PM EST", location: "Virtual (Zoom)", attendees: 124, type: "Networking", color: "#00D4FF", description: "Meet professionals and students from all tech domains." },
    { id: generateId(), title: "Mock Interview Workshop", date: "Oct 18, 2026", time: "2:00 PM EST", location: "Student Center, Room 204", attendees: 45, type: "Career Growth", color: "#34D399", description: "Simulate coding interviews with alumni in tech." },
    { id: generateId(), title: "Alumni Panel: Startup vs FAANG", date: "Nov 02, 2026", time: "5:30 PM EST", location: "Main Auditorium", attendees: 310, type: "Panel Discussion", color: "#A78BFA", description: "Compare starting your career at dynamic startups vs massive conglomerates." },
  ],

  fetchEvents: async (organizationId) => {
    if (isMock) return;
    if (!organizationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(organizationId)) return;
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organization_id', organizationId)
        .order('event_date', { ascending: true });

      if (!error && data) {
        const mapped = data.map(evt => {
          const dateObj = new Date(evt.event_date);
          return {
            id: evt.id,
            title: evt.title,
            description: evt.description || "",
            date: dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
            time: dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
            location: evt.location,
            attendees: 24,
            type: "Networking",
            color: "#00D4FF"
          };
        });
        set({ events: mapped });
      }
    } catch (e) {
      console.error("Error fetching events:", e);
    }
  },

  addEvent: async (event) => {
    if (isMock) {
      set((state) => ({
        events: [{ id: generateId(), attendees: 1, color: "#F59E0B", ...event }, ...state.events]
      }));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          organization_id: event.organization_id,
          created_by: event.created_by,
          title: event.title,
          description: event.description || "",
          event_date: event.event_date,
          location: event.location
        }]);

      if (!error) {
        await get().fetchEvents(event.organization_id);
      }
      return { error };
    } catch (e) {
      console.error("Error adding event:", e);
      return { error: e };
    }
  },

  // ── VERIFIED ALUMNI, FACULTY, AND MENTORS ──
  verifiedAlumni: (typeof window !== 'undefined' && localStorage.getItem('alumni_crm_mock_verified_alumni')) ? JSON.parse(localStorage.getItem('alumni_crm_mock_verified_alumni')) : [
    {
      id: "mock-alumni-1",
      full_name: "Priya Sharma",
      role: "alumni",
      headline: "Product Manager @ Google",
      industry: "Tech",
      linkedin_url: "https://linkedin.com/in/priya-sharma",
      is_verified: true,
      stream: "Computer Science",
      alumni_category: "Working Professional",
      graduation_year: "2021",
      bio: "Product Manager with 4+ years of experience leading growth and interface design at Google. Passionate about helping juniors transition into product management roles.",
      current_company: "Google",
      current_role: "Product Manager",
      experience: [
        { title: "Product Manager", company: "Google", duration: "2022 - Present", description: "Spearheading UI workflows for search products. Partnered with engineering teams to scale active user counts." },
        { title: "Associate Product Manager", company: "Microsoft", duration: "2021 - 2022", description: "Coordinated feature iterations for MS Teams collaboration workspace." }
      ],
      education: [
        { school: "Vidyalankar School of Information Technology (VSIT)", degree: "B.Sc. Computer Science", stream: "Computer Science", duration: "2018 - 2021" }
      ],
      skills: ["Product Strategy", "User Experience", "Market Research", "Agile Methodologies", "SQL"],
      projects: [{ title: "User Analytics Hub", description: "Built custom Python scripts to parse daily event logs and graph critical dropoffs.", link: "https://github.com" }]
    },
    {
      id: "mock-alumni-2",
      full_name: "David Kim",
      role: "alumni",
      headline: "Senior Software Engineer @ Netflix",
      industry: "Tech",
      linkedin_url: "https://linkedin.com/in/david-kim",
      is_verified: true,
      stream: "Information Technology",
      alumni_category: "Working Professional",
      graduation_year: "2018",
      bio: "High-performance software engineer specialized in real-time video architectures, microservices optimization, and distributed systems.",
      current_company: "Netflix",
      current_role: "Senior Software Engineer",
      experience: [
        { title: "Senior Software Engineer", company: "Netflix", duration: "2021 - Present", description: "Optimizing media compression engines. Improved streaming stability on weak cellular links by 18%." },
        { title: "Software Engineer", company: "Amazon Web Services", duration: "2018 - 2021", description: "Designed load balancing layers for API gateways." }
      ],
      education: [
        { school: "Vidyalankar School of Information Technology (VSIT)", degree: "B.Sc. Information Technology", stream: "Information Technology", duration: "2015 - 2018" }
      ],
      skills: ["Distributed Systems", "Golang", "AWS Architecture", "Java", "Docker", "RESTful APIs"],
      projects: [{ title: "Tiny balancer", description: "High performance lightweight load balancer written in pure Go.", link: "https://github.com" }]
    },
    {
      id: "mock-alumni-3",
      full_name: "Ayesha Malik",
      role: "alumni",
      headline: "Data Scientist @ Amazon",
      industry: "Tech / Data",
      linkedin_url: "https://linkedin.com/in/ayesha-malik",
      is_verified: true,
      stream: "Computer Science",
      alumni_category: "Working Professional",
      graduation_year: "2023",
      bio: "Data enthusiast. Focused on machine learning analytics, predictive sales models, and database systems. Experienced in Python data pipelines and automated reporting widgets.",
      current_company: "Amazon",
      current_role: "Data Scientist",
      experience: [
        { title: "Data Scientist", company: "Amazon", duration: "2023 - Present", description: "Modeling purchase probabilities inside recommended feeds. Developing scalable Spark algorithms." }
      ],
      education: [
        { school: "Vidyalankar School of Information Technology (VSIT)", degree: "B.Sc. Computer Science", stream: "Computer Science", duration: "2020 - 2023" }
      ],
      skills: ["Machine Learning", "Python", "Apache Spark", "Pandas", "SQL Analytics", "Tableau"],
      projects: [{ title: "Recommender system", description: "Python based item-to-item collaborative recommendation pipeline.", link: "https://github.com" }]
    },
    {
      id: "mock-alumni-4",
      full_name: "Marcus Johnson",
      role: "mentor",
      headline: "Lead UX Designer @ Apple | Mentorship Partner",
      industry: "Design",
      linkedin_url: "https://linkedin.com/in/marcus-johnson",
      is_verified: true,
      stream: "Information Technology",
      alumni_category: "Mentor",
      graduation_year: "2020",
      bio: "Interface architect and designer. Passionate about accessibility, visual systems, and clean transitions. Enjoy mentoring junior designers.",
      current_company: "Apple",
      current_role: "Lead UX Designer",
      experience: [
        { title: "Lead UX Designer", company: "Apple", duration: "2022 - Present", description: "Directing interaction models for native software tools. Running global user experience research campaigns." },
        { title: "UI Designer", company: "Adobe", duration: "2020 - 2022", description: "Designed vectors tools for Figma integrations." }
      ],
      education: [
        { school: "Vidyalankar School of Information Technology (VSIT)", degree: "B.Sc. Information Technology", stream: "Information Technology", duration: "2017 - 2020" }
      ],
      skills: ["Interaction Design", "Figma", "User Research", "Wireframing", "A/B Testing", "Visual Styling"],
      projects: [{ title: "Figma vector plugin", description: "Custom plugin to speed up vector alignment commands.", link: "https://github.com" }]
    },
    {
      id: "mock-alumni-5",
      full_name: "Prof. Rajesh Patil",
      role: "faculty",
      headline: "Professor & Head of Information Technology @ VSIT",
      industry: "Education",
      linkedin_url: "https://linkedin.com/in/rajesh-patil",
      is_verified: true,
      stream: "Information Technology",
      alumni_category: "Faculty",
      graduation_year: "1998",
      bio: "Dedicated educator and head of department at VSIT with over 15 years of instruction experience. Researching automated learning models.",
      current_company: "VSIT",
      current_role: "HOD and Professor",
      experience: [
        { title: "HOD and Professor (IT)", company: "Vidyalankar School of Information Technology", duration: "2015 - Present", description: "Administering academic curriculums, directing department guidelines, and coordinating corporate partnerships." },
        { title: "Assistant Professor", company: "VJTI Mumbai", duration: "2010 - 2015", description: "Instructed advanced algorithm design and databases." }
      ],
      education: [
        { school: "IIT Bombay", degree: "Ph.D. in Computer Science", stream: "Computer Science", duration: "2006 - 2010" }
      ],
      skills: ["Pedagogy", "Academic Writing", "Curriculum Design", "Machine Learning", "Data Structures"],
      projects: []
    },
    {
      id: "mock-alumni-6",
      full_name: "Amit Deshmukh",
      role: "alumni",
      headline: "Co-Founder & CTO @ HealthSync",
      industry: "Tech / Healthcare",
      linkedin_url: "https://linkedin.com/in/amit-deshmukh",
      is_verified: true,
      stream: "Electronics",
      alumni_category: "Entrepreneur",
      graduation_year: "2017",
      bio: "Tech co-founder building the future of clinic communications and real-time patient charts.",
      current_company: "HealthSync",
      current_role: "Co-Founder & CTO",
      experience: [
        { title: "Co-Founder & CTO", company: "HealthSync", duration: "2020 - Present", description: "Drafted HIPAA-compliant backend platform. Raised $1.2M in seed capital and scaled tech team to 10 devs." },
        { title: "Senior Developer", company: "Cognizant", duration: "2017 - 2020", description: "Full-stack engineer on hospital management client software." }
      ],
      education: [
        { school: "Vidyalankar School of Information Technology (VSIT)", degree: "B.Sc. Electronics", stream: "Electronics", duration: "2014 - 2017" }
      ],
      skills: ["Entrepreneurship", "Next.js", "Docker", "HIPAA Compliance", "NodeJS", "Investor Pitching"],
      projects: []
    },
    {
      id: "mock-alumni-7",
      full_name: "Rahul Verma",
      role: "alumni",
      headline: "M.S. Student @ Georgia Tech",
      industry: "Research",
      linkedin_url: "https://linkedin.com/in/rahul-verma",
      is_verified: true,
      stream: "Computer Science",
      alumni_category: "Higher Studies",
      graduation_year: "2022",
      bio: "Pursuing higher studies in Computer Science focusing on compiler architectures and visual mapping models.",
      current_company: "Georgia Institute of Technology",
      current_role: "Graduate Research Assistant",
      experience: [
        { title: "Graduate Research Assistant", company: "Georgia Tech", duration: "2023 - Present", description: "Publishing frameworks for LLM compilation efficiency on custom GPU hardware slots." }
      ],
      education: [
        { school: "Georgia Institute of Technology", degree: "M.S. Computer Science", stream: "Computer Science", duration: "2022 - 2024" },
        { school: "Vidyalankar School of Information Technology (VSIT)", degree: "B.Sc. Computer Science", stream: "Computer Science", duration: "2019 - 2022" }
      ],
      skills: ["Compiler Theory", "C++", "CUDA", "Linux Systems", "Academic Research"],
      projects: []
    },
    {
      id: "mock-alumni-8",
      full_name: "Sneha Patel",
      role: "alumni",
      headline: "Product Manager @ Flipkart",
      industry: "Tech",
      linkedin_url: "https://linkedin.com/in/sneha-patel",
      is_verified: true,
      stream: "Computer Science",
      alumni_category: "Working Professional",
      graduation_year: "2019",
      bio: "Analytical product strategist focusing on checkout optimizations, payment instruments, and fraud detection frameworks.",
      current_company: "Flipkart",
      current_role: "Product Manager",
      experience: [
        { title: "Product Manager", company: "Flipkart", duration: "2020 - Present", description: "Directing product pipelines for the cart experience. Raised user checkout conversions by 3.2%." }
      ],
      education: [
        { school: "Vidyalankar School of Information Technology (VSIT)", degree: "B.Sc. Computer Science", stream: "Computer Science", duration: "2016 - 2019" }
      ],
      skills: ["Product Scoping", "Metrics Analytics", "Figma Design", "User Interviews"],
      projects: []
    }
  ],

  fetchVerifiedAlumni: async (organizationId) => {
    if (isMock) return;
    if (!organizationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(organizationId)) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', organizationId)
        .in('role', ['alumni', 'faculty', 'mentor'])
        .eq('is_verified', true);

      if (!error && data) {
        set({ verifiedAlumni: data });
      }
    } catch (e) {
      console.error("Error fetching verified alumni:", e);
    }
  },

  // ── ADMIN PENDING VERIFICATIONS ──
  pendingVerifications: (typeof window !== 'undefined' && localStorage.getItem('alumni_crm_mock_pending_verifications')) ? JSON.parse(localStorage.getItem('alumni_crm_mock_pending_verifications')) : [
    { id: "mock-unverified-alumni-1", full_name: "Gaurav Sawant", role: "alumni", headline: "Software Engineer @ Amazon", industry: "Tech", is_verified: false, graduation_year: "2021", major: "Information Technology" },
    { id: "mock-unverified-alumni-2", full_name: "Nikhil Gupta", role: "alumni", headline: "Systems Engineer @ TCS", industry: "Tech", is_verified: false, graduation_year: "2020", major: "Computer Science" },
  ],

  fetchPendingVerifications: async (organizationId) => {
    if (isMock) return;
    if (!organizationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(organizationId)) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('role', 'alumni')
        .eq('is_verified', false);

      if (!error && data) {
        const mapped = data.map(p => ({
          id: p.id,
          full_name: p.full_name,
          role: p.role,
          headline: p.headline || "Alumni",
          industry: p.industry || "Unknown",
          is_verified: p.is_verified,
          graduation_year: p.headline?.match(/\b(20\d{2})\b/)?.[1] || "2022", // extract year if in headline, else default
          major: p.headline?.split('\'')?.[0] || "Information Technology"
        }));
        set({ pendingVerifications: mapped });
      }
    } catch (e) {
      console.error("Error fetching pending verifications:", e);
    }
  },

  verifyAlumni: async (alumniId, status, organizationId) => {
    if (isMock || (alumniId && alumniId.toString().startsWith("mock-"))) {
      if (status) {
        const unverified = get().pendingVerifications.find(p => p.id === alumniId);
        if (unverified) {
          const newVerified = {
            id: unverified.id,
            full_name: unverified.full_name,
            role: unverified.role,
            headline: unverified.headline,
            industry: unverified.industry,
            linkedin_url: "https://linkedin.com",
            is_verified: true,
            stream: unverified.major,
            alumni_category: "Working Professional",
            graduation_year: unverified.graduation_year,
            bio: "Sync your profile to add your summary.",
            current_company: unverified.headline.split('@')[1]?.trim() || "Tech Corp",
            current_role: unverified.headline.split('@')[0]?.trim() || "Software Engineer",
            experience: [
              { title: unverified.headline.split('@')[0]?.trim() || "Software Engineer", company: unverified.headline.split('@')[1]?.trim() || "Tech Corp", duration: "2022 - Present", description: "Professional role details." }
            ],
            education: [
              { school: "Vidyalankar School of Information Technology (VSIT)", degree: "B.Sc. " + unverified.major, stream: unverified.major, duration: "2018 - 2021" }
            ],
            skills: ["Technical Skills"],
            projects: []
          };
          set((state) => {
            const updatedVerified = [...state.verifiedAlumni, newVerified];
            const updatedPending = state.pendingVerifications.filter(p => p.id !== alumniId);
            if (typeof window !== 'undefined') {
              localStorage.setItem('alumni_crm_mock_verified_alumni', JSON.stringify(updatedVerified));
              localStorage.setItem('alumni_crm_mock_pending_verifications', JSON.stringify(updatedPending));
            }
            return {
              verifiedAlumni: updatedVerified,
              pendingVerifications: updatedPending
            };
          });
        }
      } else {
        set((state) => {
          const updatedPending = state.pendingVerifications.filter(p => p.id !== alumniId);
          if (typeof window !== 'undefined') {
            localStorage.setItem('alumni_crm_mock_pending_verifications', JSON.stringify(updatedPending));
          }
          return {
            pendingVerifications: updatedPending
          };
        });
      }
      return { error: null };
    }

    try {
      let error = null;
      if (status) {
        const { error: err } = await supabase
          .from('profiles')
          .update({ is_verified: true })
          .eq('id', alumniId);
        error = err;
      } else {
        const { error: err } = await supabase
          .from('profiles')
          .delete()
          .eq('id', alumniId);
        error = err;
      }

      if (!error) {
        await get().fetchPendingVerifications(organizationId);
        await get().fetchVerifiedAlumni(organizationId);
      }
      return { error };
    } catch (e) {
      console.error("Error verifying alumni:", e);
      return { error: e };
    }
  },

  importAlumniFromCSV: async (alumniList, organizationId, isVerified = true) => {
    const isMockImport = isMock || organizationId === "mock-org-id";
    if (!isMockImport && (!organizationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(organizationId))) {
      return { error: new Error("Invalid Organization ID format (must be a valid UUID). Please ensure you have run the organization setup SQL script first.") };
    }
    if (isMockImport) {
      const generateId = () => Math.random().toString(36).substr(2, 9);
      
      if (!isVerified) {
        // Import as unverified (pending requests queue)
        const mappedPending = alumniList.map(a => ({
          id: `mock-pending-${generateId()}`,
          full_name: a.full_name,
          role: a.role || "alumni",
          headline: a.current_role ? `${a.current_role} @ ${a.current_company}` : (a.headline || "Alumni"),
          industry: a.industry || "Tech",
          is_verified: false,
          graduation_year: a.graduation_year || "2022",
          major: a.stream || "Information Technology"
        }));

        set((state) => {
          const updated = [...state.pendingVerifications, ...mappedPending];
          if (typeof window !== 'undefined') {
            localStorage.setItem('alumni_crm_mock_pending_verifications', JSON.stringify(updated));
          }
          return { pendingVerifications: updated };
        });
        return { error: null, count: mappedPending.length };
      }

      // Import as verified
      const mapped = alumniList.map(a => ({
        id: `mock-imported-${generateId()}`,
        organization_id: organizationId || "mock-org-id",
        role: a.role || "alumni",
        full_name: a.full_name,
        headline: a.current_role ? `${a.current_role} @ ${a.current_company}` : (a.headline || "Alumni"),
        industry: a.industry || "Tech",
        linkedin_url: a.linkedin_url || "https://linkedin.com",
        is_verified: true,
        stream: a.stream || "Computer Science",
        alumni_category: a.alumni_category || "Working Professional",
        graduation_year: a.graduation_year || "2022",
        bio: a.bio || "Imported professional details.",
        current_company: a.current_company || "N/A",
        current_role: a.current_role || "N/A",
        experience: a.current_role ? [{
          title: a.current_role,
          company: a.current_company,
          duration: "2022 - Present",
          description: "Professional position imported via CSV."
        }] : [],
        education: a.graduation_year ? [{
          school: "Vidyalankar School of Information Technology (VSIT)",
          degree: "B.Sc. " + (a.stream || "Information Technology"),
          stream: a.stream || "Information Technology",
          duration: `${parseInt(a.graduation_year) - 3} - ${a.graduation_year}`
        }] : [],
        skills: a.skills || [],
        projects: [],
        created_at: new Date().toISOString()
      }));

      set((state) => {
        const updated = [...state.verifiedAlumni, ...mapped];
        if (typeof window !== 'undefined') {
          localStorage.setItem('alumni_crm_mock_verified_alumni', JSON.stringify(updated));
        }
        return { verifiedAlumni: updated };
      });
      return { error: null, count: mapped.length };
    }

    try {
      const profilesToInsert = alumniList.map(a => {
        const profileId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return {
          id: profileId,
          organization_id: organizationId,
          role: a.role || 'alumni',
          full_name: a.full_name,
          headline: a.current_role ? `${a.current_role} @ ${a.current_company}` : 'Alumni',
          industry: a.industry || 'Technology',
          linkedin_url: a.linkedin_url || '',
          is_verified: isVerified,
          stream: a.stream || '',
          alumni_category: a.alumni_category || 'Working Professional',
          graduation_year: a.graduation_year || '',
          bio: a.bio || '',
          current_company: a.current_company || '',
          current_role: a.current_role || '',
          experience: a.current_role ? [{ title: a.current_role, company: a.current_company, duration: '2022 - Present' }] : [],
          education: a.graduation_year ? [{ school: 'Vidyalankar School of Information Technology (VSIT)', degree: 'B.Sc. ' + a.stream, stream: a.stream, duration: `${parseInt(a.graduation_year)-3} - ${a.graduation_year}` }] : [],
          skills: a.skills || []
        };
      });

      const { data, error } = await supabase
        .from('profiles')
        .insert(profilesToInsert)
        .select();

      if (!error) {
        if (isVerified) {
          await get().fetchVerifiedAlumni(organizationId);
        } else {
          await get().fetchPendingVerifications(organizationId);
        }
      }
      return { error, count: data ? data.length : 0 };
    } catch (e) {
      console.error("Error importing alumni to Supabase:", e);
      return { error: e, count: 0 };
    }
  }
}));
