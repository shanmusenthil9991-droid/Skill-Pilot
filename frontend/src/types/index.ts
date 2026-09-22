export interface StudentProfile {
  id: number;
  student_id: string;
  name: string;
  email: string;
  department: string;
  dept_code: string;
  year: number;
  semester: number;
  cgpa: number;
  attendance_pct: number;
  backlogs: number;
  career_interests: string[];
  phone: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
  leetcode_handle: string;
  codeforces_handle: string;
}

export interface SubjectItem {
  subject_code: string;
  subject_name: string;
  grade: string;
  marks_pct: number;
  credits: number;
  attendance_pct: number;
}

export interface SemesterData {
  semester_number: number;
  sgpa: number;
  calculated_cgpa: number;
  credits_earned: number;
  credits_total: number;
  attendance_pct: number;
  backlogs: number;
  subjects: SubjectItem[];
}

export interface AcademicsSummary {
  overall_cgpa: number;
  overall_attendance_pct: number;
  total_backlogs: number;
  current_semester: number;
  cgpa_trend: { semester: string; sgpa: number; cgpa: number; attendance: number }[];
  semesters: SemesterData[];
}

export interface ProgrammingProgressItem {
  id: number;
  language_name: string;
  icon_name: string;
  topics_completed: number;
  total_topics: number;
  completion_pct: number;
  assessment_score: number;
  questions_attempted: number;
  questions_solved: number;
  accuracy_pct: number;
  skill_level: string;
  completed_topics: string[];
  pending_topics: string[];
}

export interface DSATopicItem {
  id: number;
  topic_name: string;
  category: string;
  completed_problems: number;
  total_problems: number;
  completion_pct: number;
  accuracy_pct: number;
  assessment_score: number;
  skill_level: string;
  status: string;
}

export interface OnlineCodingSummary {
  platform_name: string;
  handle: string;
  total_attempted: number;
  total_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  accuracy_pct: number;
  contest_rating: number;
  contests_count: number;
  global_rank: string;
  coding_streak_days: number;
  recent_activity: { date: string; count: number; problems: string[] }[];
  topic_distribution: Record<string, { attempted: number; solved: number; accuracy: number }>;
  language_distribution: Record<string, { attempted: number; solved: number; accuracy: number }>;
}

export interface AptitudeTopicItem {
  id: number;
  topic_name: string;
  completed_modules: number;
  total_modules: number;
  accuracy_pct: number;
  assessment_score: number;
  questions_attempted: number;
  questions_solved: number;
  strength_level: string;
}

export interface LogicalTopicItem {
  id: number;
  topic_name: string;
  completed_modules: number;
  total_modules: number;
  accuracy_pct: number;
  assessment_score: number;
  status: string;
  strength_level: string;
}

export interface VerbalTopicItem {
  id: number;
  topic_name: string;
  completion_pct: number;
  accuracy_pct: number;
  assessment_score: number;
  is_weak_topic: boolean;
}

export interface CommunicationSummary {
  overall_score: number;
  current_level: string;
  speaking_score: number;
  listening_score: number;
  writing_score: number;
  presentation_score: number;
  interview_comm_score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface ProjectItem {
  id: number;
  title: string;
  domain: string;
  problem_statement: string;
  technologies: string[];
  languages: string[];
  frameworks: string[];
  database: string;
  apis_used: string[];
  ai_ml_components: string;
  deployment_platform: string;
  completion_pct: number;
  student_role: string;
  github_url: string;
  live_url: string;
  completed_components: string[];
  pending_components: string[];
}

export interface InternshipItem {
  id: number;
  company: string;
  role: string;
  domain: string;
  duration: string;
  start_date: string;
  end_date: string;
  technologies: string[];
  responsibilities: string;
  skills_acquired: string[];
  completed_tasks: string[];
  pending_tasks: string[];
  completion_pct: number;
}

export interface CertificationItem {
  id: number;
  name: string;
  provider: string;
  domain: string;
  issue_date: string;
  credential_id: string;
  credential_url: string;
  status: string;
}

export interface TrainingItem {
  id: number;
  training_name: string;
  domain: string;
  completed_hours: number;
  total_hours: number;
  completion_pct: number;
  assessment_score: number;
  modules_list: string[];
}

export interface CareerDomainScore {
  domain_name: string;
  category: string;
  alignment_score: number;
  matching_skills: string[];
  missing_skills: string[];
  completed_skills?: string[];
  in_progress_skills?: string[];
  recommended_roles: string[];
  growth_index: number;
}

export interface ECEDualTrackSummary {
  department: string;
  is_ece: boolean;
  core_ece_alignment_pct: number;
  software_cs_alignment_pct: number;
  core_ece_domains: CareerDomainScore[];
  software_cs_domains: CareerDomainScore[];
  core_ece_gaps: { pathway: string; skill: string; current_level: string; required_level: string; gap_severity: string; impact: string }[];
  software_cs_gaps: { pathway: string; skill: string; current_level: string; required_level: string; gap_severity: string; impact: string }[];
  primary_recommendation: string;
}

export interface PlacementReadinessData {
  readiness_score: number;
  readiness_status: string;
  confidence_level: number;
  model_used: string;
  top_positive_factors: { factor: string; detail: string; weight: string }[];
  top_negative_factors: { factor: string; detail: string; weight: string }[];
  feature_contributions: Record<string, number>;
  disclaimer: string;
}

export interface SkillGapItem {
  id: number;
  target_career_role: string;
  skill_name: string;
  current_level: string;
  required_level: string;
  gap_severity: string;
  priority: number;
  reason: string;
  recommended_action: string;
}

export interface RecommendationItem {
  id: number;
  category: string;
  title: string;
  what: string;
  why: string;
  next_step: string;
  priority: string;
  is_completed: boolean;
}

