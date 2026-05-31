import { formatDate } from "@/lib/date";

import type { WeightRecord } from "@/features/weight/types";

export type WeightRecordListProps = {
  records: WeightRecord[];
};

export function WeightRecordList({ records }: WeightRecordListProps) {
  const sortedRecords = [...records].sort((left, right) => {
    if (left.date === right.date) {
      return 0;
    }

    return left.date > right.date ? -1 : 1;
  });

  if (sortedRecords.length === 0) {
    return (
      <section
        aria-label="体重記録一覧"
        className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center"
      >
        <p className="text-sm font-medium text-zinc-900">
          まだ体重記録がありません
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          体重を入力すると、ここに記録が表示されます。
        </p>
      </section>
    );
  }

  return (
    <section aria-label="体重記録一覧" className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-zinc-950">記録一覧</h2>
      <ul className="flex flex-col gap-3">
        {sortedRecords.map((record) => (
          <li
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            key={record.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <time
                  className="text-sm font-medium text-zinc-600"
                  dateTime={record.date}
                >
                  {formatDate(record.date)}
                </time>
                <p className="text-2xl font-semibold text-zinc-950">
                  {record.weightKg.toFixed(1)}
                  <span className="ml-1 text-sm font-medium text-zinc-500">
                    kg
                  </span>
                </p>
              </div>
            </div>
            {record.memo ? (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                {record.memo}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
