/**
 * CSV Parser and Field Mapper Utility
 */

/**
 * Parses raw CSV text into a 2D array of strings.
 * Correctly handles nested double quotes, escaped quotes (""), and multi-line fields.
 * @param {string} text Raw CSV text content
 * @returns {string[][]} Array of rows, where each row is an array of cells
 */
export function parseCSV(text) {
  if (!text) return [];

  // Strip Byte Order Mark (BOM) if present (common in Excel CSV exports)
  if (text.startsWith("\ufeff")) {
    text = text.substring(1);
  } else if (text.startsWith("\xff\xfe") || text.startsWith("\xfe\xff")) {
    text = text.substring(2);
  }

  // Auto-detect delimiter: check first line for counts of commas, semicolons, tabs outside quotes
  let firstLine = "";
  let insideQuote = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      insideQuote = !insideQuote;
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      break;
    }
    firstLine += char;
  }

  let delimiter = ',';
  let maxCount = 0;
  const delimitersToCheck = [',', ';', '\t'];
  for (const d of delimitersToCheck) {
    let count = 0;
    let quote = false;
    for (let i = 0; i < firstLine.length; i++) {
      if (firstLine[i] === '"') {
        quote = !quote;
      } else if (firstLine[i] === d && !quote) {
        count++;
      }
    }
    if (count > maxCount) {
      maxCount = count;
      delimiter = d;
    }
  }

  const lines = [];
  let row = [""];
  insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        // Escaped double quote (e.g. "")
        row[row.length - 1] += '"';
        i++; // skip next quote
      } else {
        // Toggle quote state
        insideQuote = !insideQuote;
      }
    } else if (char === delimiter && !insideQuote) {
      // New cell
      row.push("");
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      // New row
      if (char === '\r' && nextChar === '\n') {
        i++; // skip LF
      }
      lines.push(row);
      row = [""];
    } else {
      row[row.length - 1] += char;
    }
  }

  // Add the last row if it contains data
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }

  // Filter out completely empty rows
  return lines.filter(r => r.length > 1 || (r[0] && r[0].trim() !== ""));
}

/**
 * Maps parsed 2D CSV row array to structured Alumni Profile objects.
 * Dynamically resolves columns by matching common header aliases.
 * @param {string[][]} rows 2D array of parsed CSV data
 * @returns {object[]} Array of structured profiles
 */
export function mapCSVRowsToProfiles(rows) {
  if (rows.length < 2) return [];
  
  // Clean headers and convert to lowercase for uniform comparison
  const headers = rows[0].map(h => h.trim().toLowerCase());
  
  const findIndex = (aliases) => {
    return headers.findIndex(h => aliases.includes(h));
  };

  // Aliases configuration mapping CSV columns to database fields
  const fieldMappings = {
    full_name: ['full_name', 'name', 'full name', 'fullname', 'candidate name'],
    email: ['email', 'email address', 'email_address', 'mail', 'email_id', 'email id'],
    current_role: ['current_role', 'job_title', 'job title', 'designation', 'current role', 'title', 'job designation'],
    current_company: ['current_company', 'company', 'current company', 'organization', 'enterprise', 'employer', 'workplace'],
    stream: ['stream', 'major', 'degree', 'branch', 'academic stream', 'field of study', 'department'],
    graduation_year: ['graduation_year', 'graduation year', 'year', 'batch', 'class', 'grad year', 'passing year'],
    alumni_category: ['alumni_category', 'alumni category', 'category', 'status', 'classification'],
    linkedin_url: ['linkedin_url', 'linkedin url', 'linkedin', 'linkedin link', 'profile url'],
    bio: ['bio', 'summary', 'biography', 'about', 'description', 'personal bio'],
    skills: ['skills', 'skills list', 'tags', 'endorsements', 'key skills'],
    industry: ['industry', 'sector', 'field'],
    system_role: ['system_role', 'role', 'user_role', 'type', 'user type', 'profile type', 'role type', 'account type']
  };

  // Find index for each mapping key
  const indices = {};
  for (const [key, aliases] of Object.entries(fieldMappings)) {
    indices[key] = findIndex(aliases);
  }

  const profiles = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    // Check if the entire row is blank
    const isRowEmpty = row.every(cell => !cell || cell.trim() === "");
    if (isRowEmpty) continue;

    const getVal = (key) => {
      const idx = indices[key];
      if (idx !== undefined && idx >= 0 && idx < row.length) {
        return row[idx]?.trim() || "";
      }
      return "";
    };

    // Extract fields with fallbacks to avoid skipping rows
    let fullName = getVal('full_name');
    const emailVal = getVal('email');
    
    if (!fullName) {
      if (emailVal) {
        // Fallback 1: Username from email
        fullName = emailVal.split('@')[0];
      } else {
        // Fallback 2: Index descriptor
        fullName = `Imported Alumnus #${profiles.length + 1}`;
      }
    }

    const skillsVal = getVal('skills');
    let parsedSkills = [];
    if (skillsVal) {
      // Split by comma or semicolon, filter out empty values
      parsedSkills = skillsVal.split(/[;,]/).map(s => s.trim()).filter(Boolean);
    }

    // Resolve system user role (student, alumni, faculty, mentor)
    let systemRole = getVal('system_role').toLowerCase();
    const validRoles = ['student', 'alumni', 'faculty', 'mentor'];
    if (!validRoles.includes(systemRole)) {
      // Intelligently infer role from category or string contents
      const category = getVal('alumni_category').toLowerCase();
      if (systemRole.includes('mentor') || category.includes('mentor')) {
        systemRole = 'mentor';
      } else if (systemRole.includes('faculty') || category.includes('faculty') || category.includes('professor') || category.includes('teacher')) {
        systemRole = 'faculty';
      } else if (systemRole.includes('student') || category.includes('student')) {
        systemRole = 'student';
      } else {
        systemRole = 'alumni'; // default fallback
      }
    }

    profiles.push({
      full_name: fullName,
      email: emailVal,
      current_role: getVal('current_role'),
      current_company: getVal('current_company'),
      stream: getVal('stream'),
      graduation_year: getVal('graduation_year'),
      alumni_category: getVal('alumni_category') || (systemRole === 'mentor' ? 'Mentor' : systemRole === 'faculty' ? 'Faculty' : 'Working Professional'),
      linkedin_url: getVal('linkedin_url'),
      bio: getVal('bio'),
      skills: parsedSkills,
      industry: getVal('industry') || 'Technology',
      role: systemRole
    });
  }

  return profiles;
}
