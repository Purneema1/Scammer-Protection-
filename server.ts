import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  recordCustomerCheck,
  getCustomerChecks,
  deleteCustomerCheck,
  clearAllCustomerChecks,
  addCustomerFeedback,
  getCustomerFeedbacks,
  replyToFeedback,
  createCustomerIssue,
  getCustomerIssues,
  updateCustomerIssue,
  getCustomerComments,
  addCustomerComment,
  replyToCustomerComment,
  likeCustomerComment,
  getAdminDashboardStats,
  registerUser,
  authenticateUser,
  requestPasswordReset,
  resetUserPassword,
  getAllUsers,
} from './server-store.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Helper to reliably extract citizen user identity from request
function extractCheckUserInfo(req: express.Request) {
  const bodyUser = req.body?.userInfo;
  const headerSession = req.headers['x-customer-session'] as string;
  const headerUserId = req.headers['x-user-id'] as string;
  const headerUserName = req.headers['x-user-name'] as string;
  const headerUserEmail = req.headers['x-user-email'] as string;

  const userId = bodyUser?.userId || headerUserId || undefined;
  const userName = bodyUser?.userName || headerUserName || undefined;
  const userEmail = bodyUser?.userEmail || headerUserEmail || undefined;
  const userPhone = bodyUser?.userPhone || undefined;
  const userRole = bodyUser?.userRole || undefined;

  let customerSession = headerSession;
  if (userName) {
    customerSession = `${userName}${userEmail ? ' (' + userEmail + ')' : ''}`;
  } else if (!customerSession) {
    customerSession = 'Citizen-KTM-' + Math.floor(1000 + Math.random() * 9000);
  }

  return { userId, userName, userEmail, userPhone, userRole, customerSession };
}

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiAvailable: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// Message Analysis Endpoint
app.post('/api/analyze-message', async (req, res) => {
  try {
    const { message, lang = 'ne' } = req.body;
    const userMeta = extractCheckUserInfo(req);

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const trimmed = message.trim();

    // If Gemini AI is configured on server, run deep contextual model analysis
    if (ai) {
      const isNepali = lang === 'ne';
      const prompt = `You are a world-class cybersecurity scam detection expert specializing in South Asian and global digital fraud (SMS, WhatsApp, Telegram, Facebook, TikTok, bank phishing, job scams, prize fraud, eSewa/Khalti/wallet scams, crypto ponzi).
Analyze the following user-submitted message for scam/fraud indicators.
User language: ${isNepali ? 'Nepali (नेपाली)' : 'English'}.

Message to analyze:
"""
${trimmed}
"""

Evaluate carefully:
1. Risk Level:
   - "HIGH_RISK": Strong indicators of scam (asking OTP/password, fake lottery/prize, urgent money transfer, extortion, impersonating police/bank, malicious link).
   - "CAUTION": Suspicious wording, unverified opportunity, vague claims, or unknown sender pressure.
   - "LOW_RISK": Normal conversational or genuine notification, no classic scam patterns.
2. Numeric score (0-100, where 100 is definite scam, 0 is completely harmless).
3. Scam Type classification (e.g. Lottery Prize Scam, OTP / Bank Impersonation, Fake Job / Visa Offer, Phishing Link, Crypto / Investment Ponzi, Delivery Fee Advance Scam, Not a Scam).
4. Short Summary explaining the verdict in ${isNepali ? 'Nepali' : 'English'}.
5. Warning Signs: Array of specific triggers found in the message with concise explanations in ${isNepali ? 'Nepali' : 'English'}.
6. Psychological Tricks: Tactics used (e.g., "कृत्रिम हतार (Artificial Urgency)", "लोभ र पुरस्कार (Greed/Prize)", "अधिकारको दुरुपयोग (Authority Impersonation)", "डर र धम्की (Fear/Threat)").
7. Next Steps: Array of 3-4 concrete protective actions for the recipient in ${isNepali ? 'Nepali' : 'English'}.
8. Clear disclaimer that AI output is advice and not a guarantee.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a cybersecurity expert scam analyst. Always return valid structured JSON matching the requested schema. Provide clear, empathetic, and protective guidance in the requested language (Nepali or English).',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: {
                type: Type.STRING,
                description: 'Must be one of: HIGH_RISK, CAUTION, LOW_RISK',
              },
              score: {
                type: Type.NUMBER,
                description: 'Scam probability score from 0 to 100',
              },
              scamType: {
                type: Type.STRING,
                description: 'Category of scam in requested language',
              },
              summary: {
                type: Type.STRING,
                description: 'Brief verdict summary in requested language',
              },
              warningSigns: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of specific warning indicators found',
              },
              psychologicalTricks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Psychological manipulation tactics identified',
              },
              actionSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Recommended actions to protect oneself',
              },
              disclaimer: {
                type: Type.STRING,
                description: 'Standard safety disclaimer',
              },
            },
            required: [
              'riskLevel',
              'score',
              'scamType',
              'summary',
              'warningSigns',
              'actionSteps',
            ],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        recordCustomerCheck({
          ...userMeta,
          toolType: 'message',
          toolNameNe: 'सन्देश र SMS जाँच',
          toolNameEn: 'Message & SMS Check',
          inputSummary: trimmed.length > 100 ? trimmed.slice(0, 100) + '...' : trimmed,
          fullInput: { message: trimmed, lang },
          riskLevel: parsed.riskLevel || 'CAUTION',
          score: parsed.score || 50,
          scamType: parsed.scamType,
          solutionSummary: parsed.summary || '',
          warningSigns: parsed.warningSigns || [],
          actionSteps: parsed.actionSteps || [],
          source: 'gemini-3.8-flash',
        });
        return res.json({
          success: true,
          source: 'gemini-3.8-flash',
          data: parsed,
        });
      }
    }

    // Fallback server rule engine if Gemini AI is not configured or in case of fallback
    const fallbackData = analyzeMessageRuleBased(trimmed, lang);
    recordCustomerCheck({
      ...userMeta,
      toolType: 'message',
      toolNameNe: 'सन्देश र SMS जाँच',
      toolNameEn: 'Message & SMS Check',
      inputSummary: trimmed.length > 100 ? trimmed.slice(0, 100) + '...' : trimmed,
      fullInput: { message: trimmed, lang },
      riskLevel: fallbackData.riskLevel as any,
      score: fallbackData.score,
      scamType: fallbackData.scamType,
      solutionSummary: fallbackData.summary,
      warningSigns: fallbackData.warningSigns,
      actionSteps: fallbackData.actionSteps,
      source: 'rule-engine',
    });
    return res.json({
      success: true,
      source: 'rule-engine',
      data: fallbackData,
    });
  } catch (error: any) {
    console.error('Error analyzing message:', error);
    // Provide reliable rule-based response even if AI model fails
    const fallbackData = analyzeMessageRuleBased(req.body.message || '', req.body.lang || 'ne');
    return res.json({
      success: true,
      source: 'fallback-rule-engine',
      data: fallbackData,
    });
  }
});

// Link Analysis Endpoint
app.post('/api/analyze-link', async (req, res) => {
  try {
    const { url, lang = 'ne' } = req.body;
    const userMeta = extractCheckUserInfo(req);
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const trimmed = url.trim();

    // Rule-based heuristic verification for URLs
    const ruleResult = inspectUrlPatterns(trimmed, lang);

    if (ai) {
      const isNepali = lang === 'ne';
      const prompt = `Analyze this URL for phishing, fraudulent impersonation, typo-squatting, credential harvesting, or deceptive scam patterns.
URL: "${trimmed}"
Target language: ${isNepali ? 'Nepali' : 'English'}.

Evaluate:
- Is it masquerading as a bank, wallet (eSewa, Khalti), social media (Facebook, Instagram, WhatsApp, TikTok), courier, government authority, or crypto platform?
- Look for suspicious TLDs, misleading subdomains, punycode/IDN spoofing, insecure HTTP.
- Return structured JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: {
                type: Type.STRING,
                description: 'HIGH_RISK, CAUTION, or LOW_RISK',
              },
              score: { type: Type.NUMBER, description: 'Risk score 0-100' },
              summary: { type: Type.STRING, description: 'Evaluation summary' },
              findings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of technical findings',
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Safety steps before visiting',
              },
            },
            required: ['riskLevel', 'score', 'summary', 'findings', 'recommendations'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        const mergedFindings = Array.from(new Set([...ruleResult.findings, ...parsed.findings]));
        recordCustomerCheck({
          ...userMeta,
          toolType: 'link',
          toolNameNe: 'लिंक / URL जाँच',
          toolNameEn: 'Link / Phishing URL Check',
          inputSummary: trimmed.length > 90 ? trimmed.slice(0, 90) + '...' : trimmed,
          fullInput: { url: trimmed, lang },
          riskLevel: (parsed.riskLevel as any) || (ruleResult.riskLevel as any),
          score: parsed.score || ruleResult.score,
          scamType: parsed.riskLevel === 'HIGH_RISK' ? 'शंकास्पद फिसिङ लिंक (Phishing / Deceptive Domain)' : 'सामान्य वेब लिंक',
          solutionSummary: parsed.summary || ruleResult.summary,
          warningSigns: mergedFindings,
          actionSteps: parsed.recommendations || ruleResult.recommendations,
          source: 'gemini-3.8-flash',
        });
        return res.json({
          success: true,
          source: 'gemini-3.8-flash',
          data: {
            ...ruleResult,
            ...parsed,
            findings: mergedFindings,
          },
        });
      }
    }

    recordCustomerCheck({
      ...userMeta,
      toolType: 'link',
      toolNameNe: 'लिंक / URL जाँच',
      toolNameEn: 'Link / Phishing URL Check',
      inputSummary: trimmed.length > 90 ? trimmed.slice(0, 90) + '...' : trimmed,
      fullInput: { url: trimmed, lang },
      riskLevel: ruleResult.riskLevel as any,
      score: ruleResult.score,
      scamType: ruleResult.riskLevel === 'HIGH_RISK' ? 'शंकास्पद फिसिङ लिंक (Phishing / Deceptive Domain)' : 'सामान्य वेब लिंक',
      solutionSummary: ruleResult.summary,
      warningSigns: ruleResult.findings,
      actionSteps: ruleResult.recommendations,
      source: 'rule-engine',
    });
    return res.json({
      success: true,
      source: 'rule-engine',
      data: ruleResult,
    });
  } catch (error: any) {
    console.error('Error analyzing link:', error);
    const fallback = inspectUrlPatterns(req.body.url || '', req.body.lang || 'ne');
    return res.json({
      success: true,
      source: 'fallback-rule-engine',
      data: fallback,
    });
  }
});

