export type RiskLevel = 'HIGH_RISK' | 'CAUTION' | 'LOW_RISK';

export type Language = 'ne' | 'en';

export interface SuspiciousEntity {
  type: string;
  value: string;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  explanationNe: string;
  explanationEn: string;
}

export interface RiskFactor {
  id: string;
  nameNe: string;
  nameEn: string;
  status: 'FLAGGED' | 'WARNING' | 'CLEAR';
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  statusNe: string;
  statusEn: string;
  detailNe: string;
  detailEn: string;
}

export interface DetailedAnalysisData {
  confidenceScore: number; // 0 - 100
  confidenceLabelNe: string;
  confidenceLabelEn: string;
  suspiciousEntities: SuspiciousEntity[];
  riskFactors: RiskFactor[];
}

export interface MessageAnalysisResult {
  riskLevel: RiskLevel;
  score: number; // 0-100
  scamType: string;
  summary: string;
  warningSigns: string[];
  psychologicalTricks: string[];
  actionSteps: string[];
  disclaimer: string;
  source?: string;
  detailedAnalysis?: DetailedAnalysisData;
}

export interface LinkAnalysisResult {
  riskLevel: RiskLevel;
  score: number;
  scamType?: string;
  protocol: string;
  hostname: string;
  summary: string;
  findings: string[];
  recommendations: string[];
  source?: string;
  detailedAnalysis?: DetailedAnalysisData;
}

export interface ImageAnalysisResult {
  riskLevel: RiskLevel;
  score: number; // 0-100
  scamType: string;
  extractedText: string;
  summary: string;
  visualClues: string[];
  warningSigns: string[];
  actionSteps: string[];
  disclaimer: string;
  source?: string;
  detailedAnalysis?: DetailedAnalysisData;
}

export interface SampleScreenshot {
  id: string;
  titleNe: string;
  titleEn: string;
  categoryNe: string;
  categoryEn: string;
  descriptionNe: string;
  descriptionEn: string;
  sampleText: string;
  imageUrl?: string;
}

export interface SampleMessage {
  id: string;
  titleNe: string;
  titleEn: string;
  categoryNe: string;
  categoryEn: string;
  textNe: string;
  textEn: string;
  expectedRisk: RiskLevel;
}

export interface SampleLink {
  id: string;
  titleNe: string;
  titleEn: string;
  url: string;
  expectedRisk: RiskLevel;
}

export interface ScamEncyclopediaItem {
  id: string;
  titleNe: string;
  titleEn: string;
  categoryNe: string;
  categoryEn: string;
  iconName: string;
  summaryNe: string;
  summaryEn: string;
  typicalExampleNe: string;
  typicalExampleEn: string;
  redFlagsNe: string[];
  redFlagsEn: string[];
  defenseTipsNe: string[];
  defenseTipsEn: string[];
}

export interface ComplaintData {
  applicantName: string;
  applicantPhone: string;
  applicantAddress: string;
  applicantCitizenship: string;
  incidentDate: string;
  incidentTime: string;
  platformUsed: string; // WhatsApp, Facebook, SMS, Phone Call, Telegram
  scammerPhone: string;
  scammerAccount: string;
  scammerNameOrHandle: string;
  amountLost: string;
  transactionId: string;
  paymentMedium: string; // eSewa, Khalti, Bank Transfer, ConnectIPS, Cash
  description: string;
  evidenceItems: string[];
}

export interface ShoppingScamInput {
  productName: string;
  marketPrice: number | string;
  advertisedPrice: number | string;
  advancePayment: number | string;
  sellerName: string;
  sellerPlatform: string;
  sellerProfileUrl: string;
  paymentMethod: string;
  hasReturnPolicy: boolean;
  hasPhysicalStore: boolean;
  commentsDisabled: boolean;
  adDescription: string;
  screenshotNotes: string;
}

export interface ShoppingAnalysisResult {
  riskLevel: RiskLevel;
  score: number; // 0-100
  scamType?: string;
  discountPercent: number;
  advanceRatio: number;
  summary: string;
  priceAssessment: string;
  advancePaymentAssessment: string;
  sellerAssessment: string;
  warningSigns: string[];
  safeAlternatives: string[];
  disclaimer: string;
  detailedAnalysis?: DetailedAnalysisData;
}

export interface SampleShoppingItem {
  id: string;
  titleNe: string;
  titleEn: string;
  data: ShoppingScamInput;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  source?: string;
  suggestions?: string[];
}

export interface CustomerCheckRecord {
  id: string;
  timestamp: string;
  toolType: 'message' | 'link' | 'shopping' | 'photo' | 'voice' | 'chat';
  toolNameNe: string;
  toolNameEn: string;
  customerSession: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userRole?: string;
  customerIp?: string;
  location?: string;
  inputSummary: string;
  fullInput: any;
  riskLevel: 'HIGH_RISK' | 'CAUTION' | 'LOW_RISK';
  score: number;
  scamType?: string;
  solutionSummary: string;
  warningSigns: string[];
  actionSteps: string[];
  source: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'citizen' | 'admin';
  createdAt: string;
  lastLoginAt: string;
  totalChecks: number;
}

export interface CustomerFeedback {
  id: string;
  timestamp: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1-5
  feedbackType: 'accuracy' | 'false_positive' | 'missed_scam' | 'app_experience' | 'feature_request' | 'general';
  checkContext?: string;
  comment: string;
  adminReply?: string;
  status: 'PENDING' | 'REVIEWED';
}

export interface CustomerIssue {
  id: string;
  ticketNumber: string;
  timestamp: string;
  customerName: string;
  customerContact: string;
  category: 'new_scam_pattern' | 'wrong_verdict' | 'emergency_escalation' | 'app_bug' | 'wallet_reversal';
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  adminNotes?: string;
  adminReply?: string;
  resolvedAt?: string;
}

export interface CustomerComment {
  id: string;
  timestamp: string;
  authorName: string;
  isVerifiedVictim?: boolean;
  topic: string;
  content: string;
  likes: number;
  replies?: Array<{
    id: string;
    author: string;
    isAdmin?: boolean;
    text: string;
    timestamp: string;
  }>;
}

export interface AdminStats {
  totalChecks: number;
  highRiskCount: number;
  cautionCount: number;
  lowRiskCount: number;
  toolBreakdown: Record<string, number>;
  totalFeedback: number;
  avgRating: number;
  openIssues: number;
  resolvedIssues: number;
  totalComments: number;
  lastActivity: string;
}



