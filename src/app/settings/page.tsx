import { GoalSettingSection } from "@/components/settings/GoalSettingSection";

export default function SettingsPage() {
  return (
    <div className="flex min-h-full flex-1 bg-zinc-50 font-sans">
      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-zinc-950">目標を設定</h1>
          <p className="text-sm leading-6 text-zinc-600">
            現在体重、目標体重、目標日を保存します。
          </p>
        </section>
        <GoalSettingSection />
      </main>
    </div>
  );
}
