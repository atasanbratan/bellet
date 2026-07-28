import { Prisma, BusinessStatus } from '@prisma/client';

export interface BrowseParams {
  category?: string;
  search?: string;
  province?: string;
  subject?: string;
  page?: number;
  pageSize?: number;
}

const MAX_PAGE_SIZE = 48;
const DEFAULT_PAGE_SIZE = 12;

/** Clamp caller-supplied paging into something safe to hand Prisma. */
export function browsePaging(params: BrowseParams) {
  const page = Math.max(1, Math.floor(Number(params.page) || 1));
  const requested = Math.floor(Number(params.pageSize) || DEFAULT_PAGE_SIZE);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, requested));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

const contains = (search: string) => ({
  contains: search,
  mode: 'insensitive' as const,
});

/** Public browse filter: approved centers, narrowed by the UI's controls. */
export function browseWhere(params: BrowseParams): Prisma.BusinessWhereInput {
  const { category, search, province, subject } = params;
  const and: Prisma.BusinessWhereInput[] = [
    { status: BusinessStatus.APPROVED },
  ];

  if (category) and.push({ category: { slug: category } });
  if (province) and.push({ addresses: { some: { provinceId: province } } });
  // A center matches a subject if any of its courses teaches it.
  if (subject) {
    and.push({ offerings: { some: { subjects: { some: { slug: subject } } } } });
  }
  if (search?.trim()) {
    const q = search.trim();
    and.push({
      OR: [
        { name: contains(q) },
        { description: contains(q) },
        { descriptionTk: contains(q) },
        { descriptionEn: contains(q) },
        { descriptionRu: contains(q) },
        {
          offerings: {
            some: {
              OR: [
                { title: contains(q) },
                { titleTk: contains(q) },
                { titleEn: contains(q) },
                { titleRu: contains(q) },
              ],
            },
          },
        },
      ],
    });
  }

  return { AND: and };
}
