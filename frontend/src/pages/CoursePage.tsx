import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import { useI18n } from '../i18n/LocaleContext';
import { locText } from '../lib/i18nContent';
import { money } from '../lib/format';
import { Cover } from '../components/visuals';
import type { Business, Offering } from '../types';
import GroupList from '../features/course/GroupList';
import BookingPanel from '../features/course/BookingPanel';
import { useBookingFlow } from '../features/course/useBookingFlow';

type CourseDetail = Offering & { business?: Business };

export default function CoursePage() {
  const { id } = useParams();
  const { t, locale } = useI18n();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const flow = useBookingFlow(id);

  useEffect(() => {
    api.get(`/offerings/${id}`).then((r) => setCourse(r.data));
  }, [id]);

  if (!course)
    return <div className="h-64 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800" />;

  return (
    <div>
      {course.business && (
        <Link
          to={`/businesses/${course.business.id}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
        >
          ← {course.business.name}
        </Link>
      )}

      {/* Course header */}
      <div className="flex items-center gap-4 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <Cover
          name={locText(course, 'title', locale)}
          coverKey={course.id}
          className="h-20 w-20 flex-shrink-0 rounded-lg"
          monogramClass="text-2xl"
        />
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {locText(course, 'title', locale)}
          </h1>
          {locText(course, 'description', locale) && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {locText(course, 'description', locale)}
            </p>
          )}
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-xl font-extrabold">{money(course.price)}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {t('common.advance_word')} {money(course.prepaymentAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-3 font-bold">{t('group.choose')}</h2>
          <GroupList
            groups={course.groups ?? []}
            selectedId={flow.selected?.id}
            onPick={flow.pick}
          />
        </section>
        <aside>
          <BookingPanel
            course={course}
            selected={flow.selected}
            step={flow.step}
            busy={flow.busy}
            error={flow.error}
            onConfirm={flow.createBooking}
            onPay={flow.pay}
          />
        </aside>
      </div>
    </div>
  );
}
