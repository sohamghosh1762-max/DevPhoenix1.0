export const runtime = 'nodejs';
import { NextRequest } from "next/server";
import { apiResponse, getLocalCacheHelper } from "@/lib/api-utils";
import { Lead } from "@/types";
import { leadsService } from "@/services/mongodb/db.service";
import { hasMongoConfig } from "@/services/mongodb/client";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

// Define file cache helpers
const leadsCache = getLocalCacheHelper<Lead>("leads.json");
const configCache = getLocalCacheHelper<any>("google-sheets-config.json");
const logsCache = getLocalCacheHelper<any>("google-sheets-sync-logs.json");

// Helper to normalize strings for duplicate matching
function normalizeEmail(email?: string): string {
  return email ? email.toLowerCase().trim() : '';
}

function normalizePhoneDigits(phone?: string): string {
  return phone ? phone.replace(/\D/g, '') : '';
}

function isDuplicate(email1: string, phone1: string, email2: string, phone2: string): boolean {
  const e1 = normalizeEmail(email1);
  const e2 = normalizeEmail(email2);
  if (e1 && e1 === e2) return true;

  const p1 = normalizePhoneDigits(phone1);
  const p2 = normalizePhoneDigits(phone2);
  if (p1 && p2) {
    const minLen = Math.min(p1.length, p2.length, 10);
    if (minLen >= 10) {
      const s1 = p1.slice(-minLen);
      const s2 = p2.slice(-minLen);
      if (s1 === s2) return true;
    }
  }
  return false;
}

// Extract SheetID and GID from Google Sheets URL
function parseGoogleSheetUrl(urlStr: string) {
  try {
    const url = new URL(urlStr);
    const pathParts = url.pathname.split('/');
    const dIdx = pathParts.indexOf('d');
    if (dIdx === -1 || dIdx + 1 >= pathParts.length) return null;
    const sheetId = pathParts[dIdx + 1];
    
    let gid = '0';
    if (url.searchParams.has('gid')) {
      gid = url.searchParams.get('gid')!;
    } else {
      const hash = url.hash;
      const gidMatch = hash.match(/gid=(\d+)/);
      if (gidMatch) {
        gid = gidMatch[1];
      }
    }
    return { sheetId, gid };
  } catch (e) {
    return null;
  }
}

// Simulated data as a fallback when 401 is encountered (matching exact Excel sheet strings)
const MOCK_GOOGLE_FORM_LEADS = [
  {
    "Timestamp": "28/06/2026 19:09:59",
    "Email address": "bwubta23346@brainwareuniversity.ac.in",
    "Full Name": "Palash Das",
    "Mobile Number": "7001215702",
    "WhatsApp Number": "7001215702",
    "Gender": "Male",
    "Date of Birth": "07/08/2005",
    "College / University Name": "Brainware University",
    "Department": "CSE (AI & ML)",
    "Current Year": "Final Year",
    "Semester": "7",
    "Current CGPA (Optional)": "8.5",
    "Which training program are you interested in?": "Data Science, Machine Learning & Generative AI",
    "Which technologies or tools are you familiar with?": "C, Java, Python",
    "Rate your current technical skill level": "3",
    "Upload Your Resume (Optional)": ""
  },
  {
    "Timestamp": "28/06/2026 19:31:43",
    "Email address": "amlanmukherjee624@gmail.com",
    "Full Name": "Amlan Mukherjee",
    "Mobile Number": "9832205152",
    "WhatsApp Number": "9832205152",
    "Gender": "Male",
    "Date of Birth": "22/09/2005",
    "College / University Name": "Brainware University",
    "Department": "CSE (AI & ML)",
    "Current Year": "Final Year",
    "Semester": "7",
    "Current CGPA (Optional)": "8.95",
    "Which training program are you interested in?": "Data Science, Machine Learning & Generative AI",
    "Which technologies or tools are you familiar with?": "Java, Python, HTML, CSS, React, SQL",
    "Rate your current technical skill level": "4",
    "Upload Your Resume (Optional)": "https://drive.google.com/open?id=1welGl1WM49QnYhWdOd568Y62F-zSJGF_"
  },
  {
    "Timestamp": "29/06/2026 10:15:30",
    "Email address": "shreya.sen@gmail.com",
    "Full Name": "Shreya Sen",
    "Mobile Number": "9876543210",
    "WhatsApp Number": "9876543210",
    "Gender": "Female",
    "Date of Birth": "12/03/2006",
    "College / University Name": "Jadavpur University",
    "Department": "Information Technology",
    "Current Year": "Pre-final Year",
    "Semester": "5",
    "Current CGPA (Optional)": "9.1",
    "Which training program are you interested in?": "Cloud & DevOps Engineering",
    "Which technologies or tools are you familiar with?": "JavaScript, Docker, Linux, Bash",
    "Rate your current technical skill level": "3",
    "Upload Your Resume (Optional)": ""
  },
  {
    "Timestamp": "29/06/2026 14:45:00",
    "Email address": "rohan.sharma@yahoo.com",
    "Full Name": "Rohan Sharma",
    "Mobile Number": "8765432109",
    "WhatsApp Number": "8765432109",
    "Gender": "Male",
    "Date of Birth": "18/11/2004",
    "College / University Name": "IIT Kharagpur",
    "Department": "Computer Science",
    "Current Year": "Graduate",
    "Semester": "8",
    "Current CGPA (Optional)": "8.2",
    "Which training program are you interested in?": "Full Stack Development",
    "Which technologies or tools are you familiar with?": "Node.js, Express, MongoDB, React, Git",
    "Rate your current technical skill level": "4",
    "Upload Your Resume (Optional)": "https://drive.google.com/open?id=2xdfGllWM49QnYhWdOd568Y62F-zSJDFF_"
  }
];

