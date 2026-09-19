import type { ProfessionalCategory } from "@/data/professionals"

export type FilterOption = { value: string; label: string }

export const CATEGORY_TABS: { value: ProfessionalCategory; label: string }[] = [
  { value: "mohel", label: "מוהלים" },
  { value: "lactation", label: "יועצות הנקה" },
  { value: "sleep", label: "יועצות שינה" },
  { value: "doula", label: "דולות" },
]

export const CATEGORY_LABELS: Record<ProfessionalCategory, string> = {
  mohel: "מוהלים",
  lactation: "יועצות הנקה",
  sleep: "יועצות שינה",
  doula: "דולות",
}

/* ------------------------------------------------------------------------
   SHARED FILTERS — apply across every category.
   ------------------------------------------------------------------------ */

export const AREA_OPTIONS: FilterOption[] = [
  { value: "tel_aviv", label: "תל אביב" },
  { value: "ramat_gan", label: "רמת גן" },
  { value: "givatayim", label: "גבעתיים" },
  { value: "herzliya", label: "הרצליה" },
  { value: "raanana", label: "רעננה" },
  { value: "kfar_saba", label: "כפר סבא" },
  { value: "petah_tikva", label: "פתח תקווה" },
  { value: "rishon_letzion", label: "ראשון לציון" },
  { value: "holon", label: "חולון" },
  { value: "bat_yam", label: "בת ים" },
  { value: "ramat_hasharon", label: "רמת השרון" },
  { value: "rishon_letzion_area", label: "ראשון לציון והסביבה" },
  { value: "tel_aviv_area", label: "תל אביב והסביבה" },
  { value: "all_areas", label: "כל האזור" },
]

export const DISTANCE_OPTIONS: FilterOption[] = [
  { value: "dist_5", label: 'עד 5 ק"מ' },
  { value: "dist_10", label: 'עד 10 ק"מ' },
  { value: "dist_20", label: 'עד 20 ק"מ' },
  { value: "dist_30", label: 'עד 30 ק"מ' },
  { value: "dist_any", label: "לא משנה" },
]

export const RATING_OPTIONS: FilterOption[] = [
  { value: "rating_45", label: "4.5 ומעלה" },
  { value: "rating_40", label: "4.0 ומעלה" },
  { value: "rated_only", label: "עם דירוגים בלבד" },
  { value: "unrated", label: "ללא דירוג" },
]

export const PRICE_OPTIONS: FilterOption[] = [
  { value: "price_300", label: "עד 300 ₪" },
  { value: "price_300_500", label: "300–500 ₪" },
  { value: "price_500_800", label: "500–800 ₪" },
  { value: "price_800_1200", label: "800–1,200 ₪" },
  { value: "price_1200_plus", label: "מעל 1,200 ₪" },
  { value: "price_any", label: "לא משנה" },
]

export const AVAILABILITY_OPTIONS: FilterOption[] = [
  { value: "coming_soon", label: "זמין/ה בקרוב" },
  { value: "accepting_new", label: "מקבל/ת לקוחות חדשים" },
  { value: "avail_any", label: "לא משנה" },
]

export const SERVICE_MODE_OPTIONS: FilterOption[] = [
  { value: "in_person", label: "פרונטלי" },
  { value: "at_client_home", label: "בבית הלקוחה" },
  { value: "online", label: "אונליין" },
  { value: "in_person_and_online", label: "פרונטלי ואונליין" },
]

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "relevance", label: "רלוונטיות" },
  { value: "rating", label: "דירוג" },
  { value: "reviews", label: "מספר דירוגים" },
  { value: "distance", label: "מרחק" },
  { value: "price", label: "מחיר" },
]

/* ------------------------------------------------------------------------
   CATEGORY-SPECIFIC FILTERS
   Keyed by the field id stored on Professional.attrs. `primary: true`
   marks the one field shown as its own top-level pill in the filter bar —
   the rest live inside "עוד פילטרים".
   ------------------------------------------------------------------------ */

export type CategoryFieldDef = {
  id: string
  label: string
  options: FilterOption[]
  primary?: boolean
}

