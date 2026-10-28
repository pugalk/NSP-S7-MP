import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SCHOLARSHIPS as DEFAULT_SCHOLARSHIPS } from '../data/scholarships';
import { api } from '../services/api';

const STORAGE_KEY = 'nsrp-portal-v2';

const INITIAL_PROFILE = {
  fullName: 'Aravind Swaminathan',
  email: 'student@nsp.gov.in',
  phone: '+91 98765 43210',
  dob: '2004-05-15',
  gender: 'Male',
  state: 'Tamil Nadu',
  district: 'Chennai',
  address: '12, Anna Salai, Guindy, Chennai - 600025',
  community: 'BC',
  institution: 'Anna University, Chennai',
  course: 'B.Tech',
  department: 'Computer Science and Engineering',
  currentYear: '3',
  registrationNumber: 'AU2022CS084',
  previousPercentage: '82',
  cgpa: '8.4',
  attendance: '88',
  familyIncome: '220000',
  disability: false,
  disabilityPercentage: '',
  residence: 'Day Scholar',
  sportsAchievement: 'None',
  previousScholarship: 'Central Sector Post-Matric Scholarship',
  previousScholarshipId: 'NSP-2025-419201'
};

const INITIAL_STATE = {
  account: null,
  signedIn: false,
  profile: INITIAL_PROFILE,
  applications: [
    {
      id: 'app_1',
      applicationId: 'NSRP-2026-849201',
      scholarshipId: '1',
      scholarshipName: 'National Merit Excellence Scholarship',
      category: 'Merit-Based',
      amount: 50000,
      userEmail: 'student@nsp.gov.in',
      applicantName: 'Aravind Swaminathan',
      type: 'Fresh',
      status: 'Under Verification',
      submittedAt: '2026-08-10T11:30:00.000Z',
      updatedAt: '2026-08-25T14:20:00.000Z',
      bankDetails: {
        bankName: 'State Bank of India',
        accountNumber: 'XXXXXX4892',
        ifscCode: 'SBIN0001234'
      },
      remarks: 'Academic marksheets verified. Income certificate under district review.',
      nextAction: 'Awaiting provider review clearance.',
      history: [
        { status: 'Submitted', at: '2026-08-10T11:30:00.000Z', by: 'Student', remark: 'Initial submission' },
        { status: 'Document Verification', at: '2026-08-15T09:40:00.000Z', by: 'Nodal Officer', remark: 'All certificates accepted' },
        { status: 'Under Verification', at: '2026-08-25T14:20:00.000Z', by: 'District Welfare Officer', remark: 'Awaiting state quota clearance' }
      ]
    },
    {
      id: 'app_2',
      applicationId: 'NSRP-2026-302194',
      scholarshipId: '2',
      scholarshipName: 'Central Sector Post-Matric Scholarship',
      category: 'Central Government',
      amount: 36000,
      userEmail: 'student@nsp.gov.in',
      applicantName: 'Aravind Swaminathan',
      type: 'Renewal',
      status: 'Approved',
      submittedAt: '2026-07-20T10:15:00.000Z',
      updatedAt: '2026-08-18T16:00:00.000Z',
      bankDetails: {
        bankName: 'State Bank of India',
        accountNumber: 'XXXXXX4892',
        ifscCode: 'SBIN0001234'
      },
      remarks: 'Renewal re-verification successful. Disbursal scheduled through PFMS.',
      nextAction: 'Disbursement details will be shared by the provider.',
      history: [
        { status: 'Submitted', at: '2026-07-20T10:15:00.000Z', by: 'Student', remark: 'Renewal application submitted' },
        { status: 'Document Verification', at: '2026-07-28T11:00:00.000Z', by: 'College Officer', remark: 'Attendance 88% verified' },
        { status: 'Under Verification', at: '2026-08-05T14:30:00.000Z', by: 'State Nodal Officer', remark: 'Promoted to year 3 with 8.4 CGPA' },
        { status: 'Provider Review', at: '2026-08-12T10:00:00.000Z', by: 'Ministry Officer', remark: 'Sanction approved' },
        { status: 'Approved', at: '2026-08-18T16:00:00.000Z', by: 'Finance Disbursal Unit', remark: 'Approved for PFMS DBT' }
      ]
    }
  ],
  documents: [
    {
      id: 'doc_1',
      name: 'Aadhaar / Identity Document',
      fileName: 'aadhaar_card_verified.pdf',
      size: 421000,
      uploadedAt: '2026-08-10T11:20:00.000Z',
      status: 'Verified',
      remark: 'Aadhaar UID and DOB match government records.'
    },
    {
      id: 'doc_2',
      name: 'Marksheet',
      fileName: 'semester_4_grade_sheet.pdf',
      size: 785000,
      uploadedAt: '2026-08-10T11:22:00.000Z',
      status: 'Verified',
      remark: '8.4 CGPA confirmed with Anna University database.'
    },
    {
      id: 'doc_3',
      name: 'Income Certificate',
      fileName: 'revenue_dept_income_cert.pdf',
      size: 512000,
      uploadedAt: '2026-08-10T11:25:00.000Z',
      status: 'Pending Verification',
      remark: 'Under physical verification at Tehsildar desk.'
    },
    {
      id: 'doc_4',
      name: 'Bonafide Certificate',
      fileName: 'college_bonafide_2026.pdf',
      size: 320000,
      uploadedAt: '2026-08-10T11:27:00.000Z',
      status: 'Verified',
      remark: 'Verified by college registrar office.'
    }
  ],
  notifications: [
    {
      id: 'n1',
      title: 'Welcome to the renewal portal',
      body: 'Complete your profile to unlock instant eligibility checks across all active schemes.',
      createdAt: '2026-09-01T09:00:00.000Z',
      read: false,
      tone: 'info'
    },
    {
      id: 'n2',
      title: 'Application update: Approved',
      body: 'Your renewal for Central Sector Post-Matric Scholarship has been Approved.',
      createdAt: '2026-08-18T16:00:00.000Z',
      read: false,
      tone: 'success'
    },
    {
      id: 'n3',
      title: 'Deadline approaching',
      body: 'National Merit Excellence Scholarship closes on 30 Oct 2026.',
      createdAt: '2026-09-01T09:00:00.000Z',
      read: true,
      tone: 'warning'
    }
  ],
  lastEligibilityRun: null,
  scholarshipEdits: {},
  staff: null,
  organizer: null,
  wishlist: ['1', '3', '7'],
  compareList: ['1', '2'],
  deletedScholarshipIds: []
};

