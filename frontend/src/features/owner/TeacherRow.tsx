import { useState } from 'react';
import api from '../../api/client';
import type { Teacher } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';

const inputCls =
  'w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1 text-sm';

/** One teacher table row: avatar (click = upload photo), inline edit, delete. */
export default function TeacherRow({
  teacher,
  onUploadPhoto,
  onDelete,
  onSaved,
}: {
  teacher: Teacher;
  onUploadPhoto: (file?: File) => void;
  onDelete: () => void;
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: teacher.name, bio: teacher.bio ?? '' });

  const save = async () => {
    await api.patch(`/teachers/${teacher.id}`, form);
    setEditing(false);
    onSaved();
  };

  return (
    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <label className="group relative h-9 w-9 flex-shrink-0 cursor-pointer overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            {teacher.photo ? (
              <img src={teacher.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                {teacher.name.slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="absolute inset-0 hidden items-center justify-center bg-black/40 text-xs text-white group-hover:flex">
              +
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUploadPhoto(e.target.files?.[0] ?? undefined)}
            />
          </label>
          {editing ? (
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          ) : (
            <span className="truncate font-medium">{teacher.name}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
        {editing ? (
          <input
            className={inputCls}
            placeholder={t('dash.bio_ph')}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        ) : (
          <span className="line-clamp-2">{teacher.bio || '—'}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-3 text-xs font-medium">
          {editing ? (
            <>
              <button onClick={save} className="text-teal-600 dark:text-teal-400">
                {t('common.save')}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-slate-500 dark:text-slate-400"
              >
                {t('common.cancel')}
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setForm({ name: teacher.name, bio: teacher.bio ?? '' });
                setEditing(true);
              }}
              className="text-teal-600 dark:text-teal-400"
            >
              {t('common.edit')}
            </button>
          )}
          <button onClick={onDelete} className="text-red-600 dark:text-red-400">
            {t('common.delete')}
          </button>
        </div>
      </td>
    </tr>
  );
}