export const CATEGORY_FIELDS: Record<ProfessionalCategory, CategoryFieldDef[]> = {
  mohel: [
    {
      id: "venue",
      label: "מקום ביצוע",
      primary: true,
      options: [
        { value: "home", label: "בבית" },
        { value: "synagogue", label: "בית כנסת" },
        { value: "hall", label: "אולם" },
        { value: "other_venue", label: "מקום אחר" },
      ],
    },
    {
      id: "type",
      label: "סוג",
      options: [
        { value: "medical_mohel", label: "מוהל רפואי" },
        { value: "mohel", label: "מוהל" },
        { value: "mohel_doctor", label: "מוהל ורופא" },
      ],
    },
    {
      id: "ceremonyStyle",
      label: "סגנון טקס",
      options: [
        { value: "traditional", label: "מסורתי" },
        { value: "family", label: "משפחתי" },
        { value: "short_ceremony", label: "טקס קצר" },
        { value: "full_ceremony", label: "טקס מלא" },
      ],
    },
    {
      id: "mohelAvailability",
      label: "זמינות",
      options: [
        { value: "available_for_brit", label: "זמין לבריתות" },
        { value: "short_notice", label: "מקבל בהתראה קצרה" },
      ],
    },
  ],
  lactation: [
    {
      id: "consultationType",
      label: "סוג ייעוץ",
      primary: true,
      options: [
        { value: "prenatal", label: "לפני הלידה" },
        { value: "postnatal", label: "אחרי הלידה" },
        { value: "at_home", label: "בבית" },
        { value: "online_consult", label: "אונליין" },
        { value: "return_to_work", label: "חזרה לעבודה" },
      ],
    },
    {
      id: "specialty",
      label: "התמחות",
      options: [
        { value: "latch_issues", label: "קשיי חיבור" },
        { value: "breastfeeding_pain", label: "כאבים בהנקה" },
        { value: "pumping", label: "שאיבה" },
        { value: "combo_feeding", label: "שילוב הנקה ובקבוק" },
        { value: "twins", label: "תאומים" },
        { value: "preemies", label: "פגים" },
      ],
    },
    {
      id: "supportType",
      label: "סוג ליווי",
      options: [
        { value: "one_time", label: "פגישה חד-פעמית" },
        { value: "ongoing_process", label: "תהליך ליווי" },
        { value: "home_visit", label: "ביקור בבית" },
        { value: "online_support", label: "ליווי אונליין" },
      ],
    },
    {
      id: "lactationAvailability",
      label: "זמינות",
      options: [
        { value: "soon_available", label: "זמינה בקרוב" },
        { value: "home_visit", label: "ביקור בבית" },
        { value: "online", label: "אונליין" },
      ],
    },
  ],
  sleep: [
    {
      id: "babyAge",
      label: "גיל התינוק",
      primary: true,
      options: [
        { value: "newborn", label: "ניו-בורן" },
        { value: "age_0_3", label: "0–3 חודשים" },
        { value: "age_3_6", label: "3–6 חודשים" },
        { value: "age_6_12", label: "6–12 חודשים" },
        { value: "age_12_plus", label: "שנה ומעלה" },
      ],
    },
    {
      id: "supportType",
      label: "סוג ליווי",
      options: [
        { value: "one_time", label: "פגישה חד-פעמית" },
        { value: "full_process", label: "תהליך מלא" },
        { value: "remote", label: "ליווי מרחוק" },
        { value: "home_visit", label: "ביקור בבית" },
      ],
    },
    {
      id: "specialty",
      label: "התמחות",
      options: [
        { value: "falling_asleep", label: "הירדמות" },
        { value: "night_wakings", label: "יקיצות בלילה" },
        { value: "naps", label: "תנומות" },
        { value: "transition_to_bed", label: "מעבר למיטה" },
        { value: "night_weaning", label: "גמילה מהאכלה בלילה" },
      ],
    },
    // "שיטת ייעוץ" — only shown when at least one professional in this
    // category actually has methodology data (see ProfessionalFilters.tsx).
    // No option is framed as better than another, by design.
    {
      id: "method",
      label: "שיטת ייעוץ",
      options: [
        { value: "gentle_method", label: "שיטה מתונה" },
        { value: "structured_method", label: "שיטה מובנית" },
        { value: "no_cry_method", label: "שיטה ללא בכי" },
      ],
    },
  ],
  doula: [
    {
      id: "supportType",
      label: "סוג ליווי",
      primary: true,
      options: [
        { value: "pregnancy_support", label: "ליווי בהריון" },
        { value: "birth_prep", label: "הכנה ללידה" },
        { value: "birth_support", label: "ליווי בלידה" },
        { value: "postpartum_support", label: "ליווי לאחר לידה" },
      ],
    },
    {
      id: "birthType",
      label: "סוג לידה",
      options: [
        { value: "first_birth", label: "לידה ראשונה" },
        { value: "repeat_birth", label: "לידה חוזרת" },
        { value: "natural_birth", label: "לידה טבעית" },
        { value: "epidural", label: "אפידורל" },
        { value: "planned_cesarean", label: "קיסרי מתוכנן" },
        { value: "vbac", label: "VBAC" },
      ],
    },
    {
      id: "birthPlace",
      label: "מקום לידה",
      options: [
        { value: "hospital", label: "בית חולים" },
        { value: "home_birth", label: "בית" },
        { value: "birth_center", label: "מרכז לידה" },
      ],
    },
    {
      id: "additionalServices",
      label: "שירותים נוספים",
      options: [
        { value: "birth_prep_service", label: "הכנה ללידה" },
        { value: "massage", label: "עיסוי" },
        { value: "reflexology", label: "רפלקסולוגיה" },
        { value: "postpartum_support", label: "תמיכה לאחר לידה" },
      ],
    },
    {
      id: "doulaAvailability",
      label: "זמינות",
      options: [
        { value: "available_247", label: "זמינה 24/7" },
        { value: "on_call", label: "כוננות" },
        { value: "limited_availability", label: "זמינות מוגבלת" },
      ],
    },
  ],
}
