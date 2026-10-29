import {
  ShoppingScamInput,
  ShoppingAnalysisResult,
  DetailedAnalysisData,
  RiskFactor,
  SuspiciousEntity,
  RiskLevel,
} from '../types';

export function analyzeShoppingScamClient(
  input: ShoppingScamInput,
  lang: 'ne' | 'en'
): ShoppingAnalysisResult {
  const isNe = lang === 'ne';

  const marketPrice = Number(input.marketPrice) || 0;
  const advertisedPrice = Number(input.advertisedPrice) || 0;
  const advancePayment = Number(input.advancePayment) || 0;

  let discountPercent = 0;
  if (marketPrice > 0 && advertisedPrice > 0 && marketPrice > advertisedPrice) {
    discountPercent = Math.round(((marketPrice - advertisedPrice) / marketPrice) * 100);
  }

  let advanceRatio = 0;
  if (advertisedPrice > 0 && advancePayment > 0) {
    advanceRatio = Math.round((advancePayment / advertisedPrice) * 100);
  }

  const warningSigns: string[] = [];
  const safeAlternatives: string[] = [];
  const entities: SuspiciousEntity[] = [];
  const riskFactors: RiskFactor[] = [];
  let score = 15;

  // 1. Extreme Price Discount Check
  if (marketPrice > 0 && advertisedPrice > 0) {
    entities.push({
      type: 'Pricing Analysis',
      value: `बजार: रु. ${marketPrice.toLocaleString()} ➔ अफर: रु. ${advertisedPrice.toLocaleString()} (-${discountPercent}%)`,
      risk: discountPercent >= 55 ? 'HIGH' : discountPercent >= 35 ? 'MEDIUM' : 'LOW',
      explanationNe: `बजार मूल्यभन्दा ${discountPercent}% सस्तो देखाइएको छ।`,
      explanationEn: `Offered at ${discountPercent}% discount below prevailing market rate.`,
    });

    if (discountPercent >= 55) {
      warningSigns.push(
        isNe
          ? `बजार मूल्यभन्दा अत्यधिक सस्तो (${discountPercent}% छुट)। महँगा सामानहरू (जस्तै मोबाइल, ल्यापटप वा ब्रान्डेड सामान) यति कम मूल्यमा दिनु प्राय: ठगीको प्रमुख प्रलोभन हो।`
          : `Unusually steep discount (${discountPercent}% off market price). Electronics and branded goods at fraction prices are classic advance-fee baits.`
      );
      score += 35;
    } else if (discountPercent >= 35) {
      warningSigns.push(
        isNe
          ? `बजार मूल्यभन्दा उल्लेखनीय छुट (${discountPercent}%)। सामान्य भन्दा बढी सस्तो भएकाले आधिकारिक वारेन्टी र सक्कली सामान भएको पुष्टि गर्नुहोस्।`
          : `Significant discount (${discountPercent}%). Verify warranty coverage and authentic serials.`
      );
      score += 15;
    }
  }

  // 2. Advance Payment Demand Check
  const paymentMethod = input.paymentMethod || '';
  const isPersonalWallet =
    /personal|व्यक्तिगत|esewa|khalti|वालेट/i.test(paymentMethod) ||
    /qr|क्यूआर/i.test(paymentMethod);
  const isCashOnDelivery = /cod|cash on delivery|सामान आएपछि/i.test(paymentMethod);

  if (advancePayment > 0) {
    entities.push({
      type: 'Advance Payment',
      value: `रु. ${advancePayment.toLocaleString()} (${advanceRatio}% of price)`,
      risk: advanceRatio >= 40 || isPersonalWallet ? 'HIGH' : 'MEDIUM',
      explanationNe: 'सामान डेलिभरी हुनुअगावै मागिएको अग्रिम रकम',
      explanationEn: 'Upfront monetary deposit demanded prior to physical dispatch',
    });

    if (advanceRatio >= 80) {
      warningSigns.push(
        isNe
          ? `सामान पठाउनुअघि लगभग पूरै रकम (${advanceRatio}%) अग्रिम मागिएको छ। अनलाइन सामाजिक सञ्जालमा यस्तो अवस्थामा पैसा पाएपछि विक्रेता हराउने जोखिम उच्च रहन्छ।`
          : `Full or near-full advance payment (${advanceRatio}%) demanded upfront. High risk of seller going non-responsive after receiving money.`
      );
      score += 35;
    } else if (advanceRatio >= 30) {
      warningSigns.push(
        isNe
          ? `सामान पठाउनुअघि उल्लेख्य अग्रिम रकम (${advanceRatio}%) मागिएको छ।`
          : `Substantial advance deposit (${advanceRatio}%) requested before shipment.`
      );
      score += 25;
    } else {
      warningSigns.push(
        isNe
          ? `डेलिभरी शुल्क वा सानो रकम अग्रिम मागिएको छ।`
          : `Advance delivery charge requested upfront.`
      );
      score += 10;
    }
  }

  if (isPersonalWallet) {
    warningSigns.push(
      isNe
        ? 'रकम आधिकारिक कम्पनीको खातामा नभई कुनै व्यक्तिको व्यक्तिगत डिजिटल वालेट वा बैंक खातामा माग्ने गरिएको छ।'
        : 'Payment directed to a private personal digital wallet/QR rather than an authorized merchant account.'
    );
    score += 20;
  }

  // 3. Comments Disabled on Social Media Ads
  if (input.commentsDisabled) {
    warningSigns.push(
      isNe
        ? 'विज्ञापनमा कमेन्ट बक्स बन्द (Disabled) गरिएको छ। ठगहरूले पहिले ठगिएका ग्राहकहरूले पोल नखोलून् भनेर अक्सर कमेन्ट बन्द गर्छन्।'
        : 'Comment section disabled on social media ad. Fraudulent sellers routinely suppress comments to block scam warnings from past victims.'
    );
    score += 25;
  }

  // 4. Physical Store & Registered Presence
  if (!input.hasPhysicalStore) {
    warningSigns.push(
      isNe
        ? 'पसलको कुनै पनि भौतिक ठेगाना (Physical Store) वा दर्ता विवरण उल्लेख छैन।'
        : 'No verifiable physical store address or legal business registration provided.'
    );
    score += 10;
  }

  // 5. Return & Refund Policy
  if (!input.hasReturnPolicy) {
    warningSigns.push(
      isNe
        ? 'सामान बिग्रिएको खण्डमा फिर्ता वा साट्ने (Return/Refund) नीति छैन वा अस्वीकार गरिएको छ।'
        : 'No clear return, replacement, or refund policy available.'
    );
    score += 10;
  }

  // 6. Description Text Evaluation
  const adText = (input.adDescription + ' ' + input.screenshotNotes).toLowerCase();
  if (/only \d+ left|clearance today|तुरुन्त अर्डर|सीमित स्टक|धमाका अफर|आज मात्रै|last day/.test(adText)) {
    warningSigns.push(
      isNe
        ? 'विज्ञापनमा "आज मात्र", "सीमित सिट/स्टक" भन्दै कृत्रिम हतार गराइएको छ।'
        : 'Artificial urgency phrases ("Only 2 left", "Flash clearance today only") used to rush purchase decisions.'
    );
    score += 15;
  }

  score = Math.min(100, score);
  let riskLevel: RiskLevel = 'LOW_RISK';
  if (score >= 60 || (discountPercent >= 50 && advancePayment > 0)) {
    riskLevel = 'HIGH_RISK';
  } else if (score >= 30 || advancePayment > 0 || discountPercent >= 35) {
    riskLevel = 'CAUTION';
  }

  // Safe alternatives / Recommendations
  safeAlternatives.push(
    isNe
      ? 'सधैँ Cash on Delivery (COD) अर्थात् सामान हातमा पाएर राम्ररी जाँच गरेपछि मात्र पैसा भुक्तानी गर्ने विकल्प रोज्नुहोस्।'
      : 'Always insist on Cash on Delivery (COD) and inspect the package physically before handing over cash.'
  );
  safeAlternatives.push(
    isNe
      ? 'सामान किन्नुअघि विक्रेताको PAN/VAT दर्ता नम्बर, फोन नम्बर र गुगल म्यापमा पसलको स्थान खोजेर पुष्टि गर्नुहोस्।'
      : 'Verify the merchant’s registered business PAN/VAT, direct landline, and Google Maps physical location.'
  );
  safeAlternatives.push(
    isNe
      ? 'सामाजिक सञ्जालको प्रोफाइल कति पुरानो हो र विगतका समीक्षा (Customer Reviews) वास्तविक हुन् कि नक्कली जाँच्नुहोस्।'
      : 'Check page transparency history to see when the Facebook/Instagram account was created and if previous customer reviews are authentic.'
  );
  if (isPersonalWallet) {
    safeAlternatives.push(
      isNe
        ? 'कुनै पनि अपरिचित व्यक्तिको व्यक्तिगत eSewa वा Khalti मा अग्रिम पैसा कहिल्यै नपठाउनुहोस्।'
        : 'Never transfer advance money to private personal wallets without escrow protection.'
    );
  }

  // Risk Factors Matrix
  riskFactors.push({
    id: 'price_disparity',
    nameNe: 'अस्वाभाविक मूल्य र छुट (Price Disparity)',
    nameEn: 'Price Realism & Discount Magnitude',
    severity: discountPercent >= 50 ? 'HIGH' : discountPercent >= 30 ? 'MEDIUM' : 'SAFE',
    status: discountPercent >= 50 ? 'FLAGGED' : discountPercent >= 30 ? 'WARNING' : 'CLEAR',
    statusNe: discountPercent >= 50 ? `उच्च जोखिम (${discountPercent}% छुट)` : discountPercent >= 30 ? `सावधानी (${discountPercent}% छुट)` : 'सामान्य बजार मूल्य',
    statusEn: discountPercent >= 50 ? `Flagged (${discountPercent}% Off)` : discountPercent >= 30 ? `Warning (${discountPercent}% Off)` : 'Realistic Retail Price',
    detailNe: discountPercent >= 50
      ? 'बजार मूल्यभन्दा आधा वा त्योभन्दा बढी सस्तो हुनु ठगीको प्राथमिक प्रलोभन (Bait) हो।'
      : 'मूल्य सामान्य बजार सीमाभित्रै वा मध्यम छुटमा देखिन्छ।',
    detailEn: discountPercent >= 50
      ? 'Steep discount exceeding 50% on popular goods is a primary indicator of advance-fee bait.'
      : 'Pricing conforms within realistic promotional or retail boundaries.',
  });

  riskFactors.push({
    id: 'advance_payment',
    nameNe: 'अग्रिम भुक्तानी जोखिम (Advance Deposit Risk)',
    nameEn: 'Advance Payment & Deposit Risk',
    severity: advanceRatio >= 40 || isPersonalWallet ? 'HIGH' : advancePayment > 0 ? 'MEDIUM' : 'SAFE',
    status: advanceRatio >= 40 || isPersonalWallet ? 'FLAGGED' : advancePayment > 0 ? 'WARNING' : 'CLEAR',
    statusNe: advanceRatio >= 40 ? `उच्च जोखिम (${advanceRatio}% अग्रिम माग)` : advancePayment > 0 ? 'सावधानी: अग्रिम रकम माग' : 'सुरक्षित: अग्रिम रकम मागिएको छैन',
    statusEn: advanceRatio >= 40 ? `Flagged (${advanceRatio}% Advance)` : advancePayment > 0 ? 'Warning: Advance Required' : 'Safe: Cash on Delivery Supported',
    detailNe: advancePayment > 0
      ? `सामान डेलिभरी हुनुअघि रु. ${advancePayment.toLocaleString()} माग गरिएको छ। पैसा पठाएपछि सामान नआउने र विक्रेता सम्पर्कविहीन हुने उच्च जोखिम हुन्छ।`
      : 'सामान पाउनुअघि कुनै अग्रिम रकम मागिएको छैन।',
    detailEn: advancePayment > 0
      ? `Upfront deposit of Rs. ${advancePayment.toLocaleString()} requested before dispatch without consumer buyer protection.`
      : 'No advance deposit solicited prior to parcel delivery.',
  });

  riskFactors.push({
    id: 'seller_transparency',
    nameNe: 'विक्रेता पारदर्शिता र विश्वसनीयता (Seller Transparency)',
    nameEn: 'Seller Transparency & Physical Footprint',
    severity: input.commentsDisabled || !input.hasPhysicalStore ? 'HIGH' : 'SAFE',
    status: input.commentsDisabled || !input.hasPhysicalStore ? 'FLAGGED' : 'CLEAR',
    statusNe: input.commentsDisabled ? 'उच्च जोखिम: कमेन्ट बन्द गरिएको' : !input.hasPhysicalStore ? 'सावधानी: भौतिक ठेगाना छैन' : 'पारदर्शी: भौतिक पसल उपलब्ध',
    statusEn: input.commentsDisabled ? 'Flagged: Comments Disabled' : !input.hasPhysicalStore ? 'Warning: No Physical Address' : 'Clear: Verifiable Storefront',
    detailNe: input.commentsDisabled
      ? 'कमेन्ट बक्स बन्द गरिएकाले अन्य ग्राहकका वास्तविक प्रतिक्रिया हेर्न असम्भव बनाइएको छ।'
      : input.hasPhysicalStore
      ? 'विक्रेताको भौतिक पसल वा दर्ता भएको ठेगाना रहेको दाबी गरिएको छ।'
      : 'कुनै भौतिक ठेगाना छैन, केवल अनलाइन प्रोफाइल मात्र भरपर्दो आधार मान्न सकिँदैन।',
    detailEn: input.commentsDisabled
      ? 'Public comments are turned off on social media ads, preventing buyers from reading scam complaints.'
      : input.hasPhysicalStore
      ? 'Physical presence reported by seller.'
      : 'No verifiable physical store address available.',
  });

  const confidenceScore =
    riskLevel === 'HIGH_RISK'
      ? Math.min(96, 85 + (warningSigns.length * 2))
      : riskLevel === 'CAUTION'
      ? 84
      : 90;

  return {
    riskLevel,
    score,
    discountPercent,
    advanceRatio,
    summary:
      riskLevel === 'HIGH_RISK'
        ? isNe
          ? `यो अफरमा अनलाइन किनमेल ठगीसँग मिल्ने बलिया संकेतहरू छन्। बजारभन्दा अत्यधिक सस्तो मूल्य देखाई अग्रिम रकम माग्नु क्लासिक ठगी शैली हो। सामान हातमा नपरी पैसा नपठाउनुहोस्।`
          : `High fraud probability detected. Steep discounts paired with advance payment demands over unverified social channels are signature patterns of marketplace scams.`
        : riskLevel === 'CAUTION'
        ? isNe
          ? `यस विज्ञापनमा केही शंकास्पद पक्षहरू देखिएका छन्। अग्रिम रकम पठाउनुअघि विक्रेताको भौतिक पसल र ग्राहक समीक्षाहरू राम्ररी जाँच्नुहोस्।`
          : `Cautionary signals detected. Independently verify the merchant and avoid transferring full payments to unverified personal accounts.`
        : isNe
          ? `यो अफरमा सामान्य अनलाइन किनमेलका मापदण्डहरू देखिएका छन्। तापनि सामान प्राप्त गरी जाँचेर मात्र रकम भुक्तानी गर्नु सुरक्षित हुन्छ।`
          : `Parameters appear consistent with standard retail offers. Prefer Cash on Delivery where feasible.`,
    priceAssessment:
      discountPercent >= 50
        ? isNe
          ? `असाधारण रूपमा सस्तो (-${discountPercent}%) — सतर्क रहनुहोस्`
          : `Unrealistically low (-${discountPercent}%) — High bait indicator`
        : isNe
          ? `सामान्य वा मध्यम छुट (-${discountPercent}%)`
          : `Plausible commercial price (-${discountPercent}%)`,
    advancePaymentAssessment:
      advancePayment > 0
        ? isNe
          ? `सामान पाउनुअघि रु. ${advancePayment.toLocaleString()} माग गरिएको छ`
          : `Advance payment of Rs. ${advancePayment.toLocaleString()} demanded`
        : isNe
          ? `कुनै अग्रिम रकम मागिएको छैन (सुरक्षित)`
          : `No upfront advance payment demanded (Safer)`,
    sellerAssessment:
      input.commentsDisabled
        ? isNe
          ? `अत्यन्त अपारदर्शी (कमेन्ट बन्द)`
          : `Opaque (Comments turned off)`
        : input.hasPhysicalStore
        ? isNe
          ? `भौतिक पसल रहेको उल्लेख`
          : `Physical store footprint claimed`
        : isNe
          ? `केवल भर्चुअल प्रोफाइल (भौतिक ठेगाना छैन)`
          : `Virtual social profile only`,
    warningSigns,
    safeAlternatives,
    disclaimer: isNe
      ? `यो विश्लेषण प्रयोगकर्ताले दिएको विवरणमा आधारित सुरक्षा मार्गदर्शन हो। यसले विक्रेतालाई बिना कानुनी प्रमाण अपराधी घोषणा गर्दैन, तर तपाईंको रकम जोखिममा पर्न सक्ने सम्भावना औँल्याउँछ।`
      : `This evaluation is consumer safety guidance based on input signals. It does not constitute a legal fraud verdict but flags elevated transaction risks.`,
    detailedAnalysis: {
      confidenceScore,
      confidenceLabelNe: `${confidenceScore}% उच्च निश्चितता (किनमेल सुरक्षा इन्टेलिजेन्स)`,
      confidenceLabelEn: `${confidenceScore}% High Confidence (Marketplace Consumer Risk Model)`,
      suspiciousEntities: entities,
      riskFactors,
    },
  };
}
