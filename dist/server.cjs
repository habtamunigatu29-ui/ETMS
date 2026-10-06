var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = require("crypto");
var import_vite = require("vite");
var import_helmet = __toESM(require("helmet"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var import_client = require("@prisma/client");

// src/lib/auth.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? "" : "development-only-et-ams-secret");
var JWT_EXPIRES_IN = "24h";
var SALT_ROUNDS = 10;
async function hashPassword(password) {
  return import_bcrypt.default.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
  return import_bcrypt.default.compare(password, hash);
}
function generateToken(user) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured in production");
  }
  return import_jsonwebtoken.default.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}
function verifyToken(token) {
  if (!JWT_SECRET) return null;
  try {
    return import_jsonwebtoken.default.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = typeof authHeader === "string" && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : void 0;
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
  req.user = decoded;
  next();
}
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to perform this action" });
    }
    next();
  };
}

// server.ts
var prisma = new import_client.PrismaClient();
var ROLES = ["SYSTEM_ADMIN", "HR_MANAGER", "DEPARTMENT_HEAD", "MENTOR", "APPRENTICE", "REPORTING_OFFICER"];
var withoutPasswordHash = (user) => {
  const { password_hash: _passwordHash, ...safeUser } = user;
  return safeUser;
};
async function startServer() {
  const app = (0, import_express.default)();
  const parsedPort = Number.parseInt(process.env.PORT || "3000", 10);
  const PORT = Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? parsedPort : 3e3;
  app.use(
    (0, import_helmet.default)({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: process.env.NODE_ENV === "production" ? ["'self'"] : ["'self'", "http://localhost:*", "ws://localhost:*"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"]
        }
      },
      hsts: { maxAge: 31536e3, includeSubDomains: true, preload: true }
    })
  );
  app.use(
    (0, import_cors.default)({
      origin: process.env.NODE_ENV === "production" ? ["https://ethiotelecom.et"] : ["http://localhost:3000", "http://localhost:5173"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );
  const limiter = (0, import_express_rate_limit.default)({
    windowMs: 15 * 60 * 1e3,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false
  });
  const authLimiter = (0, import_express_rate_limit.default)({
    windowMs: 15 * 60 * 1e3,
    max: 5,
    message: "Too many login attempts, please try again later.",
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);
  app.use(import_express.default.json({ limit: "10mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "10mb" }));
  const logAudit = async (userId, userName, role, action, targetType, targetId, details) => {
    await prisma.auditLog.create({
      data: {
        user_id: userId,
        user_name: userName,
        user_role: role,
        action,
        entity_type: targetType,
        entity_id: targetId,
        details
      }
    });
  };
  const calculateScreeningScore = (applicant) => {
    const gpaRatio = Math.min(applicant.gpa / 4, 1);
    const gpaScore = Math.round(gpaRatio * 30);
    const fieldLower = applicant.field_of_study.toLowerCase();
    const relevantFields = ["software engineering", "computer science", "telecommunications", "electrical & computer engineering", "electrical engineering", "information systems", "cyber security", "information technology", "computer engineering"];
    const isRelevant = relevantFields.some((f) => fieldLower.includes(f));
    const fieldScore = isRelevant ? 20 : 10;
    const uniLower = applicant.university.toLowerCase();
    let universityScore = 10;
    if (uniLower.includes("addis ababa") || uniLower.includes("aait")) universityScore = 15;
    else if (uniLower.includes("astu") || uniLower.includes("bit") || uniLower.includes("bahir dar")) universityScore = 13;
    else if (uniLower.includes("hawassa") || uniLower.includes("mekelle") || uniLower.includes("gondar")) universityScore = 11;
    const skillsCount = applicant.skills ? applicant.skills.split(",").length : 0;
    const skillsScore = Math.min(skillsCount * 3, 15);
    const recScore = applicant.recommendation_name ? 10 : 5;
    const cvScore = applicant.cv_name ? 10 : 5;
    const total = gpaScore + fieldScore + universityScore + skillsScore + recScore + cvScore;
    return { total, breakdown: { gpaScore, fieldScore, universityScore, skillsScore, recommendationScore: recScore, cvScore } };
  };
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Ethio Telecom ET-AMS", timestamp: /* @__PURE__ */ new Date() });
  });
  app.post("/api/auth/login", authLimiter, async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier) return res.status(400).json({ error: "Email, Username or Application ID is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });
    const cleanId = String(identifier).trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: cleanId }, { email: cleanId }, { phone: identifier }]
      }
    });
    if (user) {
      try {
        const isValidPassword = await verifyPassword(password, user.password_hash || "");
        if (!isValidPassword) return res.status(401).json({ error: "Invalid password" });
        await prisma.user.update({
          where: { id: user.id },
          data: { last_login: /* @__PURE__ */ new Date() }
        });
        const token = generateToken(user);
        await logAudit(user.id, user.full_name, user.role, "USER_LOGIN", "User", user.id, `User logged in successfully`);
        return res.json({ success: true, user: withoutPasswordHash(user), token });
      } catch (err) {
        return res.status(500).json({ error: "Login error, please try again" });
      }
    }
    const applicant = await prisma.applicant.findFirst({
      where: { OR: [{ app_id: cleanId }, { email: cleanId }] }
    });
    if (applicant) {
      return res.status(401).json({ error: "Please login using your email address as a registered user" });
    }
    return res.status(401).json({ error: "Invalid credentials or Application ID not found" });
  });
  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !user.is_active) return res.status(401).json({ error: "Account is unavailable" });
    return res.json({ user: withoutPasswordHash(user) });
  });
  app.get("/api/applicants", authenticateToken, authorizeRoles("SYSTEM_ADMIN", "HR_MANAGER", "DEPARTMENT_HEAD"), async (req, res) => {
    const applicants = await prisma.applicant.findMany();
    const applications = await prisma.application.findMany();
    res.json({ applicants, applications });
  });
  app.get("/api/applicants/lookup", async (req, res) => {
    const { appId, email } = req.query;
    if (!appId || !email) return res.status(400).json({ error: "Both Application ID and registered email are required." });
    const foundApplicant = await prisma.applicant.findFirst({
      where: { app_id: String(appId).trim().toUpperCase(), email: String(email).trim().toLowerCase() }
    });
    if (!foundApplicant) return res.status(404).json({ error: "Application record not found. Please check your Application ID or Email." });
    const application = await prisma.application.findFirst({ where: { applicant_id: foundApplicant.id } });
    const certificate = await prisma.certificate.findFirst({ where: { apprentice_id: foundApplicant.id } });
    res.json({ applicant: foundApplicant, application, certificate });
  });
  app.post("/api/applicants/submit", async (req, res) => {
    try {
      const { full_name, email, phone, university, field_of_study, gpa, skills, cv_name, transcript_name, id_name, recommendation_name, password } = req.body;
      if (!full_name || !email || !university || !field_of_study || gpa === void 0 || !password) {
        return res.status(400).json({ error: "All mandatory fields (Full Name, Email, University, Field, GPA, Password) are required." });
      }
      const normalizedEmail = String(email).trim().toLowerCase();
      const parsedGpa = Number(gpa);
      if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || !Number.isFinite(parsedGpa) || parsedGpa < 0 || parsedGpa > 4 || String(password).length < 12) {
        return res.status(400).json({ error: "Use a valid email, GPA from 0 to 4, and a password of at least 12 characters." });
      }
      const existingApplicant = await prisma.applicant.findFirst({ where: { email: normalizedEmail } });
      if (existingApplicant) return res.status(400).json({ error: "An application with this email already exists." });
      const assignedRole = "APPRENTICE";
      const password_hash = await hashPassword(password);
      const appId = `APP-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${(0, import_crypto.randomUUID)().slice(0, 8).toUpperCase()}`;
      const skillsString = Array.isArray(skills) ? skills.join(",") : skills ? String(skills).split(",").map((s) => s.trim()).join(",") : "General Telecom";
      const newApplicant = await prisma.applicant.create({
        data: {
          app_id: appId,
          full_name,
          email: normalizedEmail,
          phone: phone || "+251911000000",
          university,
          field_of_study,
          gpa: parsedGpa,
          skills: skillsString,
          cv_name: cv_name || "Curriculum_Vitae.pdf",
          transcript_name: transcript_name || "transcript_placeholder.pdf",
          id_name: id_name || "id_placeholder.pdf",
          recommendation_name: recommendation_name || "rec_placeholder.pdf",
          status: "PENDING_SCREENING"
        }
      });
      const newUser = await prisma.user.create({
        data: {
          id: newApplicant.id,
          username: newApplicant.email,
          email: newApplicant.email,
          full_name: newApplicant.full_name,
          role: assignedRole,
          phone: newApplicant.phone,
          password_hash,
          is_active: true
        }
      });
      const newApplication = await prisma.application.create({
        data: {
          applicant_id: newApplicant.id,
          status: "PENDING_SCREENING"
        }
      });
      const token = generateToken(newUser);
      await prisma.notificationItem.createMany({
        data: [
          {
            recipient_id: newApplicant.id,
            recipient_name: newApplicant.full_name,
            type: "SMS",
            subject: "Ethio Telecom Apprenticeship Confirmation",
            message: `Dear ${newApplicant.full_name}, your Ethio Telecom Apprenticeship Application ID is ${newApplicant.app_id}. Status: PENDING_SCREENING.`
          },
          {
            recipient_id: newApplicant.id,
            recipient_name: newApplicant.full_name,
            type: "EMAIL",
            subject: "Ethio Telecom Apprenticeship Confirmation",
            message: `Dear ${newApplicant.full_name},

Thank you for applying to the Ethio Telecom Apprenticeship Program. Your official Application ID is ${newApplicant.app_id}.

Our HR team will review your submitted credentials. You can track your real-time application status on the ET-AMS Portal.`
          }
        ]
      });
      await logAudit(newUser.id, newUser.full_name, assignedRole, "SUBMIT_APPLICATION", "User", newUser.id, `Registered as ${assignedRole} (${newApplicant.app_id})`);
      res.status(200).json({
        success: true,
        app_id: appId,
        assignedRole,
        isFirstAdmin: false,
        token,
        user: withoutPasswordHash(newUser),
        applicant: newApplicant,
        application: newApplication,
        message: `Registration successful! Your Application ID is ${appId}. Your application is submitted for apprentice review.`
      });
    } catch (error) {
      console.error("Application submission failed", error);
      res.status(500).json({ error: "Unable to submit application. Please try again later." });
    }
  });
  app.get("/api/screening/queue", authenticateToken, authorizeRoles("HR_MANAGER", "SYSTEM_ADMIN"), async (req, res) => {
    const screeningCriteria = await prisma.screeningCriteriaConfig.findFirst();
    const queue = await prisma.application.findMany({
      where: { status: { in: ["PENDING_SCREENING", "UNDER_SCREENING", "SCREENED", "REQUESTS_ADDITIONAL_INFO"] } },
      include: { applicant: true }
    });
    res.json({ queue, screeningCriteria });
  });
  app.post("/api/screening/evaluate", authenticateToken, authorizeRoles("HR_MANAGER", "SYSTEM_ADMIN"), async (req, res) => {
    const { applicationId, status, screening_notes, custom_score } = req.body;
    const application = await prisma.application.findUnique({ where: { id: applicationId }, include: { applicant: true } });
    if (!application) return res.status(404).json({ error: "Application not found" });
    if (!application.applicant) return res.status(404).json({ error: "Applicant details missing" });
    const screeningCriteria = await prisma.screeningCriteriaConfig.findFirst();
    const applicantWithSkills = {
      ...application.applicant,
      skills: application.applicant.skills || "",
      status: application.applicant.status
    };
    const calculated = calculateScreeningScore(applicantWithSkills);
    const finalScore = custom_score === void 0 ? calculated.total : Number(custom_score);
    if (!applicationId || !Number.isFinite(finalScore) || finalScore < 0 || finalScore > 100) {
      return res.status(400).json({ error: "A valid application ID and score from 0 to 100 are required." });
    }
    const newStatus = status || (finalScore >= (screeningCriteria?.passing_score || 60) ? "SCREENED" : "REQUESTS_ADDITIONAL_INFO");
    await prisma.application.update({
      where: { id: applicationId },
      data: { screening_score: finalScore, screening_notes: screening_notes || "Automated and manual document screening verified.", status: newStatus }
    });
    await prisma.applicant.update({ where: { id: application.applicant_id }, data: { status: newStatus } });
    await logAudit(req.user.id, req.user.username, req.user.role, "SCREEN_APPLICATION", "Application", application.id, `Evaluated application ${application.applicant.app_id}. Score: ${finalScore}/100. Status: ${newStatus}`);
    const updatedApplication = await prisma.application.findUnique({ where: { id: applicationId }, include: { applicant: true } });
    res.json({ success: true, application: updatedApplication, applicant: updatedApplication?.applicant });
  });
  app.post("/api/approvals/decide", authenticateToken, authorizeRoles("DEPARTMENT_HEAD", "SYSTEM_ADMIN"), async (req, res) => {
    const { applicationId, decision, department_id, rejection_reason } = req.body;
    if (!applicationId || !["APPROVE", "REJECT", "WAITLIST"].includes(decision)) {
      return res.status(400).json({ error: "A valid application ID and decision are required." });
    }
    const application = await prisma.application.findUnique({ where: { id: applicationId }, include: { applicant: true } });
    if (!application) return res.status(404).json({ error: "Application not found" });
    if (!application.applicant) return res.status(404).json({ error: "Applicant profile not found" });
    if (decision === "APPROVE") {
      let departmentName = application.department_name;
      if (department_id) {
        const dept = await prisma.department.findUnique({ where: { id: department_id } });
        if (dept) departmentName = dept.name;
      }
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: "APPROVED", department_id, department_name: departmentName, approved_at: /* @__PURE__ */ new Date() }
      });
      await prisma.applicant.update({ where: { id: application.applicant_id }, data: { status: "APPROVED" } });
      await prisma.notificationItem.create({
        data: {
          recipient_id: application.applicant_id,
          recipient_name: application.applicant.full_name,
          type: "EMAIL",
          subject: "Apprenticeship Application Approved!",
          message: `Dear ${application.applicant.full_name},

Your application ${application.applicant.app_id} has been APPROVED for Ethio Telecom Apprenticeship. Next step: Department & Mentor Assignment.`
        }
      });
    } else if (decision === "REJECT") {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: "REJECTED", rejection_reason: rejection_reason || "Does not meet current program capacity or eligibility score requirements." }
      });
      await prisma.applicant.update({ where: { id: application.applicant_id }, data: { status: "REJECTED" } });
      await prisma.notificationItem.create({
        data: {
          recipient_id: application.applicant_id,
          recipient_name: application.applicant.full_name,
          type: "EMAIL",
          subject: "Apprenticeship Application Update",
          message: `Dear ${application.applicant.full_name},

Your application ${application.applicant.app_id} status has been updated.`
        }
      });
    } else if (decision === "WAITLIST") {
      await prisma.application.update({ where: { id: applicationId }, data: { status: "WAITLISTED" } });
      await prisma.applicant.update({ where: { id: application.applicant_id }, data: { status: "WAITLISTED" } });
    }
    await logAudit(req.user.id, req.user.username, req.user.role, `DECISION_${decision}`, "Application", application.id, `Decision for ${application.applicant.app_id}: ${decision}. Dept: ${application.department_name || "N/A"}`);
    const updatedApplication = await prisma.application.findUnique({ where: { id: applicationId }, include: { applicant: true } });
    res.json({ success: true, application: updatedApplication, applicant: updatedApplication?.applicant });
  });
  app.post("/api/assignments/assign", authenticateToken, authorizeRoles("DEPARTMENT_HEAD", "SYSTEM_ADMIN"), async (req, res) => {
    const { applicationId, department_id, mentor_id } = req.body;
    if (!applicationId || !department_id || !mentor_id) return res.status(400).json({ error: "Application, department, and mentor are required." });
    const application = await prisma.application.findUnique({ where: { id: applicationId }, include: { applicant: true } });
    if (!application) return res.status(404).json({ error: "Application not found" });
    if (!application.applicant) return res.status(404).json({ error: "Applicant record not found" });
    const dept = await prisma.department.findUnique({ where: { id: department_id } });
    const mentor = await prisma.user.findUnique({ where: { id: mentor_id } });
    if (!dept || !mentor || mentor.role !== "MENTOR") return res.status(400).json({ error: "Select an active department and a user with the Mentor role." });
    const isDepartmentChange = application.department_id !== dept.id;
    if (isDepartmentChange && dept.current_apprentices >= dept.max_apprentices) return res.status(409).json({ error: "The selected department is at capacity." });
    await prisma.application.update({
      where: { id: applicationId },
      data: { department_id: dept.id, department_name: dept.name, mentor_id: mentor.id, mentor_name: mentor.full_name, status: "ACTIVE" }
    });
    await prisma.applicant.update({ where: { id: application.applicant_id }, data: { status: "ACTIVE" } });
    if (isDepartmentChange) {
      await prisma.department.update({ where: { id: dept.id }, data: { current_apprentices: { increment: 1 } } });
      if (application.department_id) {
        await prisma.department.updateMany({
          where: { id: application.department_id, current_apprentices: { gt: 0 } },
          data: { current_apprentices: { decrement: 1 } }
        });
      }
    }
    let userAccount = await prisma.user.findFirst({ where: { email: application.applicant.email } });
    if (!userAccount) {
      userAccount = await prisma.user.create({
        data: {
          id: application.applicant.id,
          username: application.applicant.app_id.toLowerCase().replace(/-/g, "_"),
          email: application.applicant.email,
          full_name: application.applicant.full_name,
          role: "APPRENTICE",
          department_id: dept.id,
          department_name: dept.name,
          phone: application.applicant.phone,
          is_active: true
        }
      });
    } else {
      userAccount = await prisma.user.update({
        where: { id: userAccount.id },
        data: { department_id: dept.id, department_name: dept.name, role: "APPRENTICE", is_active: true }
      });
    }
    await prisma.apprenticeTask.create({
      data: {
        apprentice_id: application.applicant_id,
        apprentice_name: application.applicant.full_name,
        mentor_id: mentor.id,
        mentor_name: mentor.full_name,
        title: `Onboarding & Orientation for ${dept.name}`,
        description: "Review Ethio Telecom security protocols, sign IT access guidelines, and set up your workstations.",
        due_date: new Date(Date.now() + 7 * 864e5).toISOString().split("T")[0],
        status: "PENDING"
      }
    });
    await logAudit(req.user.id, req.user.username, req.user.role, "ASSIGN_APPRENTICE", "Application", application.id, `Assigned ${application.applicant.full_name} to ${dept.name} under mentor ${mentor.full_name}`);
    const updatedApplication = await prisma.application.findUnique({ where: { id: applicationId }, include: { applicant: true } });
    res.json({ success: true, application: updatedApplication, applicant: updatedApplication?.applicant, userAccount, message: "Apprentice assigned to department and mentor successfully. Digital ID generated." });
  });
  app.get("/api/attendance", authenticateToken, async (req, res) => {
    const where = req.user.role === "APPRENTICE" ? { apprentice_id: req.user.id } : {};
    const attendance = await prisma.attendanceRecord.findMany({ where });
    res.json({ attendance });
  });
  app.post("/api/attendance/check-in", authenticateToken, async (req, res) => {
    const { apprentice_id, apprentice_name, method, lat, lng, location_name } = req.body;
    if (!apprentice_id) return res.status(400).json({ error: "Apprentice ID is required" });
    if (req.user.role === "APPRENTICE" && req.user.id !== apprentice_id) return res.status(403).json({ error: "You may only record your own attendance." });
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const checkInTime = /* @__PURE__ */ new Date();
    const hours = checkInTime.getUTCHours() + 3;
    const minutes = checkInTime.getUTCMinutes();
    let status = "present";
    if (hours > 8 || hours === 8 && minutes > 30) status = "late";
    const newRecord = await prisma.attendanceRecord.create({
      data: {
        apprentice_id,
        apprentice_name: apprentice_name || "Apprentice User",
        check_in_time: checkInTime,
        method: method || "BIOMETRIC",
        lat: lat || 9.0108,
        lng: lng || 38.7612,
        location_name: location_name || "Ethio Telecom HQ Campus",
        status,
        date: todayStr
      }
    });
    await logAudit(apprentice_id, apprentice_name || "Apprentice", "APPRENTICE", "ATTENDANCE_CHECK_IN", "Attendance", newRecord.id, `Checked in via ${method}. Status: ${status}`);
    res.json({ success: true, attendance: newRecord, message: `Check-in recorded successfully. Status: ${status.toUpperCase()}` });
  });
  app.post("/api/attendance/check-out", authenticateToken, async (req, res) => {
    const { record_id } = req.body;
    const record = await prisma.attendanceRecord.findUnique({ where: { id: record_id } });
    if (!record) return res.status(404).json({ error: "Attendance check-in record not found" });
    if (req.user.role === "APPRENTICE" && record.apprentice_id !== req.user.id) return res.status(403).json({ error: "You may only check out your own attendance record." });
    const updatedRecord = await prisma.attendanceRecord.update({
      where: { id: record_id },
      data: { check_out_time: /* @__PURE__ */ new Date() }
    });
    res.json({ success: true, attendance: updatedRecord, message: "Check-out completed successfully." });
  });
  app.get("/api/tasks", authenticateToken, async (req, res) => {
    const where = req.user.role === "APPRENTICE" ? { apprentice_id: req.user.id } : req.user.role === "MENTOR" ? { mentor_id: req.user.id } : {};
    const tasks = await prisma.apprenticeTask.findMany({ where });
    res.json({ tasks });
  });
  app.post("/api/tasks/create", authenticateToken, authorizeRoles("MENTOR", "SYSTEM_ADMIN"), async (req, res) => {
    const { apprentice_id, apprentice_name, title, description, due_date } = req.body;
    if (!apprentice_id || !apprentice_name || !title || !description) return res.status(400).json({ error: "Apprentice, title, and description are required." });
    const newTask = await prisma.apprenticeTask.create({
      data: {
        apprentice_id,
        apprentice_name,
        mentor_id: req.user.id,
        mentor_name: req.user.username,
        title,
        description,
        due_date: due_date || new Date(Date.now() + 7 * 864e5).toISOString().split("T")[0],
        status: "PENDING"
      }
    });
    res.json({ success: true, task: newTask, message: "Task created successfully." });
  });
  app.post("/api/tasks/submit", authenticateToken, async (req, res) => {
    const { taskId, notes, filename } = req.body;
    const task = await prisma.apprenticeTask.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (req.user.role !== "APPRENTICE" || task.apprentice_id !== req.user.id) return res.status(403).json({ error: "Only the assigned apprentice may submit this task." });
    const updatedTask = await prisma.apprenticeTask.update({
      where: { id: taskId },
      data: { status: "COMPLETED", evidence_notes: notes, evidence_filename: filename || "Task_Completion_Document.pdf", submission_date: /* @__PURE__ */ new Date() }
    });
    res.json({ success: true, task: updatedTask, message: "Task submitted successfully." });
  });
  app.post("/api/tasks/verify", authenticateToken, authorizeRoles("MENTOR", "SYSTEM_ADMIN"), async (req, res) => {
    const { taskId } = req.body;
    const task = await prisma.apprenticeTask.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (req.user.role === "MENTOR" && task.mentor_id !== req.user.id) return res.status(403).json({ error: "You may only verify tasks assigned to you." });
    const updatedTask = await prisma.apprenticeTask.update({
      where: { id: taskId },
      data: { status: "VERIFIED", verification_date: /* @__PURE__ */ new Date() }
    });
    res.json({ success: true, task: updatedTask });
  });
  app.get("/api/evaluations", authenticateToken, async (req, res) => {
    const where = req.user.role === "APPRENTICE" ? { apprentice_id: req.user.id } : req.user.role === "MENTOR" ? { evaluator_id: req.user.id } : {};
    const evaluations = await prisma.evaluation.findMany({ where });
    res.json({ evaluations });
  });
  app.post("/api/evaluations/submit", authenticateToken, authorizeRoles("MENTOR", "HR_MANAGER", "SYSTEM_ADMIN"), async (req, res) => {
    const {
      apprentice_id,
      apprentice_name,
      evaluation_type,
      technical_score,
      communication_score,
      punctuality_score,
      teamwork_score,
      problem_solving_score,
      comments
    } = req.body;
    if (!apprentice_id || !apprentice_name) return res.status(400).json({ error: "Apprentice details are required." });
    const tech = Number(technical_score);
    const comm = Number(communication_score);
    const punc = Number(punctuality_score);
    const team = Number(teamwork_score);
    const initiative = Number(problem_solving_score);
    if (![tech, comm, punc, team, initiative].every((v) => Number.isInteger(v) && v >= 1 && v <= 10)) {
      return res.status(400).json({ error: "Each score must be an integer from 1 to 10." });
    }
    const overall = parseFloat((tech * 0.3 + comm * 0.2 + punc * 0.2 + team * 0.15 + initiative * 0.15).toFixed(2));
    const apprenticeAtt = await prisma.attendanceRecord.findMany({ where: { apprentice_id } });
    const presentCount = apprenticeAtt.filter((a) => a.status === "present" || a.status === "late").length;
    const attPct = apprenticeAtt.length > 0 ? parseFloat((presentCount / apprenticeAtt.length * 100).toFixed(1)) : 95;
    const passed = overall >= 6 && attPct >= 80;
    const evaluation = await prisma.evaluation.create({
      data: {
        apprentice_id,
        apprentice_name,
        evaluator_id: req.user.id,
        evaluator_name: req.user.username,
        evaluation_type: evaluation_type || "final",
        technical_score: tech,
        communication_score: comm,
        punctuality_score: punc,
        teamwork_score: team,
        problem_solving_score: initiative,
        overall_score: overall,
        passed,
        comments: comments || "Apprentice performance evaluated in accordance with Ethio Telecom HR guidelines."
      }
    });
    if (evaluation_type === "final" && passed) {
      const certNum = `ET-CERT-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${(0, import_crypto.randomUUID)().slice(0, 8).toUpperCase()}`;
      const applicant = await prisma.applicant.findUnique({ where: { id: apprentice_id } });
      const application = await prisma.application.findFirst({ where: { applicant_id: apprentice_id } });
      await prisma.certificate.create({
        data: {
          apprentice_id,
          cert_number: certNum,
          issue_date: /* @__PURE__ */ new Date(),
          overall_score: overall,
          attendance_rate: `${attPct}%`,
          verification_url: `/verify/${certNum}`
        }
      });
      if (applicant) await prisma.applicant.update({ where: { id: apprentice_id }, data: { status: "COMPLETED" } });
      if (application) await prisma.application.update({ where: { id: application.id }, data: { status: "COMPLETED" } });
    }
    await logAudit(req.user.id, req.user.username, req.user.role, "SUBMIT_EVALUATION", "Evaluation", evaluation.id, `Submitted ${evaluation_type} evaluation for ${apprentice_name}. Score: ${overall}/10. Passed: ${passed}`);
    res.json({ success: true, evaluation, certificateGenerated: passed && evaluation_type === "final" });
  });
  app.get("/api/certificates", authenticateToken, async (req, res) => {
    const where = req.user.role === "APPRENTICE" ? { apprentice_id: req.user.id } : {};
    const certificates = await prisma.certificate.findMany({ where });
    res.json({ certificates });
  });
  app.get("/api/certificates/verify/:certNumber", async (req, res) => {
    const certNum = String(req.params.certNumber).trim().toUpperCase();
    const certificate = await prisma.certificate.findFirst({ where: { cert_number: certNum } });
    if (!certificate) return res.status(404).json({ valid: false, error: "Certificate record not found in Ethio Telecom ET-AMS Registry." });
    res.json({ valid: true, certificate });
  });
  app.get("/api/reports/kpis", authenticateToken, authorizeRoles("REPORTING_OFFICER", "SYSTEM_ADMIN", "HR_MANAGER"), async (req, res) => {
    const applicants = await prisma.applicant.findMany();
    const applications = await prisma.application.findMany();
    const attendance = await prisma.attendanceRecord.findMany();
    const departments = await prisma.department.findMany();
    const totalApps = applicants.length;
    const screenedApps = applications.filter((a) => a.screening_score !== null).length;
    const approvedApps = applications.filter((a) => ["APPROVED", "ASSIGNED", "ACTIVE", "COMPLETED"].includes(a.status)).length;
    const activeApprentices = applicants.filter((a) => a.status === "ACTIVE").length;
    const completedApprentices = applicants.filter((a) => a.status === "COMPLETED").length;
    const totalAttendance = attendance.length;
    const presentAttendance = attendance.filter((a) => a.status === "present" || a.status === "late").length;
    const attendanceRate = totalAttendance > 0 ? (presentAttendance / totalAttendance * 100).toFixed(1) : "95.2";
    res.json({
      totalApplications: totalApps,
      screenedApplications: screenedApps,
      approvedApplications: approvedApps,
      activeApprentices,
      completedApprentices,
      overallAttendanceRate: `${attendanceRate}%`,
      departments
    });
  });
  app.get("/api/admin/users", authenticateToken, authorizeRoles("SYSTEM_ADMIN"), async (req, res) => {
    const users = await prisma.user.findMany();
    const departments = await prisma.department.findMany();
    const auditLogs = await prisma.auditLog.findMany();
    const screeningCriteria = await prisma.screeningCriteriaConfig.findFirst();
    const applicants = await prisma.applicant.findMany();
    const applications = await prisma.application.findMany();
    res.json({ users, departments, auditLogs, screeningCriteria, applicants, applications });
  });
  app.post("/api/admin/users/create", authenticateToken, authorizeRoles("SYSTEM_ADMIN"), async (req, res) => {
    const { username, email, full_name, role, department_id, phone } = req.body;
    if (!username || !email || !full_name || !role || !ROLES.includes(role)) {
      return res.status(400).json({ error: "Username, Email, Full Name and Role are required" });
    }
    const dept = await prisma.department.findUnique({ where: { id: department_id } });
    const temporaryPassword = `Etams-${(0, import_crypto.randomBytes)(12).toString("base64url")}`;
    const password_hash = await hashPassword(temporaryPassword);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        full_name,
        role,
        department_id,
        department_name: dept?.name,
        phone: phone || "+251911000000",
        password_hash,
        is_active: true
      }
    });
    await logAudit(req.user.id, req.user.username, req.user.role, "CREATE_USER", "User", newUser.id, `Created user ${newUser.username} with role ${newUser.role}`);
    res.status(201).json({ success: true, user: withoutPasswordHash(newUser), temporaryPassword });
  });
  app.post("/api/admin/users/update-role", authenticateToken, authorizeRoles("SYSTEM_ADMIN"), async (req, res) => {
    const { userId, role } = req.body;
    if (!ROLES.includes(role)) return res.status(400).json({ error: "Invalid role" });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const oldRole = user.role;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    await logAudit(req.user.id, req.user.username, req.user.role, "UPDATE_USER_ROLE", "User", user.id, `Changed role for ${user.full_name} (${user.username}) from ${oldRole} to ${role}`);
    res.json({ success: true, user: withoutPasswordHash(updatedUser) });
  });
  app.delete("/api/admin/users/:id", authenticateToken, authorizeRoles("SYSTEM_ADMIN"), async (req, res) => {
    const userId = req.params.id;
    if (userId === req.user.id) return res.status(400).json({ error: "You cannot delete your own account." });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    await prisma.user.delete({ where: { id: userId } });
    const applicant = await prisma.applicant.findFirst({
      where: { OR: [{ id: userId }, { email: user.email.toLowerCase() }] }
    });
    if (applicant) await prisma.applicant.delete({ where: { id: applicant.id } });
    await logAudit(req.user.id, req.user.username, req.user.role, "DELETE_USER", "User", userId, `Deleted user/student ${user.full_name} (${user.email})`);
    res.json({ success: true, message: `User ${user.full_name} successfully deleted.` });
  });
  app.post("/api/admin/departments/create", authenticateToken, authorizeRoles("SYSTEM_ADMIN"), async (req, res) => {
    const { name, code, description, max_apprentices, location, required_skills } = req.body;
    if (!name || !code) return res.status(400).json({ error: "Department Name and Code are required" });
    const skillsArray = Array.isArray(required_skills) ? required_skills : required_skills ? String(required_skills).split(",").map((s) => s.trim()) : ["Telecom", "Engineering"];
    const newDept = await prisma.department.create({
      data: {
        name,
        code: code.toUpperCase(),
        description: description || "Department within Ethio Telecom organizational structure.",
        max_apprentices: max_apprentices ? parseInt(String(max_apprentices)) : 30,
        current_apprentices: 0,
        head_name: "Unassigned Head",
        location: location || "Ethio Telecom HQ, Addis Ababa",
        is_active: true,
        required_skills: skillsArray.join(",")
      }
    });
    await logAudit(req.user.id, req.user.username, req.user.role, "CREATE_DEPARTMENT", "Department", newDept.id, `Created department ${newDept.name} (${newDept.code})`);
    res.json({ success: true, department: newDept });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ET-AMS Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
