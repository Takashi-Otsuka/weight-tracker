import { WeightRecordRegistrationForm } from "@/components/weight/WeightRecordRegistrationForm";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 bg-zinc-50 font-sans">
      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-zinc-950">体重を記録</h1>
          <p className="text-sm leading-6 text-zinc-600">
            今日の体重を入力して、日々の変化を残します。
          </p>
        </section>
        <WeightRecordRegistrationForm />
      </main>
    </div>
  );
}
