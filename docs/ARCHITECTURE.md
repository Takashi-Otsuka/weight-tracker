# 体重管理アプリ アーキテクチャ設計書

## 1. 方針

MVPではローカル保存で素早く開発する。

ただし、将来的に以下へ拡張しやすい構成にする。

* Supabase移行
* ユーザー認証
* 複数端末同期
* 広告表示
* 課金機能
* Apple Health / Google Fit連携

---

## 2. 技術構成

### MVP

* Next.js App Router
* TypeScript
* Tailwind CSS
* Recharts
* localStorage
* PWA

### 将来

* Supabase Auth
* Supabase PostgreSQL
* Supabase Row Level Security
* Vercel Hosting
* Google AdSense
* Stripe

---

## 3. ディレクトリ構成

```text
src/
  app/
    page.tsx
    records/
      page.tsx
    chart/
      page.tsx
    simulation/
      page.tsx
    settings/
      page.tsx

  components/
    layout/
      AppHeader.tsx
      BottomNav.tsx

    weight/
      WeightInputForm.tsx
      WeightRecordList.tsx
      WeightSummaryCard.tsx

    chart/
      WeightLineChart.tsx

    simulation/
      SimulationByDateForm.tsx
      SimulationByPaceForm.tsx
      SimulationResultCard.tsx

    settings/
      GoalSettingForm.tsx

    ui/
      Button.tsx
      Card.tsx
      Input.tsx

  features/
    weight/
      types.ts
      storage.ts
      calculations.ts
      hooks.ts

    goal/
      types.ts
      storage.ts
      calculations.ts
      hooks.ts

    simulation/
      calculations.ts
      types.ts

  lib/
    date.ts
    number.ts
    constants.ts
```

---

## 4. 設計原則

### UIとロジックを分離する

画面コンポーネントに計算ロジックを直接書かない。

例：

```text
NG:
page.tsx の中で減量ペースを計算する

OK:
features/simulation/calculations.ts に計算関数を置く
```

---

### 保存処理を抽象化する

MVPではlocalStorageを使う。

ただし、将来Supabaseに移行しやすいように、直接localStorageを画面から呼ばない。

```text
NG:
component内で localStorage.setItem を直接呼ぶ

OK:
features/weight/storage.ts 経由で保存する
```

---

## 5. データモデル

### WeightRecord

```ts
export type WeightRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};
```

### GoalSetting

```ts
export type GoalSetting = {
  currentWeightKg?: number;
  startWeightKg?: number;
  targetWeightKg?: number;
  startDate?: string;
  targetDate?: string;
  heightCm?: number;
};
```

### SimulationResult

```ts
export type SimulationResult = {
  totalLossKg: number;
  days: number;
  dailyLossKg: number;
  weeklyLossKg: number;
  monthlyLossKg: number;
  weeklyLossRatePercent: number;
  paceLevel: "slow" | "recommended" | "fast" | "too_fast";
  message: string;
};
```

---

## 6. ストレージ設計

### localStorage keys

```ts
const STORAGE_KEYS = {
  WEIGHT_RECORDS: "weight-app:weight-records",
  GOAL_SETTING: "weight-app:goal-setting",
};
```

### 保存対象

| データ   | 保存先       |
| -------- | ------------ |
| 体重記録 | localStorage |
| 目標設定 | localStorage |
| UI設定   | localStorage |

---

## 7. 将来のDB設計

Supabase移行時は以下のテーブル構成を想定する。

### users

Supabase Authを利用するため、独自usersテーブルは原則不要。

必要に応じてprofilesテーブルを追加する。

### profiles

| column     | type        | note          |
| ---------- | ----------- | ------------- |
| id         | uuid        | auth.users.id |
| height_cm  | numeric     | 身長          |
| created_at | timestamptz | 作成日時      |
| updated_at | timestamptz | 更新日時      |

### weight_records

| column     | type        | note          |
| ---------- | ----------- | ------------- |
| id         | uuid        | primary key   |
| user_id    | uuid        | auth.users.id |
| date       | date        | 記録日        |
| weight_kg  | numeric     | 体重          |
| memo       | text        | メモ          |
| created_at | timestamptz | 作成日時      |
| updated_at | timestamptz | 更新日時      |

制約：

```sql
unique(user_id, date)
```

### goals

| column           | type        | note          |
| ---------------- | ----------- | ------------- |
| id               | uuid        | primary key   |
| user_id          | uuid        | auth.users.id |
| start_weight_kg  | numeric     | 開始体重      |
| target_weight_kg | numeric     | 目標体重      |
| start_date       | date        | 開始日        |
| target_date      | date        | 目標日        |
| created_at       | timestamptz | 作成日時      |
| updated_at       | timestamptz | 更新日時      |

