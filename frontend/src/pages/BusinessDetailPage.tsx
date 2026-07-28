import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { useI18n } from '../i18n/LocaleContext';
import { locText } from '../lib/i18nContent';
import { type BusinessDetail } from '../types';
import { Cover } from '../components/visuals';
import CourseRow from '../features/business/CourseRow';
import LocationsPanel from '../features/business/LocationsPanel';
import TeachersSidebar from '../features/business/TeachersSidebar';
import SaveButton from '../components/SaveButton';
import ShareButton from '../components/ShareButton';

export default function BusinessDetailPage() {
  const { id } = useParams();
  const { t, locale } = useI18n();
  const [biz, setBiz] = useState<BusinessDetail | null>(null);
  const [openCourse, setOpenCourse] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/businesses/${id}`).then((r) => setBiz(r.data));
  }, [id]);

  if (!biz)
    return <div className="h-64 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800" />;

  return (
    <div>
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
      >
        {t('detail.back')}
      </Link>

      {/* Cover banner */}
      <div className="relative overflow-hidden rounded-lg">
        <Cover
          name={biz.name}
          coverKey={biz.id}
          src={biz.photos[0]}
          className="aspect-[16/9] w-full sm:aspect-[3/1]"
          monogramClass="text-5xl"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        {/* Title left, actions bottom-right — they stack on narrow screens. */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow sm:text-3xl">
            {biz.name}
          </h1>
          <div className="flex flex-shrink-0 gap-2">
            <ShareButton title={biz.name} variant="overlay" />
            <SaveButton businessId={biz.id} variant="overlay" />
          </div>
        </div>
      </div>

      {biz.photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {biz.photos.slice(1).map((p) => (
            <img
              key={p}
              src={p}
              alt=""
              className="h-20 w-32 flex-shrink-0 rounded object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Left: about, locations, teachers */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          {locText(biz, 'description', locale) && (
            <section className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h2 className="mb-2 font-bold">{t('detail.about')}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {locText(biz, 'description', locale)}
              </p>
            </section>
          )}
          <LocationsPanel addresses={biz.addresses ?? []} />
          <TeachersSidebar teachers={biz.teachers} />
        </div>

        {/* Right: courses with expandable group schedules */}
        <div className="lg:col-span-8">
          <h2 className="mb-3 text-lg font-bold">{t('detail.courses')}</h2>
          {biz.offerings.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-10 text-center text-slate-400">
              {t('detail.no_courses')}
            </p>
          ) : (
            <div className="space-y-3">
              {biz.offerings.map((o) => (
                <CourseRow
                  key={o.id}
                  offering={o}
                  open={openCourse === o.id}
                  onToggle={() => setOpenCourse(openCourse === o.id ? null : o.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
