/** What a center offers: its locations, staff, courses and their groups. */

export type TimeOfDay = 'MORNING' | 'AFTERNOON' | 'EVENING';
export type BusinessStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

/** What a course teaches. A course can carry several; a centre's set is the
 *  union across its courses. `icon` is a Material Symbols name. */
export interface Subject {
  id: string;
  slug: string;
  nameTk: string;
  nameEn: string;
  nameRu: string;
  icon?: string | null;
  /** Approved centres teaching it — only present on the /subjects list. */
  businessCount?: number;
}

export interface Province {
  id: string;
  slug: string;
  nameTk: string;
  nameEn: string;
  nameRu: string;
  /** Approved centres with a building here — only on the /provinces list. */
  businessCount?: number;
}

export interface Address {
  id: string;
  businessId?: string;
  provinceId: string;
  province?: Province;
  line: string;
}

/** Per-language content variants; the base field is the fallback. */
export interface I18nText {
  descriptionTk?: string | null;
  descriptionEn?: string | null;
  descriptionRu?: string | null;
  titleTk?: string | null;
  titleEn?: string | null;
  titleRu?: string | null;
}

export interface Business extends I18nText {
  id: string;
  name: string;
  description?: string | null;
  addresses?: Address[];
  photos: string[];
  status?: BusinessStatus;
  category?: Category;
  /** Union of the subjects its courses teach (browse list only). */
  subjects?: Subject[];
  owner?: { id: string; name?: string | null; phone: string };
  _count?: { offerings: number };
}

export interface Teacher {
  id: string;
  name: string;
  bio?: string | null;
  photo?: string | null;
}

export interface Group {
  id: string;
  offeringId?: string;
  teacherId?: string | null;
  teacher?: Teacher | null;
  addressId?: string | null;
  address?: Address | null;
  days: number[];
  timeOfDay: TimeOfDay;
  startTime: string;
  endTime: string;
  capacity: number;
  /** First class date (ISO). */
  startDate?: string | null;
  /** Course length in weeks. */
  durationWeeks?: number | null;
  /** Enrollment window (kabul edilişik), ISO dates. */
  enrollFrom?: string | null;
  enrollUntil?: string | null;
  /** Active (non-cancelled) bookings — seats already taken. */
  _count?: { bookings: number };
}

export interface Offering extends I18nText {
  id: string;
  title: string;
  description?: string | null;
  price: string;
  prepaymentAmount: string;
  businessId?: string;
  subjects?: Subject[];
  groups?: Group[];
}

export interface BusinessDetail extends Business {
  offerings: Offering[];
  teachers: Teacher[];
}
