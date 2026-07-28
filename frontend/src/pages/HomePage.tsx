import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Business, Province, Subject } from '../types';
import { browseApi } from '../api/browse';
import { provincesApi } from '../api/provinces';
import { subjectsApi } from '../api/subjects';
import { useI18n } from '../i18n/LocaleContext';
import Pager from '../components/Pager';
import SubjectsPanel from '../features/home/SubjectsPanel';
import BrowseFilters from '../features/home/BrowseFilters';
import BusinessGrid from '../features/home/BusinessGrid';

const PAGE_SIZE = 12;

export default function HomePage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const urlSearch = params.get('search') ?? '';

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState('');
  const [province, setProvince] = useState('');
  const [search, setSearch] = useState(urlSearch);
  const [debounced, setDebounced] = useState(urlSearch);
  const [page, setPage] = useState(1);

  useEffect(() => {
    subjectsApi.list().then(setSubjects);
    provincesApi.list().then(setProvinces);
  }, []);

  // Nav-bar search lands here as /?search=… — adopt it.
  useEffect(() => {
    setSearch(urlSearch);
    setDebounced(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  // Any filter change invalidates the current page number.
  useEffect(() => setPage(1), [subject, province, debounced]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    browseApi
      .list({ subject, province, search: debounced, page, pageSize: PAGE_SIZE })
      .then((d) => {
        if (!active) return;
        setBusinesses(d.items);
        setTotal(d.total);
        setTotalPages(d.totalPages);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [subject, province, debounced, page]);

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <SubjectsPanel
        className="hidden lg:block"
        subjects={subjects}
        active={subject}
        onSelect={setSubject}
      />

      <section id="browse">
        <BrowseFilters
          search={search}
          province={province}
          provinces={provinces}
          onSearch={setSearch}
          onProvince={setProvince}
        />

        <div className="mb-4">
          <h1 className="text-xl font-bold tracking-tight">
            {t('home.heading')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading ? t('common.loading') : t('home.result_count', { n: total })}
          </p>
        </div>

        <BusinessGrid businesses={businesses} loading={loading} />
        <Pager
          page={page}
          totalPages={totalPages}
          onPage={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </section>
    </div>
  );
}