const STAGES = ['Submitted', 'Document Verification', 'Under Verification', 'Provider Review', 'Approved'];

const PortalContext = createContext(null);

export function PortalProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState({ ...INITIAL_STATE, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.warn('Failed to parse state from localStorage', e);
    }
    setHydrated(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save state to localStorage', e);
      }
    }
  }, [state, hydrated]);

  // Sync with backend API when online
  useEffect(() => {
    let mounted = true;
    const checkAndSync = async () => {
      try {
        const health = await api.checkHealth();
        if (health.ok && mounted) {
          setBackendConnected(true);
          // Sync live applications and documents from backend
          const [appsRes, docsRes] = await Promise.allSettled([
            api.getApplications(),
            api.getDocuments()
          ]);

          if (appsRes.status === 'fulfilled' && Array.isArray(appsRes.value) && appsRes.value.length > 0) {
            setState(prev => {
              // Merge: keep any existing local apps not in backend
              const backendAppIds = new Set(appsRes.value.map(a => a.applicationId || a.id));
              const localOnly = prev.applications.filter(a => !backendAppIds.has(a.applicationId) && !backendAppIds.has(a.id));
              return { ...prev, applications: [...appsRes.value, ...localOnly] };
            });
          }

          if (docsRes.status === 'fulfilled' && Array.isArray(docsRes.value) && docsRes.value.length > 0) {
            setState(prev => {
              const backendDocIds = new Set(docsRes.value.map(d => d.id || d.fileName));
              const localOnly = prev.documents.filter(d => !backendDocIds.has(d.id) && !backendDocIds.has(d.fileName));
              return { ...prev, documents: [...docsRes.value, ...localOnly] };
            });
          }
        } else if (mounted) {
          setBackendConnected(false);
        }
      } catch {
        if (mounted) setBackendConnected(false);
      }
    };

    checkAndSync();
    const interval = setInterval(checkAndSync, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Combine default scholarships with any local edits and exclude deleted ones
  const scholarships = useMemo(() => {
    const deleted = new Set(state.deletedScholarshipIds || []);
    const list = DEFAULT_SCHOLARSHIPS
      .filter(s => !deleted.has(String(s.id)))
      .map(s => state.scholarshipEdits[s.id] || s);
    const added = Object.values(state.scholarshipEdits).filter(
      e => !DEFAULT_SCHOLARSHIPS.some(s => s.id === e.id) && !deleted.has(String(e.id))
    );
    return [...added, ...list];
  }, [state.scholarshipEdits, state.deletedScholarshipIds]);

  const findScholarship = useCallback((id) => {
    return scholarships.find(s => s.id === id || s.code === id);
  }, [scholarships]);

  const notify = useCallback((notification) => {
    const id = Math.random().toString(36).slice(2, 9);
    setState(prev => ({
      ...prev,
      notifications: [
        {
          id,
          createdAt: new Date().toISOString(),
          read: false,
          tone: 'info',
          ...notification
        },
        ...prev.notifications
      ]
    }));
  }, []);

  const markAllRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  }, []);

  const register = useCallback(async (data) => {
    const { fullName, email, password, ...rest } = data;

    // Sync with backend if available
    if (backendConnected) {
      try {
        await api.register(data);
      } catch (err) {
        console.warn('Backend register sync warning:', err.message);
      }
    }

    setState(prev => ({
      ...prev,
      account: { fullName, email, role: 'student' },
      signedIn: true,
      profile: {
        ...prev.profile,
        ...rest,
        fullName,
        email
      },
      notifications: [
        {
          id: Math.random().toString(36).slice(2, 9),
          title: 'Registration successful',
          body: 'Your student account is ready. Fill your profile to check eligibility.',
          createdAt: new Date().toISOString(),
          read: false,
          tone: 'success'
        },
        ...prev.notifications
      ]
    }));
    return { ok: true };
  }, [backendConnected]);

  const login = useCallback(async (email, password) => {
    if (!email) return { ok: false, message: 'Please enter your email.' };

    if (backendConnected) {
      try {
        const res = await api.login(email, password);
        if (res && res.profile) {
          setState(prev => ({
            ...prev,
            account: {
              fullName: res.user?.fullName || res.profile.fullName || 'Student Applicant',
              email: res.user?.email || email,
              role: res.user?.role || 'student'
            },
            profile: { ...prev.profile, ...res.profile },
            signedIn: true
          }));
          notify({
            title: 'Signed in successfully',
            body: `Welcome back, ${email}! (Authenticated via Live API)`,
            tone: 'success'
          });
          return { ok: true };
        }
      } catch (err) {
        console.warn('Backend login attempt fell back to local credentials:', err.message);
      }
    }

    setState(prev => ({
      ...prev,
      account: {
        fullName: prev.profile.fullName || 'Student Applicant',
        email,
        role: 'student'
      },
      signedIn: true
    }));

    notify({
      title: 'Signed in successfully',
      body: `Welcome back, ${email}!`,
      tone: 'success'
    });

    return { ok: true };
  }, [backendConnected, notify]);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, signedIn: false, account: null }));
    notify({
      title: 'Signed Out',
      body: 'You have been safely signed out.',
      tone: 'info'
    });
  }, [notify]);

  const quickDemoLogin = useCallback((role = 'student') => {
    if (role === 'admin' || role === 'officer') {
      const staff = {
        id: 'staff_01',
        fullName: 'Dr. Ramesh Kumar',
        email: 'admin@nsp.gov.in',
        role: 'State Nodal Officer',
        department: 'Directorate of Higher Education'
      };
      setState(prev => ({ ...prev, staff }));
      notify({
        title: 'Officer Desk Active',
        body: 'Signed in as State Nodal Officer (Dr. Ramesh Kumar).',
        tone: 'info'
      });
      return { ok: true, role: 'admin', staff };
    } else if (role === 'organizer') {
      const organizer = {
        id: 'org_01',
        fullName: 'Vikram Singhania',
        email: 'organizer@nsp.gov.in',
        organization: 'National Higher Education Foundation & CSR Trust',
        role: 'organizer',
        designation: 'Scholarship Program Director',
        allocatedBudget: 25000000,
        managedSchemeIds: ['1', '2', '3', '4']
      };
      setState(prev => ({ ...prev, organizer }));
      notify({
        title: 'Organizer Portal Active',
        body: 'Signed in as Scheme Organizer (Vikram Singhania).',
        tone: 'success'
      });
      return { ok: true, role: 'organizer', organizer };
    } else {
      const account = {
        fullName: 'Aravind Swaminathan',
        email: 'student@nsp.gov.in',
        role: 'student'
      };
      setState(prev => ({
        ...prev,
        account,
        signedIn: true,
        profile: prev.profile || INITIAL_PROFILE
      }));
      notify({
        title: 'Signed in as Student',
        body: 'Welcome back to your personalized dashboard, Aravind!',
        tone: 'success'
      });
      return { ok: true, role: 'student', account };
    }
  }, [notify]);

  const updateProfile = useCallback(async (updates) => {
    if (backendConnected) {
      try {
        await api.updateProfile(updates, state.account?.email);
      } catch (err) {
        console.warn('Backend profile update sync warning:', err.message);
      }
    }

    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
      account: prev.account ? { ...prev.account, fullName: updates.fullName || prev.account.fullName } : null
    }));
    notify({
      title: 'Profile updated',
      body: 'Your academic and domicile details have been saved.',
      tone: 'success'
    });
  }, [backendConnected, notify, state.account?.email]);

  const addApplication = useCallback(async (appData) => {
    const scheme = findScholarship(appData.scholarshipId);
    const now = new Date().toISOString();
    const applicationId = `NSRP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`;
    let newApp = {
      id: Math.random().toString(36).slice(2, 9),
      applicationId,
      submittedAt: now,
      updatedAt: now,
      status: 'Submitted',
      scholarshipName: scheme?.name || 'Scholarship Scheme',
      category: scheme?.category || 'General',
      amount: scheme?.amount || 0,
      userEmail: state.account?.email || 'student@nsp.gov.in',
      applicantName: state.profile.fullName || 'Student',
      nextAction: 'Awaiting nodal verification officer screening.',
      remarks: 'Application submitted successfully.',
      history: [
        {
          status: 'Submitted',
          at: now,
          by: 'Student',
          remark: `${appData.type || 'Fresh'} application submitted.`
        }
      ],
      ...appData
    };

    if (backendConnected) {
      try {
        const res = await api.submitApplication({
          ...newApp,
          userEmail: state.account?.email || 'student@nsp.gov.in',
          applicantName: state.profile.fullName || 'Student'
        });
        if (res && res.application) {
          newApp = res.application;
        }
      } catch (err) {
        console.warn('Backend application submit sync warning:', err.message);
      }
    }

    setState(prev => ({
      ...prev,
      applications: [newApp, ...prev.applications.filter(a => a.id !== newApp.id)]
    }));

    notify({
      title: `${newApp.type === 'Renewal' ? 'Renewal' : 'Application'} submitted`,
      body: `${newApp.applicationId} for ${scheme?.name || 'scheme'} has been recorded.`,
      tone: 'success'
    });

    return newApp;
  }, [backendConnected, findScholarship, notify, state.account, state.profile]);

  const advanceApplication = useCallback(async (id) => {
    if (backendConnected) {
      try {
        await api.advanceApplication(id);
      } catch (err) {
        console.warn('Backend advance application sync warning:', err.message);
      }
    }

    setState(prev => ({
      ...prev,
      applications: prev.applications.map(app => {
        if (app.id !== id && app.applicationId !== id) return app;
        const curIdx = STAGES.indexOf(app.status);
        const next = STAGES[Math.min(curIdx + 1, STAGES.length - 1)];
        const now = new Date().toISOString();
        return {
          ...app,
          status: next,
          updatedAt: now,
          nextAction: next === 'Approved' ? 'Disbursement details will be shared by provider.' : 'Awaiting reviewer action.',
          history: [...(app.history || []), { status: next, at: now, by: 'Review Officer', remark: `Advanced to ${next}` }]
        };
      })
    }));
  }, [backendConnected]);

  const reviewApplication = useCallback(async (id, status, remarks, reviewer = 'Officer') => {
    const now = new Date().toISOString();

    if (backendConnected) {
      try {
        await api.reviewApplication(id, status, remarks, reviewer);
      } catch (err) {
        console.warn('Backend review application sync warning:', err.message);
      }
    }

    setState(prev => {
      const app = prev.applications.find(a => a.id === id || a.applicationId === id);
      const scheme = app ? scholarships.find(s => s.id === app.scholarshipId) : null;
      return {
        ...prev,
        applications: prev.applications.map(a => {
          if (a.id !== id && a.applicationId !== id) return a;
          return {
            ...a,
            status,
            remarks: remarks || a.remarks,
            updatedAt: now,
            nextAction: status === 'Approved'
              ? 'Disbursement details will be shared by provider through PFMS.'
              : status === 'Rejected'
              ? 'Application closed. See remarks.'
              : status === 'Resubmission Required'
              ? 'Upload corrected certificates on student portal.'
              : 'Awaiting next action.',
            history: [...(a.history || []), { status, at: now, by: reviewer, remark: remarks || `Status set to ${status}` }]
          };
        }),
        notifications: app ? [
          {
            id: Math.random().toString(36).slice(2, 9),
            title: `Application ${status.toLowerCase()}`,
            body: `${app.applicationId} (${scheme?.name || 'Scheme'}) is now "${status}".`,
            createdAt: now,
            read: false,
            tone: status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'warning'
          },
          ...prev.notifications
        ] : prev.notifications
      };
    });
  }, [backendConnected, scholarships]);

  const addDocument = useCallback(async (name, file) => {
    let newDoc = {
      id: Math.random().toString(36).slice(2, 9),
      name,
      fileName: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: 'Pending Verification',
      remark: 'Under nodal screening.'
    };

    if (backendConnected && file instanceof File) {
      try {
        const res = await api.uploadDocument(file, name, state.account?.email || 'student@nsp.gov.in');
        if (res && res.document) {
          newDoc = res.document;
        }
      } catch (err) {
        console.warn('Backend upload document sync warning:', err.message);
      }
    }

    setState(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents.filter(d => d.name !== name)]
    }));
    notify({
      title: 'Document uploaded',
      body: `${name} has been uploaded successfully.`,
      tone: 'success'
    });
  }, [backendConnected, notify, state.account?.email]);

  const removeDocument = useCallback(async (id) => {
    if (backendConnected) {
      try {
        await api.deleteDocument(id);
      } catch (err) {
        console.warn('Backend delete document sync warning:', err.message);
      }
    }
    setState(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id)
    }));
  }, [backendConnected]);

  const setDocumentStatus = useCallback(async (id, status, remark) => {
    if (backendConnected) {
      try {
        await api.updateDocumentStatus(id, status, remark);
      } catch (err) {
        console.warn('Backend update document status sync warning:', err.message);
      }
    }
    setState(prev => ({
      ...prev,
      documents: prev.documents.map(d => d.id === id ? { ...d, status, remark } : d)
    }));
  }, [backendConnected]);

  const staffLogin = useCallback(async (credentials) => {
    let staff = {
      id: 'staff_01',
      fullName: 'Dr. Ramesh Kumar',
      email: credentials.email || 'admin@nsp.gov.in',
      role: 'State Nodal Officer',
      department: 'Directorate of Higher Education'
    };

    if (backendConnected) {
      try {
        const res = await api.adminLogin(credentials.email, credentials.password);
        if (res && res.staff) {
          staff = res.staff;
        }
      } catch (err) {
        console.warn('Backend staff login warning:', err.message);
      }
    }

    setState(prev => ({ ...prev, staff }));
    return { ok: true, staff };
  }, [backendConnected]);

  const staffLogout = useCallback(() => {
    setState(prev => ({ ...prev, staff: null }));
  }, []);

  const organizerLogin = useCallback(async (credentials) => {
    let organizer = {
      id: 'org_01',
      fullName: 'Vikram Singhania',
      email: credentials.email || 'organizer@nsp.gov.in',
      organization: 'National Higher Education Foundation & CSR Trust',
      role: 'organizer',
      designation: 'Scholarship Program Director',
      allocatedBudget: 25000000,
      managedSchemeIds: ['1', '2', '3', '4']
    };

    if (backendConnected) {
      try {
        const res = await api.organizerLogin(credentials.email, credentials.password);
        if (res && res.organizer) {
          organizer = res.organizer;
        }
      } catch (err) {
        console.warn('Backend organizer login warning:', err.message);
      }
    }

    setState(prev => ({ ...prev, organizer }));
    notify({
      title: 'Organizer Portal Active',
      body: `Signed in as ${organizer.fullName} (${organizer.organization}).`,
      tone: 'success'
    });
    return { ok: true, organizer };
  }, [backendConnected, notify]);

  const organizerLogout = useCallback(() => {
    setState(prev => ({ ...prev, organizer: null }));
    notify({
      title: 'Signed Out',
      body: 'You have been signed out from the Organizer Portal.',
      tone: 'info'
    });
  }, [notify]);

  const unreadCount = useMemo(() => {
    return state.notifications.filter(n => !n.read).length;
  }, [state.notifications]);

  // Flipkart-style Wishlist Management
  const wishlist = state.wishlist || [];
  const toggleWishlist = useCallback((schemeId) => {
    const sId = String(schemeId);
    setState(prev => {
      const current = prev.wishlist || [];
      const exists = current.includes(sId);
      const updated = exists ? current.filter(id => id !== sId) : [...current, sId];
      return { ...prev, wishlist: updated };
    });
    const scheme = findScholarship(sId);
    const title = scheme ? scheme.name : 'Scholarship';
    const isAdding = !wishlist.includes(sId);
    notify({
      title: isAdding ? 'Added to Wishlist' : 'Removed from Wishlist',
      body: isAdding 
        ? `"${title}" has been saved to your wishlist.` 
        : `"${title}" removed from your wishlist.`,
      tone: isAdding ? 'success' : 'info'
    });
  }, [findScholarship, notify, wishlist]);

  const isInWishlist = useCallback((schemeId) => {
    return (state.wishlist || []).includes(String(schemeId));
  }, [state.wishlist]);

  // Flipkart-style Compare Management (Max 4 items)
  const compareList = state.compareList || [];
  const addToCompare = useCallback((schemeId) => {
    const sId = String(schemeId);
    const current = state.compareList || [];
    if (current.includes(sId)) return;
    if (current.length >= 4) {
      notify({
        title: 'Compare Limit Reached',
        body: 'You can compare a maximum of 4 scholarship schemes side-by-side.',
        tone: 'warning'
      });
      return;
    }
    setState(prev => ({
      ...prev,
      compareList: [...(prev.compareList || []), sId]
    }));
    const scheme = findScholarship(sId);
    notify({
      title: 'Added to Comparison',
      body: `"${scheme ? scheme.name : 'Scheme'}" added to comparison dock (${current.length + 1}/4).`,
      tone: 'info'
    });
  }, [findScholarship, notify, state.compareList]);

  const removeFromCompare = useCallback((schemeId) => {
    const sId = String(schemeId);
    setState(prev => ({
      ...prev,
      compareList: (prev.compareList || []).filter(id => id !== sId)
    }));
  }, []);

  const clearCompare = useCallback(() => {
    setState(prev => ({ ...prev, compareList: [] }));
    notify({
      title: 'Comparison Cleared',
      body: 'All schemes removed from comparison matrix.',
      tone: 'info'
    });
  }, [notify]);

  const isInCompare = useCallback((schemeId) => {
    return (state.compareList || []).includes(String(schemeId));
  }, [state.compareList]);

  // Organizer Actions: Add & Remove Scholarships
  const addScholarship = useCallback(async (schemeData) => {
    const newId = String(Date.now());
    const newCode = schemeData.code || `SCH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newScheme = {
      id: newId,
      code: newCode,
      name: schemeData.name || 'Untitled Scholarship Scheme',
      provider: schemeData.provider || organizer?.organization || 'National Higher Education Trust',
      category: schemeData.category || 'Merit-Based',
      description: schemeData.description || 'Financial assistance program for eligible students.',
      benefits: schemeData.benefits || ['Annual tuition grant', 'Direct bank disbursal'],
      amount: Number(schemeData.amount) || 50000,
      openingDate: schemeData.openingDate || new Date().toISOString().split('T')[0],
      closingDate: schemeData.closingDate || '2026-11-30',
      eligibleStates: Array.isArray(schemeData.eligibleStates) ? schemeData.eligibleStates : [],
      eligibleCommunities: Array.isArray(schemeData.eligibleCommunities) ? schemeData.eligibleCommunities : [],
      gender: schemeData.gender || 'Any',
      minPercentage: schemeData.minPercentage !== undefined ? Number(schemeData.minPercentage) : 75,
      minCgpa: schemeData.minCgpa !== undefined ? Number(schemeData.minCgpa) : 7.5,
      minAttendance: schemeData.minAttendance !== undefined ? Number(schemeData.minAttendance) : 75,
      maxFamilyIncome: schemeData.maxFamilyIncome !== undefined ? Number(schemeData.maxFamilyIncome) : 500000,
      eligibleCourses: Array.isArray(schemeData.eligibleCourses) ? schemeData.eligibleCourses : ['B.Tech', 'B.Sc', 'Degree'],
      eligibleYears: [1, 2, 3, 4],
      requiredDocuments: ['Aadhaar Card', 'Marksheet', 'Income Certificate', 'Bonafide'],
      renewable: true,
      renewalCriteria: 'Maintain promotion CGPA and 75% attendance.',
      active: true
    };

    if (backendConnected) {
      try {
        const res = await api.createScholarship(newScheme);
        if (res && res.scheme) {
          newScheme.id = res.scheme.id;
        }
      } catch (err) {
        console.warn('Backend create scholarship sync warning:', err.message);
      }
    }

    setState(prev => ({
      ...prev,
      scholarshipEdits: {
        ...prev.scholarshipEdits,
        [newScheme.id]: newScheme
      }
    }));

    notify({
      title: 'Scholarship Created',
      body: `"${newScheme.name}" has been published to the national catalog.`,
      tone: 'success'
    });

    return { ok: true, scheme: newScheme };
  }, [backendConnected, notify, organizer]);

  const removeScholarship = useCallback(async (schemeId) => {
    const sId = String(schemeId);
    if (backendConnected) {
      try {
        await api.deleteScholarship(sId);
      } catch (err) {
        console.warn('Backend delete scholarship sync warning:', err.message);
      }
    }

    setState(prev => {
      const nextEdits = { ...prev.scholarshipEdits };
      delete nextEdits[sId];
      return {
        ...prev,
        scholarshipEdits: nextEdits,
        deletedScholarshipIds: [...new Set([...(prev.deletedScholarshipIds || []), sId])],
        wishlist: (prev.wishlist || []).filter(id => id !== sId),
        compareList: (prev.compareList || []).filter(id => id !== sId)
      };
    });

    notify({
      title: 'Scholarship Removed',
      body: 'The scholarship scheme has been removed from the portal catalog.',
      tone: 'info'
    });
    return { ok: true };
  }, [backendConnected, notify]);

  const value = {
    ...state,
    wishlist,
    compareList,
    scholarships,
    findScholarship,
    unreadCount,
    backendConnected,
    login,
    logout,
    register,
    updateProfile,
    addApplication,
    advanceApplication,
    reviewApplication,
    addDocument,
    removeDocument,
    setDocumentStatus,
    staffLogin,
    staffLogout,
    organizerLogin,
    organizerLogout,
    quickDemoLogin,
    notify,
    markAllRead,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    addScholarship,
    removeScholarship,
    setLastEligibilityRun: (run) => setState(prev => ({ ...prev, lastEligibilityRun: run }))
  };

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}