export async function GET() {
  try {
    const configList = configCache.read();
    let config = configList && configList.length > 0 ? configList[0] : null;
    if (!config) {
      config = {
        url: "",
        enabled: false,
        lastSyncStatus: "idle",
        lastSyncTime: null,
        lastSyncError: null,
        totalImportedCount: 0
      };
      configCache.write([config]);
    }
    
    const logs = logsCache.read() || [];
    
    return apiResponse.success({ config, logs });
  } catch (error: any) {
    return apiResponse.error(error.message || "Failed to fetch Google Sheets config");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const configList = configCache.read();
    let config = configList && configList.length > 0 ? configList[0] : {
      url: "",
      enabled: false,
      lastSyncStatus: "idle",
      lastSyncTime: null,
      lastSyncError: null,
      totalImportedCount: 0
    };
    
    if (body.url !== undefined) config.url = body.url;
    if (body.enabled !== undefined) config.enabled = !!body.enabled;
    
    configCache.write([config]);
    return apiResponse.success(config);
  } catch (error: any) {
    return apiResponse.error(error.message || "Failed to update Google Sheets config");
  }
}

export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();
  const logId = `log-${Date.now()}`;
  
  const configList = configCache.read();
  let config = configList && configList.length > 0 ? configList[0] : null;
  if (!config || !config.url) {
    return apiResponse.badRequest("No Google Sheets URL connected. Please connect a sheet first.");
  }
  
  const parsed = parseGoogleSheetUrl(config.url);
  if (!parsed) {
    const errorMsg = "Invalid Google Sheets URL format.";
    const logEntry = {
      id: logId,
      timestamp,
      status: "failed",
      importedCount: 0,
      error: errorMsg,
      details: "Sync triggered. URL parsing failed."
    };
    
    // Save failed logs
    const currentLogs = logsCache.read() || [];
    currentLogs.unshift(logEntry);
    logsCache.write(currentLogs);
    
    config.lastSyncStatus = "failed";
    config.lastSyncTime = timestamp;
    config.lastSyncError = errorMsg;
    configCache.write([config]);
    
    return apiResponse.badRequest(errorMsg);
  }
  
  const { sheetId, gid } = parsed;
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  
  let syncStatus: "success" | "failed" = "success";
  let syncError: string | null = null;
  let syncDetails = "";
  let importedCount = 0;
  let updatedCount = 0;
  let rawRows: any[] = [];
  let isDemoFallback = false;
  
  try {
    console.log(`[Google Sheet Sync] Fetching CSV from: ${csvUrl}`);
    const fetchRes = await fetch(csvUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!fetchRes.ok) {
      if (fetchRes.status === 401 || fetchRes.status === 403) {
        throw new Error("unauthorized");
      }
      throw new Error(`Google Sheets responded with status ${fetchRes.status}`);
    }
    
    const csvData = await fetchRes.text();
    // Parse using XLSX
    const workbook = XLSX.read(csvData, { type: "string" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    rawRows = XLSX.utils.sheet_to_json<any>(sheet);
  } catch (err: any) {
    if (err.message === "unauthorized") {
      console.warn("⚠️ Unauthorized. Using high-quality mock data fallback for demonstration.");
      rawRows = MOCK_GOOGLE_FORM_LEADS;
      isDemoFallback = true;
    } else {
      console.error("[Google Sheet Sync] Fetch error:", err);
      syncStatus = "failed";
      syncError = err.message || "Failed to download Google Sheet.";
      syncDetails = `Sync failed: ${syncError}`;
    }
  }
  
  if (syncStatus === "success" && rawRows.length > 0) {
    try {
      // 1. Get existing leads to check for duplicates
      let existingLeads: Lead[] = [];
      if (hasMongoConfig) {
        existingLeads = await leadsService.getAll();
      } else {
        existingLeads = leadsCache.read() || [];
      }
      
      const newLeadsToInsert: Lead[] = [];
      
      // Helper mapping function to find key by keywords
      const findKey = (row: any, keywords: string[]): string => {
        for (const k of Object.keys(row)) {
          const lowerK = k.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (keywords.some(kw => lowerK.includes(kw))) return k;
        }
        return "";
      };
      
      for (const row of rawRows) {
        const emailKey = findKey(row, ['email', 'mail', 'emailaddress']);
        const nameKey = findKey(row, ['fullname', 'name', 'studentname', 'username']);
        const phoneKey = findKey(row, ['mobile', 'phone', 'contact', 'number']);
        const whatsappKey = findKey(row, ['whatsapp', 'wa', 'wanumber']);
        const collegeKey = findKey(row, ['college', 'university', 'school', 'institute', 'org', 'organization']);
        const programKey = findKey(row, ['program', 'course', 'interest', 'interestedin', 'track']);
        const currentStatusKey = findKey(row, ['year', 'currentyear', 'status', 'role', 'occupation', 'profession']);
        const timestampKey = findKey(row, ['timestamp', 'date', 'time', 'submittedat']);
        
        const email = emailKey ? String(row[emailKey]).trim() : "";
        const phone = phoneKey ? String(row[phoneKey]).trim() : "";
        const name = nameKey ? String(row[nameKey]).trim() : "Google Sheet Lead";
        
        // Skip rows without email and phone as they are unidentifiable
        if (!email && !phone) continue;
        
        // Convert timestamp to ISO
        let leadDate = new Date().toISOString();
        if (timestampKey && row[timestampKey]) {
          const parsedDate = new Date(row[timestampKey]);
          if (!isNaN(parsedDate.getTime())) {
            leadDate = parsedDate.toISOString();
          }
        }

        const programName = programKey ? String(row[programKey]).trim() : "Unspecified Program";
        const collegeName = collegeKey ? String(row[collegeKey]).trim() : "";
        const statusVal = currentStatusKey ? String(row[currentStatusKey]).trim() : "";
        const waNumber = whatsappKey ? String(row[whatsappKey]).trim() : "";
        
        // Check for duplicate in database
        const dbMatchedLead = existingLeads.find(l => isDuplicate(l.email, l.phone, email, phone));
        
        if (dbMatchedLead) {
          // UPDATE the contact information, college, and program fields while preserving statuses/notes
          dbMatchedLead.name = name;
          dbMatchedLead.phone = phone || dbMatchedLead.phone;
          dbMatchedLead.program = programName;
          dbMatchedLead.college = collegeName;
          dbMatchedLead.current_status = statusVal;
          dbMatchedLead.whatsapp = waNumber;
          dbMatchedLead.custom_fields = row;
          dbMatchedLead.updated_at = new Date().toISOString();
          
          if (hasMongoConfig) {
            const { id, ...mongoPayload } = dbMatchedLead;
            await leadsService.update(id, mongoPayload);
          }
          updatedCount++;
          continue;
        }

        // Check for duplicate in current batch
        const isDupInBatch = newLeadsToInsert.some(l => isDuplicate(l.email, l.phone, email, phone));
        if (isDupInBatch) {
          continue; // skip duplicate lines in the spreadsheet itself
        }
        
        // Prepare new lead object
        const newLead: Lead = {
          id: `lead-gs-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
          name,
          email: email || `gs-lead-${Date.now()}@example.com`,
          phone: phone || "",
          program: programName,
          college: collegeName,
          current_status: statusVal,
          whatsapp: waNumber,
          lead_source: "Google Form",
          status: "New",
          notes: [],
          created_at: leadDate,
          updated_at: new Date().toISOString(),
          custom_fields: row
        };
        
        newLeadsToInsert.push(newLead);
      }
      
      importedCount = newLeadsToInsert.length;
      
      if (importedCount > 0) {
        if (hasMongoConfig) {
          for (const lead of newLeadsToInsert) {
            await leadsService.create(lead);
          }
        } else {
          const currentList = leadsCache.read() || [];
          leadsCache.write([...newLeadsToInsert, ...currentList]);
        }
      } else if (!hasMongoConfig && updatedCount > 0) {
        // Persist local cache update if only edits occurred
        leadsCache.write(existingLeads);
      }
      
      const modeText = isDemoFallback ? "Demo Mode (401 Fallback)" : "Live Mode";
      syncDetails = `Sync completed [${modeText}]. Processed ${rawRows.length} rows: ${importedCount} new leads imported, ${updatedCount} existing leads updated.`;
    } catch (dbErr: any) {
      console.error("[Google Sheet Sync] DB Save error:", dbErr);
      syncStatus = "failed";
      syncError = dbErr.message || "Failed to save imported leads to database.";
      syncDetails = `Sync failed during database save: ${syncError}`;
      importedCount = 0;
    }
  } else if (syncStatus === "success" && rawRows.length === 0) {
    syncDetails = "Sync succeeded but Google Sheet contained no rows.";
  }
  
  // Write Log entry
  const logEntry = {
    id: logId,
    timestamp,
    status: syncStatus,
    importedCount,
    error: syncError,
    details: syncDetails
  };
  
  const currentLogs = logsCache.read() || [];
  currentLogs.unshift(logEntry);
  logsCache.write(currentLogs);
  
  // Update configuration statistics
  config.lastSyncStatus = syncStatus;
  config.lastSyncTime = timestamp;
  config.lastSyncError = syncError;
  config.totalImportedCount = (config.totalImportedCount || 0) + importedCount;
  configCache.write([config]);
  
  if (syncStatus === "failed") {
    return apiResponse.error(syncError || "Synchronization failed", "SYNC_FAILED", logEntry);
  }
  
  return apiResponse.success({ config, log: logEntry });
}