// Shopping Scam Analysis Endpoint
app.post('/api/analyze-shopping-scam', async (req, res) => {
  try {
    const { input, lang = 'ne' } = req.body;
    const userMeta = extractCheckUserInfo(req);
    if (!input) {
      return res.status(400).json({ error: 'Shopping offer input is required' });
    }

    const { analyzeShoppingScamClient } = await import('./src/utils/shoppingAnalyzer.ts');
    const ruleResult = analyzeShoppingScamClient(input, lang);

    if (ai) {
      const isNepali = lang === 'ne';
      const prompt = `You are a cybersecurity and consumer protection investigator evaluating an online social media shopping advertisement (Facebook Marketplace, TikTok Shop, Instagram).
Product: ${input.productName || 'Unspecified'}
Market Price: Rs. ${input.marketPrice || 'N/A'}
Advertised Price: Rs. ${input.advertisedPrice || 'N/A'}
Demanded Advance Payment: Rs. ${input.advancePayment || '0'}
Seller: ${input.sellerName || 'Anonymous'} (${input.sellerPlatform || 'Social Media'})
Payment Channel: ${input.paymentMethod || 'Personal Wallet'}
Comments Disabled: ${input.commentsDisabled ? 'YES' : 'NO'}
Physical Store: ${input.hasPhysicalStore ? 'YES' : 'NO'}
Return Policy: ${input.hasReturnPolicy ? 'YES' : 'NO'}
Ad Text: """${input.adDescription || ''}"""
Evidence/Screenshot Notes: """${input.screenshotNotes || ''}"""
Target Language: ${isNepali ? 'Nepali (नेपाली)' : 'English'}.

Evaluate:
- Price realism (severe price disparity bait).
- Advance payment risk (risk of non-delivery or seller ghosting after money is transferred).
- Seller transparency and suppression of public feedback.
- Do NOT label a seller a criminal without judicial proof; present objective risk probabilities and buyer protection advice.
Return valid structured JSON matching schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.STRING, description: 'HIGH_RISK, CAUTION, or LOW_RISK' },
              score: { type: Type.NUMBER, description: 'Risk score 0-100' },
              summary: { type: Type.STRING, description: 'Objective assessment summary' },
              warningSigns: { type: Type.ARRAY, items: { type: Type.STRING } },
              safeAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['riskLevel', 'score', 'summary', 'warningSigns', 'safeAlternatives'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        const mergedSigns = Array.from(new Set([...ruleResult.warningSigns, ...(parsed.warningSigns || [])]));
        const mergedAlts = Array.from(new Set([...ruleResult.safeAlternatives, ...(parsed.safeAlternatives || [])]));

        recordCustomerCheck({
          ...userMeta,
          toolType: 'shopping',
          toolNameNe: 'सोसल मिडिया किनमेल जाँच',
          toolNameEn: 'Social Media Shopping Check',
          inputSummary: `${input.productName || 'सामान'}: विज्ञापन रु. ${input.advertisedPrice || 0} (बजार रु. ${input.marketPrice || 0}), अग्रिम रु. ${input.advancePayment || 0}`,
          fullInput: input,
          riskLevel: (parsed.riskLevel as any) || (ruleResult.riskLevel as any),
          score: parsed.score || ruleResult.score,
          scamType: 'सोसल मिडिया किनमेल र अग्रिम भुक्तानी ठगी',
          solutionSummary: parsed.summary || ruleResult.summary,
          warningSigns: mergedSigns,
          actionSteps: mergedAlts,
          source: 'gemini-3.8-flash',
        });

        return res.json({
          success: true,
          source: 'gemini-3.8-flash',
          data: {
            ...ruleResult,
            ...parsed,
            warningSigns: mergedSigns,
            safeAlternatives: mergedAlts,
          },
        });
      }
    }

    recordCustomerCheck({
      ...userMeta,
      toolType: 'shopping',
      toolNameNe: 'सोसल मिडिया किनमेल जाँच',
      toolNameEn: 'Social Media Shopping Check',
      inputSummary: `${input.productName || 'सामान'}: विज्ञापन रु. ${input.advertisedPrice || 0} (बजार रु. ${input.marketPrice || 0}), अग्रिम रु. ${input.advancePayment || 0}`,
      fullInput: input,
      riskLevel: ruleResult.riskLevel as any,
      score: ruleResult.score,
      scamType: 'सोसल मिडिया किनमेल र अग्रिम भुक्तानी ठगी',
      solutionSummary: ruleResult.summary,
      warningSigns: ruleResult.warningSigns,
      actionSteps: ruleResult.safeAlternatives,
      source: 'rule-engine',
    });

    return res.json({
      success: true,
      source: 'rule-engine',
      data: ruleResult,
    });
  } catch (error: any) {
    console.error('Error analyzing shopping scam:', error);
    const { analyzeShoppingScamClient } = await import('./src/utils/shoppingAnalyzer.ts');
    const fallback = analyzeShoppingScamClient(req.body.input || {}, req.body.lang || 'ne');
    return res.json({
      success: true,
      source: 'fallback-rule-engine',
      data: fallback,
    });
  }
});

// Photo / Screenshot Scam Analysis Endpoint (Multimodal Gemini Vision)
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', notes = '', lang = 'ne' } = req.body;
    const userMeta = extractCheckUserInfo(req);
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 is required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const isNepali = lang === 'ne';

    if (ai) {
      const prompt = `You are a cybersecurity expert analyzing a user-uploaded screenshot (Facebook Marketplace ad, TikTok offer, WhatsApp/SMS chat, fake eSewa receipt, or lottery message).
User notes: "${notes || 'None'}"
Language: ${isNepali ? 'Nepali (नेपाली)' : 'English'}.

Carefully analyze:
1. OCR: Transcribe all readable text from the image.
2. Visual Clues: Stolen logos, fake verified badges, low-res graphics, altered numbers, suppressed comments.
3. Scam indicators: Advance payment demands, unrealistic discounts, fake prizes, threats, OTP requests.
4. Risk Level: "HIGH_RISK", "CAUTION", or "LOW_RISK" (0-100).
5. Explain clearly in ${isNepali ? 'Nepali' : 'English'} why it is suspicious and what protective action to take before sending money.
Return structured JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              { text: prompt },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.STRING, description: 'HIGH_RISK, CAUTION, or LOW_RISK' },
              score: { type: Type.NUMBER, description: 'Risk score 0-100' },
              scamType: { type: Type.STRING, description: 'Scam type classification' },
              extractedText: { type: Type.STRING, description: 'Text extracted from the screenshot' },
              summary: { type: Type.STRING, description: 'Verdict summary' },
              visualClues: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Visual indicators observed' },
              warningSigns: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Specific fraud warnings' },
              actionSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Recommended safety actions' },
            },
            required: ['riskLevel', 'score', 'scamType', 'extractedText', 'summary', 'visualClues', 'warningSigns', 'actionSteps'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        const { extractDetailedAnalysisForMessage } = await import('./src/utils/detailedAnalyzer.ts');
        const detailed = extractDetailedAnalysisForMessage(
          parsed.extractedText || notes || '',
          parsed.riskLevel,
          parsed.score,
          parsed.warningSigns || [],
          parsed.visualClues || []
        );

        recordCustomerCheck({
          ...userMeta,
          toolType: 'photo',
          toolNameNe: 'फोटो / स्क्रिनसट जाँच',
          toolNameEn: 'Photo & Screenshot Check',
          inputSummary: notes ? `स्क्रिनसट नोट: ${notes.slice(0, 90)}` : 'अपलोड गरिएको विज्ञापन वा च्याट स्क्रिनसट',
          fullInput: { notes, mimeType, lang },
          riskLevel: parsed.riskLevel || 'CAUTION',
          score: parsed.score || 65,
          scamType: parsed.scamType || 'स्क्रिनसट ठगी संकेत',
          solutionSummary: parsed.summary || '',
          warningSigns: parsed.warningSigns || [],
          actionSteps: parsed.actionSteps || [],
          source: 'gemini-3.8-flash-vision',
        });

        return res.json({
          success: true,
          source: 'gemini-3.8-flash-vision',
          data: {
            ...parsed,
            disclaimer: isNepali
              ? 'यो नतिजा स्क्रिनसटको दृश्य तथा लेखाइ विश्लेषणमा आधारित मार्गदर्शन हो। वित्तीय निर्णय गर्नुअघि आधिकारिक निकायबाट पुष्टि गर्नुहोस्।'
              : 'This assessment is automated guidance based on image artifacts. Verify with official authorities before any financial transaction.',
            detailedAnalysis: detailed,
          },
        });
      }
    }

    const fallback = generateImageFallback(notes, lang);
    recordCustomerCheck({
      ...userMeta,
      toolType: 'photo',
      toolNameNe: 'फोटो / स्क्रिनसट जाँच',
      toolNameEn: 'Photo & Screenshot Check',
      inputSummary: notes ? `स्क्रिनसट नोट: ${notes.slice(0, 90)}` : 'अपलोड गरिएको विज्ञापन वा च्याट स्क्रिनसट',
      fullInput: { notes, mimeType, lang },
      riskLevel: fallback.riskLevel as any,
      score: fallback.score,
      scamType: fallback.scamType,
      solutionSummary: fallback.summary,
      warningSigns: fallback.warningSigns,
      actionSteps: fallback.actionSteps,
      source: 'fallback-image-analyzer',
    });
    return res.json({
      success: true,
      source: 'fallback-image-analyzer',
      data: fallback,
    });
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    const fallback = generateImageFallback(req.body.notes || '', req.body.lang || 'ne');
    return res.json({
      success: true,
      source: 'fallback-image-analyzer',
      data: fallback,
    });
  }
});

