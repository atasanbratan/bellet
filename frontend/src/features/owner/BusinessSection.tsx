import type { BusinessDetail } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import BusinessEditForm from './BusinessEditForm';
import AddressesPanel from './AddressesPanel';
import { uploadImage } from './utils';

/** "My center" section: approval status, edit form, photo gallery. */
export default function BusinessSection({
  biz,
  onChange,
  onDeleted,
}: {
  biz: BusinessDetail;
  onChange: () => void;
  onDeleted: () => void;
}) {
  const { t } = useI18n();

  const uploadPhoto = async (file?: File) => {
    if (!file) return;
    await uploadImage(`/businesses/${biz.id}/photos`, file);
    onChange();
  };

  return (
    <div className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      {biz.status && biz.status !== 'APPROVED' && (
        <div
          className={`mb-4 rounded px-3 py-2 text-sm ${
            biz.status === 'REJECTED'
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
          }`}
        >
          {t(`bstatus.${biz.status}`)} — {t('dash.pending_note')}
        </div>
      )}

      <BusinessEditForm biz={biz} onChange={onChange} onDeleted={onDeleted} />

      <AddressesPanel businessId={biz.id} />

      <section className="mt-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          {t('dash.photos')}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {biz.photos.map((p) => (
            <img key={p} src={p} alt="" className="h-16 w-24 rounded object-cover" />
          ))}
          <label className="cursor-pointer rounded border border-dashed border-slate-400 dark:border-slate-500 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400">
            {t('dash.upload')}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadPhoto(e.target.files?.[0])}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
