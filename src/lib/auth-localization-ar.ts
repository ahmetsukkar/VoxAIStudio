import type { AuthLocalization } from "@daveyplate/better-auth-ui";

export const arLocalization: AuthLocalization = {
  // Name card
  NAME: "الاسم",
  NAME_DESCRIPTION: "الرجاء إدخال اسمك الكامل أو اسم العرض.",
  NAME_INSTRUCTIONS: "الرجاء استخدام 32 حرفًا كحد أقصى.",  // ← was NAME_MAX_LENGTH (wrong)
  NAME_PLACEHOLDER: "الاسم الكامل أو اسم العرض",

  // Change Password card
  CHANGE_PASSWORD: "تغيير كلمة المرور",
  CHANGE_PASSWORD_DESCRIPTION: "أدخل كلمة المرور الحالية وكلمة مرور جديدة.",
  CHANGE_PASSWORD_INSTRUCTIONS: "الرجاء استخدام 8 أحرف على الأقل.",
  CHANGE_PASSWORD_SUCCESS: "تم تغيير كلمة المرور بنجاح.",
  CURRENT_PASSWORD: "كلمة المرور الحالية",
  CURRENT_PASSWORD_PLACEHOLDER: "كلمة المرور الحالية",
  NEW_PASSWORD: "كلمة المرور الجديدة",
  NEW_PASSWORD_PLACEHOLDER: "كلمة المرور الجديدة",
  PASSWORDS_DO_NOT_MATCH: "كلمتا المرور غير متطابقتين",
  PASSWORD_REQUIRED: "كلمة المرور مطلوبة",

  // Sessions card
  SESSIONS: "الجلسات",
  SESSIONS_DESCRIPTION: "إدارة جلساتك النشطة وإلغاء الوصول.",
  CURRENT_SESSION: "الجلسة الحالية",
  REVOKE: "إلغاء",
  SIGN_OUT: "تسجيل الخروج",

  // Common
  SAVE: "حفظ",
  UPDATED_SUCCESSFULLY: "تم التحديث بنجاح",
};