// Gemini Cyber Defense Chatbot (100% Free Tier via gemini-3.8-flash)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], lang = 'ne' } = req.body;
    const userMeta = extractCheckUserInfo(req);
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const trimmed = message.trim();
    const isNepali = lang === 'ne';

    if (ai) {
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // Include valid previous conversation turns
      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          if (item && item.content && (item.role === 'user' || item.role === 'model')) {
            contents.push({
              role: item.role,
              parts: [{ text: String(item.content) }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: trimmed }],
      });

      const systemInstruction = isNepali
        ? `तपाईं नेपालको आधिकारिक अनलाइन साइबर सुरक्षा, ठगी नियन्त्रण र उपभोक्ता संरक्षण सहायक (Nepal Cyber Security & Fraud Defense AI) हुनुहुन्छ।
तपाईंको मुख्य उद्देश्य नेपाली नागरिकलाई डिजिटल ठगीबाट जोगाउनु, सही जानकारी दिनु र समस्या परेमा तत्काल चाल्नुपर्ने कानुनी तथा प्राविधिक कदम सिकाउनु हो।

विशेष निर्देशनहरू:
१. भाषा: सरल, आदरार्थी, र स्पष्ट नेपालीमा जवाफ दिनुहोस्।
२. प्राथमिकता (गोल्डेन विन्डो): यदि प्रयोगकर्ताले पैसा पठाइसकेको वा खाता ह्याक भएको बताएमा, ढिला नगरी तुरुन्त आफ्नो वालेट (eSewa / Khalti) वा बैंकको ग्राहक सेवामा फोन गरेर कारोबार रोक्का (Hold / Freeze) गर्न सल्लाह दिनुहोस् (२ घण्टाभित्र प्रयास गरे पैसा जोगिने सम्भावना बढी हुन्छ)।
३. नेपाल प्रहरी साइबर ब्युरो: आधिकारिक सम्पर्क दिनुहोस्:
   - फोन: ०१-४२१२९२९ / ०१-४२११३०४
   - इमेल: cyberbureau@nepalpolice.gov.np
   - ठेगाना: भोटाहिटी, काठमाडौं
४. रिकभरी ठगी (Recovery Scam) चेतावनी: "हामी तपाईंको गुमेको पैसा १००% फिर्ता गराइदिन्छौँ, यति शुल्क लाग्छ" भन्ने कुनै पनि अपरिचित व्यक्ति, टेलिग्राम च्यानल वा फेसबुक पेज अर्को ठगी हो भनेर स्पष्ट सचेत गराउनुहोस्।
५. ढाँचा: उत्तर सकेसम्म बुँदागत (bullet points) र बुझ्न सजिलो बनाउनुहोस्।`
        : `You are the Nepal Cyber Fraud Defense & Online Scam Protection Specialist.
Assist users with detecting fraud, securing digital wallets (eSewa, Khalti, ConnectIPS), Facebook Marketplace and TikTok shopping scams, fake jobs, lottery scams, and filing complaints with Nepal Police Cyber Bureau (01-4212929).
Keep advice calm, structured in bullet points, actionable, and strictly warn users never to pay upfront fees to alleged "fund recovery agents".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
        },
      });

      if (response.text) {
        const replyText = response.text.trim();
        recordCustomerCheck({
          ...userMeta,
          toolType: 'chat',
          toolNameNe: 'AI साइबर च्याटबट',
          toolNameEn: 'AI Cyber Defense Chat',
          inputSummary: trimmed.length > 95 ? trimmed.slice(0, 95) + '...' : trimmed,
          fullInput: { query: trimmed },
          riskLevel: trimmed.toLowerCase().includes('पैसा') || trimmed.toLowerCase().includes('ठग') ? 'HIGH_RISK' : 'CAUTION',
          score: 80,
          scamType: 'साइबर परामर्श तथा ठगी सोधपुछ',
          solutionSummary: replyText.slice(0, 160) + '...',
          warningSigns: ['प्रयोगकर्ताद्वारा सोधिएको शंकास्पद गतिविधि'],
          actionSteps: ['AI सल्लाह अनुसार सावधानी अपनाउनुहोस्'],
          source: 'gemini-3.8-flash',
        });

        return res.json({
          success: true,
          source: 'gemini-3.8-flash',
          reply: replyText,
        });
      }
    }

    const fallback = generateChatbotFallback(trimmed, lang);
    recordCustomerCheck({
      ...userMeta,
      toolType: 'chat',
      toolNameNe: 'AI साइबर च्याटबट',
      toolNameEn: 'AI Cyber Defense Chat',
      inputSummary: trimmed.length > 95 ? trimmed.slice(0, 95) + '...' : trimmed,
      fullInput: { query: trimmed },
      riskLevel: 'CAUTION',
      score: 75,
      scamType: 'साइबर परामर्श तथा ठगी सोधपुछ',
      solutionSummary: fallback.slice(0, 160) + '...',
      warningSigns: ['शंकास्पद गतिविधिको परामर्श'],
      actionSteps: ['आधिकारिक निकायसँग पुष्टि गर्नुहोस्'],
      source: 'rule-engine-knowledge',
    });

    return res.json({
      success: true,
      source: 'rule-engine-knowledge',
      reply: fallback,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const fallback = generateChatbotFallback(req.body?.message || '', req.body?.lang || 'ne');
    return res.json({
      success: true,
      source: 'fallback-knowledge',
      reply: fallback,
    });
  }
});

// ==========================================
// USER AUTHENTICATION & ACCOUNT API ROUTES
// ==========================================

// Register New User (Sign Up)
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'कृपया नाम, इमेल र पासवर्ड भर्नुहोस् (Missing fields)' });
    }
    const user = registerUser({
      name,
      email,
      phone: phone || '',
      password,
      role: role || (email.toLowerCase().includes('admin') ? 'admin' : 'citizen'),
    });
    return res.json({
      success: true,
      message: 'खाता सफलतापूर्वक तयार भयो (Account created successfully)',
      user,
      token: `token-${user.id}-${Date.now()}`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// User Sign In (Login)
app.post('/api/auth/signin', (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      return res.status(400).json({ success: false, error: 'कृपया इमेल/फोन र पासवर्ड भर्नुहोस्' });
    }
    const user = authenticateUser(emailOrPhone, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'गलत इमेल/फोन नम्बर वा पासवर्ड। कृपया पुनः जाँच्नुहोस् (Invalid email/phone or password)',
      });
    }
    return res.json({
      success: true,
      message: 'सफलतापूर्वक लगइन भयो (Signed in successfully)',
      user,
      token: `token-${user.id}-${Date.now()}`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Forgot Password - Request OTP Verification Code
app.post('/api/auth/forgot-password/request', (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) {
      return res.status(400).json({ success: false, error: 'कृपया इमेल वा फोन नम्बर राख्नुहोस्' });
    }
    const result = requestPasswordReset(emailOrPhone);
    if (!result.success) {
      return res.status(404).json({ success: false, error: result.message });
    }
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Forgot Password - Reset with OTP Code
app.post('/api/auth/forgot-password/reset', (req, res) => {
  try {
    const { emailOrPhone, code, newPassword } = req.body;
    if (!emailOrPhone || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'कृपया सबै विवरणहरू (कोड र नयाँ पासवर्ड) भर्नुहोस्' });
    }
    const result = resetUserPassword(emailOrPhone, code, newPassword);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.message });
    }
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// List All Registered Users (For Admin Panel)
app.get('/api/auth/users', (req, res) => {
  try {
    const users = getAllUsers();
    return res.json({ success: true, count: users.length, users });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ADMIN DASHBOARD & CHECK LOGS API ROUTES
// ==========================================

// Verify Admin PIN
app.post('/api/admin/verify-pin', (req, res) => {
  const { pin } = req.body;
  // Default easy admin passcode is admin123 (or empty check for testing)
  if (pin === 'admin123' || pin === 'admin') {
    return res.json({ success: true, authorized: true, role: 'admin' });
  }
  return res.status(401).json({ success: false, error: 'गलत पिन कोड (Invalid Admin PIN)' });
});

// Admin Stats Endpoint
app.get('/api/admin/stats', (req, res) => {
  try {
    const stats = getAdminDashboardStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Customer Checks Log Endpoint
app.get('/api/admin/checks', (req, res) => {
  try {
    const { toolType, riskLevel, search, userId, limit } = req.query;
    const checks = getCustomerChecks({
      toolType: toolType as string,
      riskLevel: riskLevel as string,
      search: search as string,
      userId: userId as string,
      limit: limit ? Number(limit) : 100,
    });
    res.json({ success: true, count: checks.length, checks });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete specific check log
app.delete('/api/admin/checks/:id', (req, res) => {
  try {
    const success = deleteCustomerCheck(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Clear all customer checks (Admin maintenance)
app.post('/api/admin/clear-checks', (req, res) => {
  try {
    clearAllCustomerChecks();
    res.json({ success: true, message: 'All check logs cleared' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// CUSTOMER FEEDBACK & RATINGS API ROUTES
// ==========================================

app.get('/api/feedback', (req, res) => {
  try {
    const list = getCustomerFeedbacks();
    res.json({ success: true, feedback: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feedback', (req, res) => {
  try {
    const { customerName, customerEmail, rating, feedbackType, checkContext, comment } = req.body;
    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const created = addCustomerFeedback({
      customerName: (customerName || 'अनाम प्रयोगकर्ता (Anonymous User)').trim(),
      customerEmail: customerEmail ? String(customerEmail).trim() : undefined,
      rating: Number(rating) || 5,
      feedbackType: feedbackType || 'general',
      checkContext: checkContext ? String(checkContext) : undefined,
      comment: comment.trim(),
    });

    res.json({ success: true, feedback: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/feedback/:id/reply', (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ error: 'Reply text required' });
    const success = replyToFeedback(req.params.id, String(reply).trim());
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// CUSTOMER ISSUES & TICKET REPORTING API
// ==========================================

app.get('/api/issues', (req, res) => {
  try {
    const list = getCustomerIssues();
    res.json({ success: true, issues: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/issues', (req, res) => {
  try {
    const { customerName, customerContact, category, title, description, severity } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const created = createCustomerIssue({
      customerName: (customerName || 'नागरिक प्रयोगकर्ता (Citizen)').trim(),
      customerContact: (customerContact || 'Not provided').trim(),
      category: category || 'new_scam_pattern',
      title: title.trim(),
      description: description.trim(),
      severity: severity || 'HIGH',
    });

    res.json({ success: true, issue: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/issues/:id', (req, res) => {
  try {
    const { status, severity, adminNotes, adminReply } = req.body;
    const updated = updateCustomerIssue(req.params.id, {
      status,
      severity,
      adminNotes,
      adminReply,
    });
    if (!updated) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json({ success: true, issue: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// COMMUNITY COMMENTS & DISCUSSION FORUM API
// ==========================================

app.get('/api/comments', (req, res) => {
  try {
    const list = getCustomerComments();
    res.json({ success: true, comments: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/comments', (req, res) => {
  try {
    const { authorName, topic, content, isVerifiedVictim } = req.body;
    if (!content || !topic) {
      return res.status(400).json({ error: 'Topic and content are required' });
    }
    const created = addCustomerComment({
      authorName: (authorName || 'नेपाली नागरिक (Citizen)').trim(),
      topic: topic.trim(),
      content: content.trim(),
      isVerifiedVictim: Boolean(isVerifiedVictim),
    });
    res.json({ success: true, comment: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/comments/:id/like', (req, res) => {
  try {
    const likes = likeCustomerComment(req.params.id);
    res.json({ success: true, likes });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/comments/:id/reply', (req, res) => {
  try {
    const { author, text, isAdmin } = req.body;
    if (!text) return res.status(400).json({ error: 'Reply text required' });
    const updated = replyToCustomerComment(req.params.id, {
      author: (author || 'Community Member').trim(),
      text: text.trim(),
      isAdmin: Boolean(isAdmin),
    });
    res.json({ success: Boolean(updated), comment: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

function generateChatbotFallback(userQuery: string, lang: 'ne' | 'en'): string {
  const isNe = lang === 'ne';
  const q = userQuery.toLowerCase();

  // 1. Already scammed / sent money
  if (/पैसा पठाइसक|पठाइदिए|ठगिए|फसे|money sent|scammed|paid|loss/.test(q)) {
    return isNe
      ? `🚨 **पैसा पठाइसकेपछि तत्काल चाल्नुपर्ने ४ प्राथमिकता कदमहरू:**

१. **वालेट वा बैंकमा तुरुन्त फोन गर्नुहोस् (गोल्डेन विन्डो):**
   - eSewa (1660-01-02121 / 01-5970120) वा Khalti (1660-01-38888) वा आफ्नो बैंकको ग्राहक सेवामा तत्काल फोन गर्नुहोस्।
   - कारोबार नम्बर (Transaction ID) टिपाएर विपक्षी खाता तुरुन्त **रोक्का (Freeze / Hold)** गर्न अनुरोध गर्नुहोस्।

२. **सबै प्रमाण सुरक्षित राख्नुहोस्:**
   - च्याटको स्क्रिनसट, फोन नम्बर, प्रोफाइल लिंक, डिपोजिट भौचर वा स्टेटमेन्ट सुरक्षित राख्नुहोस्।

३. **नेपाल प्रहरी साइबर ब्युरोमा उजुरी दिनुहोस्:**
   - फोन: **०१-४२१२९२९** वा **०१-४२११३०४**
   - इमेल: cyberbureau@nepalpolice.gov.np
   - भौतिक ठेगाना: भोटाहिटी, काठमाडौं

⚠️ **सचेत रहनुहोस् (रिकभरी ठगी):** "हामी तपाईंको गुमेको पैसा फिर्ता गराइदिन्छौँ" भन्दै शुल्क माग्ने कुनै पनि टेलिग्राम वा फेसबुक एजेन्टलाई पैसा नदिनुहोस्।`
      : `🚨 **Immediate Steps if You Have Sent Money:**

1. **Call Your Bank or Wallet Immediately (Golden Window):**
   - Contact eSewa (1660-01-02121), Khalti (1660-01-38888), or your bank customer support immediately.
   - Quote the Transaction ID and request an immediate account freeze on the receiver's end.

2. **Preserve All Evidence:**
   - Take full-screen screenshots of chats, payment slips, phone numbers, and profile URLs.

3. **Report to Nepal Police Cyber Bureau:**
   - Phone: **01-4212929** / **01-4211304**
   - Email: cyberbureau@nepalpolice.gov.np
   - Location: Bhotahity, Kathmandu

⚠️ **Warning:** Beware of fake "Recovery Agents" on Telegram or Facebook charging advance fees to recover lost funds.`;
  }

  // 2. eSewa accidental transfer scam
  if (/esewa|झुक्किएर|mistake|खातामा पैसा|रकम आयो|qr/.test(q)) {
    return isNe
      ? `⚠️ **इसेवा / खल्तीमा झुक्किएर पैसा आयो भन्ने ठगी (Accidental Transfer Scam):**

कसैले फोन गरेर "मेरो झुक्किएर तपाईंको इसेवामा पैसा आयो, कृपया फिर्ता पठाइदिनुस्" भन्यो भने:

१. **सिधै पैसा फिर्ता नपठाउनुहोस्:** पहिले आफ्नो वालेटको वास्तविक स्टेटमेन्ट खोल्नुहोस्। धेरैजसो ठगहरूले नक्कली SMS पठाएर झुक्याउँछन्।
२. **तेस्रो नम्बरमा पठाउन भनेमा कहिल्यै नपठाउनुहोस्:** ठगले कुनै तेस्रो नम्बरमा रकम पठाउन दबाब दिन्छ।
३. **कम्पनीलाई सम्पर्क गर्न भन्नुहोस्:** फोन गर्ने व्यक्तिलाई भन्नुहोस्— *"तपाईं इसेवाको आधिकारिक कस्टमर केयरमा सम्पर्क गर्नुहोस्, उनीहरूले नै आधिकारिक प्रणालीबाट रकम फिर्ता (Reversal) गरिदिनेछन्।"*
४. **OTP वा पिन कसैलाई नदिनुहोस्।**`
      : `⚠️ **eSewa / Digital Wallet "Accidental Transfer" Scam:**

If someone calls claiming they mistakenly sent money to your account and demands a refund:

1. **Do not send money back directly:** Check your actual in-app statement. Fraudsters often send spoofed fake SMS messages.
2. **Never send to a third-party QR or number:** This is used for money laundering and chargeback fraud.
3. **Instruct them to contact official support:** Tell the caller to contact eSewa / Khalti support directly for an official dispute reversal.
4. **Never share OTP or PIN numbers.**`;
  }

  // 3. Online shopping / advance payment
  if (/marketplace|tiktok|instagram|सपिङ|मोबाइल|सस्तो|advance|अग्रिम|shopping/.test(q)) {
    return isNe
      ? `🛍️ **सोसल मिडिया किनमेलमा जोगिने ५ सुनौला नियम:**

१. **अस्वाभाविक सस्तो मूल्य (Price Disparity):** रु. ३०,००० को सामान रु. १०,००० मा दिने विज्ञापन ९९% ठगीको जाल हुन्छ।
२. **अग्रिम भुक्तानी (Advance Payment) जोखिम:** डेलिभरी हुनुअघि पूरै वा आधा रकम व्यक्तिगत इसेवा वा बैंक खातामा माग्ने विक्रेतासँग सावधान हुनुहोस्।
३. **Cash on Delivery (COD) माग्नुहोस्:** सामान हातमा परेर जाँच गरेपछि मात्र भुक्तानी गर्ने विकल्प रोज्नुहोस्।
४. **दर्ता प्रमाण जाँच्नुहोस्:** पसलको दर्ता नम्बर (PAN/VAT) र भौतिक ठेगाना छ कि छैन यकिन गर्नुहोस्।
५. **कमेन्ट बन्द भएका पोस्टबाट टाढै रहनुहोस्:** ठगहरूले पोल खुल्ने डरले सोसल मिडिया विज्ञापनमा कमेन्ट बन्द राख्छन्।`
      : `🛍️ **Safe Social Media Shopping Guidelines:**

1. **Unrealistic Prices:** Expensive electronics at 70% discount are almost always bait scams.
2. **Advance Payment Risk:** Avoid paying upfront delivery charges or deposits to personal wallet numbers.
3. **Insist on Cash on Delivery (COD):** Pay only after inspecting the goods.
4. **Verify PAN/VAT:** Request official legal registration and store physical address.
5. **Beware of disabled comments:** Scammers lock comments to prevent victims from warning others.`;
  }

  // Default helpful response
  return isNe
    ? `🛡️ **नमस्ते! म नेपाल अनलाइन ठगी नियन्त्रण र साइबर सुरक्षा सहायक हुँ।**

तपाईं मलाई निम्न विषयहरूमा निःशुल्क सोध्न सक्नुहुन्छ:
- कसैले पठाएको सन्देश, अफर वा लिंक शंकास्पद छ कि छैन?
- सोसल मिडिया (फेसबुक, टिकटक) मा अस्वाभाविक सस्तो सामान र अग्रिम रकम माग्दा के गर्ने?
- इसेवा वा बैंक खातामा शंकास्पद फोन वा OTP आउँदा कसरी जोगिने?
- यदि पैसा पठाइसकिएको भए तत्काल कसरी रोक्का गर्ने र उजुरी लेख्ने?

कृपया तपाईंलाई परेको शंका वा सन्देश यहाँ लेख्नुहोस्, म तुरुन्त सुझाव दिनेछु!`
    : `🛡️ **Hello! I am your Cyber Fraud Defense AI Assistant.**

You can ask me anything about:
- Analyzing suspicious SMS, WhatsApp, or Telegram messages
- Detecting Facebook Marketplace & TikTok shopping scams
- Protecting digital wallets (eSewa, Khalti, ConnectIPS)
- Immediate emergency rescue steps and filing complaints with Nepal Cyber Bureau

Feel free to paste the suspicious message or describe what happened below!`;
}



function generateImageFallback(notes: string, lang: 'ne' | 'en') {
  const isNe = lang === 'ne';
  return {
    riskLevel: 'CAUTION',
    score: 65,
    scamType: isNe ? 'शंकास्पद सोसल मिडिया विज्ञापन / स्क्रिनसट' : 'Suspicious Social Media Screenshot',
    extractedText: notes || (isNe ? 'स्क्रिनसटबाट निकालिएको पाठ उपलब्ध छ' : 'Text extracted from uploaded image'),
    summary: isNe
      ? 'स्क्रिनसटमा अनलाइन ठगीसँग मिल्ने सम्भावित संकेतहरू (अत्यधिक छुट वा अग्रिम भुक्तानी) भेटिएका छन्। सामान हातमा नपरी पैसा नपठाउनुहोस्।'
      : 'Visual and textual analysis indicates caution. Verify the seller and avoid paying advance fees to personal accounts.',
    visualClues: [
      isNe ? 'अस्वाभाविक छुट वा प्रलोभन देखाउने ग्राफिक' : 'Promotional badge displaying heavy discounts',
      isNe ? 'व्यक्तिगत खाता वा कन्ट्याक्ट विवरण' : 'Personal wallet or phone contact visible in frame',
    ],
    warningSigns: [
      isNe ? 'सामान प्राप्त हुनुअगावै रकम स्थानान्तरण गर्न भनिएको संकेत' : 'Indication to transfer funds prior to parcel delivery',
      isNe ? 'कमेन्ट बन्द वा अपरिचित प्रोफाइल' : 'Unverified profile or restricted comments',
    ],
    actionSteps: [
      isNe ? 'Cash on Delivery (सामान पाएपछि मात्र पैसा तिर्ने) विकल्प माग्नुहोस्।' : 'Demand Cash on Delivery (COD).',
      isNe ? 'कुनै पनि व्यक्तिगत इसेवा वा बैंक खातामा अग्रिम रकम नपठाउनुहोस्।' : 'Never send advance money to personal QR accounts.',
      isNe ? 'पसलको दर्ता नम्बर (PAN/VAT) र भौतिक ठेगाना माग्नुहोस्।' : 'Request the legal PAN/VAT registration and storefront address.',
    ],
    disclaimer: isNe
      ? 'यो नतिजा स्वचालित विश्लेषणमा आधारित मार्गदर्शन हो। १००% ग्यारेन्टी हुँदैन।'
      : 'Automated guidance based on image artifacts. Not a legally binding verdict.',
  };
}

// Helper for rule-based message analysis
function analyzeMessageRuleBased(text: string, lang: 'ne' | 'en') {
  const isNe = lang === 'ne';
  const t = text.toLowerCase();
  const warningSigns: string[] = [];
  const tricks: string[] = [];
  let score = 10;

  // 1. Credentials / OTP / PIN
  if (/\botp\b|one[- ]?time password|verification code|password|passcode|\bpin\b|पासवर्ड|ओटिपी|पिन नम्बर|कोड दिनुहोस्/.test(t)) {
    warningSigns.push(
      isNe
        ? 'सन्देशमा OTP, गोप्य पासवर्ड वा पिन नम्बर मागिएको छ (कुनै पनि बैंक वा संस्थाले कहिल्यै OTP माग्दैन)।'
        : 'The message requests an OTP, password, or PIN (legitimate institutions NEVER ask for this).'
    );
    tricks.push(isNe ? 'गोप्य विवरण चोरी (Credential Harvesting)' : 'Credential Harvesting');
    score += 35;
  }

  // 2. Urgency & Pressure
  if (/urgent|immediately|within \d+ (minutes|hours)|act now|last chance|account suspended|blocked today|तुरुन्त|अहिले नै|तत्काल|२४ घण्टाभित्र|खाता बन्द/.test(t)) {
    warningSigns.push(
      isNe
        ? 'अत्यधिक हतार र दबाबयुक्त भाषा प्रयोग गरिएको छ, जसले सोच्ने मौका नदिई निर्णय गराउन खोज्छ।'
        : 'High-urgency language creating false panic to force hasty decisions.'
    );
    tricks.push(isNe ? 'कृत्रिम हतार र त्रास (Artificial Urgency & Fear)' : 'Urgency & Fear Tactics');
    score += 25;
  }

  // 3. Prizes / Lottery / Unrealistic Rewards
  if (/won|winner|lottery|prize|reward|gift voucher|unclaimed fund|congratulations|रु\.\s*[\d,]+|चिठ्ठा|पुरस्कार|बधाई छ|उपहार|५०,०००|लाख/.test(t)) {
    warningSigns.push(
      isNe
        ? 'नचिताएको ठूलो रकम वा उपहार जितेको दाबी गरिएको छ (क्लासिक चिट्ठा ठगीको संकेत)।'
        : 'Claims of unexpected lottery, prize, or high cash rewards (classic prize advance scam).'
    );
    tricks.push(isNe ? 'लोभ र पुरस्कारको प्रलोभन (Greed & Temptation)' : 'Temptation & Greed Appeal');
    score += 25;
  }

  // 4. Money transfer / Advance fees
  if (/send money|processing fee|clearance fee|delivery charge|deposit first|wire transfer|advance payment|esewa|khalti|बैंकमा रकम|पैसा पठाउनुहोस्|शुल्क तिर्नुहोस्/.test(t)) {
    warningSigns.push(
      isNe
        ? 'काम, उपहार वा पार्सल पाउन पहिले अग्रिम शुल्क वा रकम पठाउन भनिएको छ।'
        : 'Requests upfront money, fee, or transfer to release funds or delivery.'
    );
    tricks.push(isNe ? 'अग्रिम शुल्क ठगी (Advance Fee)' : 'Advance Fee Demands');
    score += 30;
  }

  // 5. Threatening / Legal Action / Police Impersonation
  if (/arrested|police warrant|court summons|legal action|fbi|cyber bureau|carvahi|कारबाही|पक्राउ|मुद्दा दायर/.test(t)) {
    warningSigns.push(
      isNe
        ? 'प्रहरी, अदालत वा कानुनी कारबाहीको धम्की दिएर तर्साउन खोजिएको छ।'
        : 'Impersonates police, court, or enforcement agencies with legal threats.'
    );
    tricks.push(isNe ? 'अधिकारको दुरुपयोग र धम्की (Authority Intimidation)' : 'Authority & Intimidation');
    score += 30;
  }

  // 6. Suspicious Job / Foreign Employment / Work From Home
  if (/work from home|telegram task|daily income|part time job|like videos|qatar visa|free visa|घर बसी बसी|दैनिक कमाइ|भिडियो लाइक गर्ने काम/.test(t)) {
    warningSigns.push(
      isNe
        ? 'घरमै बसेर सजिलै धेरै कमाइ हुने नक्कली काम वा शंकास्पद भिसा अफरको संकेत छ।'
        : 'Suspicious task scam or unrealistic work-from-home/visa employment offer.'
    );
    tricks.push(isNe ? 'नक्कली जागिरको प्रलोभन (Fake Employment Bait)' : 'Employment Bait');
    score += 20;
  }

  score = Math.min(100, score);
  let riskLevel = 'LOW_RISK';
  if (score >= 60 || warningSigns.length >= 2) {
    riskLevel = 'HIGH_RISK';
  } else if (score >= 30 || warningSigns.length === 1) {
    riskLevel = 'CAUTION';
  }

  return {
    riskLevel,
    score,
    scamType:
      riskLevel === 'HIGH_RISK'
        ? isNe
          ? 'उच्च जोखिमयुक्त शंकास्पद सन्देश'
          : 'High-Risk Potential Scam'
        : riskLevel === 'CAUTION'
        ? isNe
          ? 'सावधानी अपनाउनुपर्ने सन्देश'
          : 'Suspicious / Cautionary Message'
        : isNe
          ? 'सामान्य सन्देश (कुनै स्पष्ट ठगी संकेत देखिएन)'
          : 'Standard Message (No obvious scam signs)',
    summary:
      riskLevel === 'HIGH_RISK'
        ? isNe
          ? 'यो सन्देशमा ठगीसँग मिल्दाजुल्दा बलिया संकेतहरू फेला परेका छन्। यसलाई कुनै पनि हालतमा विश्वास नगर्नुहोस्।'
          : 'Multiple strong fraud indicators detected. Do not reply, click links, or send funds.'
        : riskLevel === 'CAUTION'
        ? isNe
          ? 'केही शंकास्पद ढाँचाहरू देखिएका छन्। कुनै पनि व्यक्तिगत विवरण दिनुअघि आधिकारिक माध्यमबाट जाँच गर्नुहोस्।'
          : 'Some warning patterns found. Verify independently via official channels before proceeding.'
        : isNe
          ? 'यस सन्देशमा हाम्रो नियममा आधारित जाँचमा स्पष्ट ठगीका संकेत भेटिएनन्। तर सधैँ सतर्क रहनुहोस्।'
          : 'No standard scam patterns were triggered. Always remain cautious with unknown senders.',
    warningSigns:
      warningSigns.length > 0
        ? warningSigns
        : [
            isNe
              ? 'साधारण नियम परीक्षणमा कुनै ठगी शब्द फेला परेन।'
              : 'No obvious red flag keywords detected in basic screening.',
          ],
    psychologicalTricks: tricks,
    actionSteps: [
      isNe
        ? 'सन्देशमा आएको कुनै पनि लिंक नखोल्नुहोस्।'
        : 'Do not open any link or attachment included.',
      isNe
        ? 'OTP, बैंक पिन वा पासवर्ड कसैसँग साझा नगर्नुहोस्।'
        : 'Never share OTPs, bank credentials, or passwords.',
      isNe
        ? 'यदि बैंक वा संस्थाको नाम आएको छ भने बैंकको आधिकारिक फोन नम्बरमा फोन गरेर बुझ्नुहोस्।'
        : 'Verify directly using official customer care numbers.',
      isNe
        ? 'शंकास्पद नम्बरलाई तत्काल Block र Report गर्नुहोस्।'
        : 'Block the sender and report as spam.',
    ],
    disclaimer: isNe
      ? 'यो नतिजा सुरक्षा नियम र विश्लेषणमा आधारित मार्गदर्शन मात्र हो। १००% ग्यारेन्टी हुँदैन। वित्तीय निर्णय गर्नुअघि आधिकारिक संस्थासँग पुष्टि गर्नुहोस्।'
      : 'This assessment is guidance based on automated analysis and not an absolute legal verdict. Verify via official authorities.',
  };
}

// Helper for link inspection
function inspectUrlPatterns(rawUrl: string, lang: 'ne' | 'en') {
  const isNe = lang === 'ne';
  let parsedUrl: URL;
  const findings: string[] = [];
  const recommendations: string[] = [];
  let score = 15;

  let formatted = rawUrl.trim();
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = 'https://' + formatted;
  }

  try {
    parsedUrl = new URL(formatted);
  } catch {
    return {
      riskLevel: 'CAUTION',
      score: 50,
      summary: isNe ? 'अमान्य वा गलत URL ढाँचा' : 'Malformed or Invalid URL Format',
      findings: [
        isNe
          ? 'वेबसाइटको लिंक संरचना सही छैन वा हिज्जे बिग्रिएको छ।'
          : 'The URL format has missing or invalid characters.',
      ],
      recommendations: [
        isNe ? 'लिंक पुन: जाँच गर्नुहोस्।' : 'Double-check the entered link.',
      ],
      protocol: 'unknown',
      hostname: rawUrl,
    };
  }

  const host = parsedUrl.hostname.toLowerCase();
  const protocol = parsedUrl.protocol;
  const pathname = parsedUrl.pathname.toLowerCase();

  // Protocol check
  if (protocol === 'http:') {
    findings.push(
      isNe
        ? 'यो वेबसाइट HTTP मा आधारित छ (असुरक्षित, यसमा डाटा इन्क्रिप्ट हुँदैन)।'
        : 'Insecure HTTP connection (traffic is unencrypted and vulnerable to interception).'
    );
    score += 20;
  }

  // IP address hostname
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    findings.push(
      isNe
        ? 'लिंकमा डोमेन नामको सट्टा सिधै IP ठेगाना प्रयोग गरिएको छ (फिसिङको उच्च संकेत)।'
        : 'The link uses a raw IP address instead of a domain name (common phishing indicator).'
    );
    score += 40;
  }

  // Homograph / Punycode
  if (host.startsWith('xn--') || host.includes('.xn--')) {
    findings.push(
      isNe
        ? 'लिंकमा Punycode (अन्तर्राष्ट्रिय क्यारेक्टर) प्रयोग भएको छ, जसले नक्कली नामलाई वास्तविक देखाउन सक्छ।'
        : 'Punycode / IDN spoofing detected (often used to disguise look-alike domain names).'
    );
    score += 35;
  }

  // Sensitive keyword camouflage
  const deceptiveKeywords = [
    'login',
    'verify',
    'wallet',
    'esewa',
    'khalti',
    'nabil',
    'nicasiabank',
    'nepalpolice',
    'claim-bonus',
    'free-gift',
    'reward',
    'security-update',
    'account-confirm',
  ];
  const matchedKeywords = deceptiveKeywords.filter(
    (kw) => host.includes(kw) || pathname.includes(kw)
  );
  if (matchedKeywords.length > 0) {
    findings.push(
      isNe
        ? `लिंकमा संवेदनशील शब्दहरू (${matchedKeywords.join(', ')}) भेटिएका छन्, जुन प्राय: फिसिङमा दुरुपयोग हुन्छन्।`
        : `Deceptive or credential-harvesting keywords found in URL: ${matchedKeywords.join(', ')}`
    );
    score += 25;
  }

  // Subdomain depth
  const parts = host.split('.');
  if (parts.length >= 4) {
    findings.push(
      isNe
        ? 'धेरै सब-डोमेनहरू प्रयोग भएका छन् (जस्तै: bank.secure.login.fake.com), जसले वास्तविक डोमेन लुकाउन खोज्छ।'
        : 'Excessive subdomain nesting detected, often hiding the real registered domain.'
    );
    score += 20;
  }

  // Free/Suspicious TLDs commonly used by scammers
  const suspiciousTlds = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.icu', '.buzz', '.monster'];
  if (suspiciousTlds.some((tld) => host.endsWith(tld))) {
    findings.push(
      isNe
        ? 'यो वेबसाइट प्राय: ठगी र स्प्याममा प्रयोग हुने फ्री/सस्तो डोमेन एक्सटेन्सनमा दर्ता छ।'
        : 'The domain uses an extension frequently associated with disposable scam sites.'
    );
    score += 20;
  }

  score = Math.min(100, score);
  let riskLevel = 'LOW_RISK';
  if (score >= 60 || findings.length >= 2) {
    riskLevel = 'HIGH_RISK';
  } else if (score >= 30 || findings.length === 1) {
    riskLevel = 'CAUTION';
  }

  recommendations.push(
    isNe
      ? 'कुनै पनि अपरिचित लिंकमा पासवर्ड, बैंक कार्ड वा OTP विवरण नराख्नुहोस्।'
      : 'Never enter banking credentials, passwords, or OTPs on unfamiliar websites.'
  );
  recommendations.push(
    isNe
      ? 'डोमेनको हिज्जे आधिकारिक संस्थाको वेबसाइटसँग अक्षरश: दाँज्नुहोस्।'
      : 'Verify the domain name spelling letter-by-letter against the official company website.'
  );

  return {
    riskLevel,
    score,
    protocol,
    hostname: host,
    summary:
      riskLevel === 'HIGH_RISK'
        ? isNe
          ? 'यो लिंक शंकास्पद र असुरक्षित देखिन्छ। यसलाई खोल्दा उपकरण वा डेटा जोखिममा पर्न सक्छ।'
          : 'This link shows strong indicators of phishing or deception. Avoid opening it.'
        : riskLevel === 'CAUTION'
        ? isNe
          ? 'यो लिंक पूर्ण रूपमा सुरक्षित नहुन सक्छ। आधिकारिक स्रोतबाट पुष्टि नगरी नखोल्नुहोस्।'
          : 'Suspicious elements detected. Exercise extreme caution before proceeding.'
        : isNe
          ? 'हाम्रो स्वचालित ढाँचा जाँचमा स्पष्ट खतरा फेला परेन (तर सुरक्षित भएको पूर्ण ग्यारेन्टी छैन)।'
          : 'No overt threat patterns found in structural heuristics. Always maintain vigilance.',
    findings:
      findings.length > 0
        ? findings
        : [
            isNe
              ? 'URL को संरचनामा सामान्य फिसिङ ढाँचाहरू भेटिएनन्।'
              : 'Standard URL phishing patterns were not detected.',
          ],
    recommendations,
  };
}

// Development or production middleware
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Scam Protection AI server running on port ${PORT}`);
  });
}

setupServer();