---

## 8. 主要計算ロジック

### 目標との差分

```ts
differenceKg = currentWeightKg - targetWeightKg;
```

### 必要減量量

```ts
totalLossKg = currentWeightKg - targetWeightKg;
```

### 日あたり必要減量

```ts
dailyLossKg = totalLossKg / days;
```

### 週あたり必要減量

```ts
weeklyLossKg = dailyLossKg * 7;
```

### 月あたり必要減量

```ts
monthlyLossKg = dailyLossKg * 30;
```

### 週あたり減量率

```ts
weeklyLossRatePercent = (weeklyLossKg / currentWeightKg) * 100;
```

---

## 9. 減量ペース判定

```ts
if (weeklyLossRatePercent < 0.5) {
  paceLevel = "slow";
} else if (weeklyLossRatePercent < 1.0) {
  paceLevel = "recommended";
} else if (weeklyLossRatePercent < 1.5) {
  paceLevel = "fast";
} else {
  paceLevel = "too_fast";
}
```

### 表示文言

| paceLevel   | 表示                             |
| ----------- | -------------------------------- |
| slow        | ゆるやかなペースです             |
| recommended | 無理の少ないペースです           |
| fast        | やや速いペースです               |
| too_fast    | 目標期間の見直しをおすすめします |

---

## 10. 画面遷移

```text
Home
 ├─ Records
 ├─ Chart
 ├─ Simulation
 └─ Settings
```

スマホでは下部ナビゲーションを利用する。

### BottomNav

項目：

* ホーム
* 記録
* グラフ
* シミュレーション
* 設定

---

## 11. コンポーネント責務

### WeightInputForm

責務：

* 日付入力
* 体重入力
* メモ入力
* バリデーション
* 保存イベント発火

保存処理そのものは持たない。

---

### WeightRecordList

責務：

* 記録一覧表示
* 編集ボタン
* 削除ボタン

---

### WeightLineChart

責務：

* 体重推移表示
* 目標体重ライン表示
* 期間フィルタ反映

---

### GoalSettingForm

責務：

* 目標体重入力
* 目標日入力
* 身長入力
* 保存イベント発火

---

### SimulationByDateForm

責務：

* 現在体重
* 目標体重
* 目標日
* シミュレーション実行

---

### SimulationByPaceForm

責務：

* 現在体重
* 目標体重
* 日あたり減量量
* シミュレーション実行

---

## 12. hooks設計

### useWeightRecords

責務：

* 体重記録の取得
* 追加
* 更新
* 削除

想定API：

```ts
const {
  records,
  addOrUpdateRecord,
  deleteRecord,
} = useWeightRecords();
```

---

### useGoalSetting

責務：

* 目標設定の取得
* 更新

想定API：

```ts
const {
  goalSetting,
  updateGoalSetting,
} = useGoalSetting();
```

---

## 13. PWA要件

MVPでは以下を対応する。

* manifest.json
* app icon
* theme color
* iPhoneホーム画面追加対応
* レスポンシブUI

Service Workerによる高度なオフライン対応は後回しでもよい。

---

## 14. エラーハンドリング

### 入力バリデーション

体重：

* 必須
* 0より大きい
* 300kg以下
* 小数1桁程度を想定

日付：

* 必須
* 不正な日付は不可

目標体重：

* 必須
* 0より大きい
* 現在体重より軽い場合のみ減量シミュレーション対象

日あたり減量量：

* 必須
* 0より大きい
* 大きすぎる値は警告

---

## 15. 将来の収益化設計

### 広告

候補：

* Google AdSense
* アプリ内広告

配置候補：

* 記録一覧下部
* グラフ画面下部
* 設定画面下部

MVPでは実装しない。

---

### 有料機能候補

* クラウド同期
* CSVエクスポート
* 長期分析
* AIコメント
* 広告非表示
* 複数目標管理

---

## 16. Codexへの実装指示

```text
SPEC.md と ARCHITECTURE.md を読んでください。

この仕様に従い、Next.js + TypeScript + Tailwind CSS + RechartsでMVPを実装してください。

優先順位:
1. ディレクトリ構成作成
2. 型定義作成
3. 計算ロジック作成
4. localStorage保存層作成
5. hooks作成
6. UIコンポーネント作成
7. 各画面作成
8. PWA対応

注意:
- page.tsxに計算ロジックを直接書かない
- componentからlocalStorageを直接呼ばない
- 将来Supabaseへ移行しやすいように保存層を分離する
- スマホファーストで実装する
- 不明点は勝手に大きく拡張せずTODOコメントを残す
```
