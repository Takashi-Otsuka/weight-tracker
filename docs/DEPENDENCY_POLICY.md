# Dependency Policy

## Basic Policy

新しい依存ライブラリは必要最小限にする。

Next.js / React / TypeScript標準機能で実現できる場合は、原則として追加しない。

## Approval Criteria

新規ライブラリを追加する場合、以下を確認する。

- 目的が明確である
- 既存技術で代替困難である
- TypeScriptに対応している
- Next.jsで利用しやすい
- メンテナンスされている
- bundle sizeが過度に大きくない
- ライセンスに問題がない

## Allowed Initial Dependencies

MVP初期で利用を許可する。

- recharts
- lucide-react
- clsx
- tailwind-merge

## Restricted Dependencies

原則追加しない。

- 状態管理ライブラリ
  - Redux
  - Zustand
  - Jotai

MVPではReact標準のstate / hooksで十分なため。

- UIフレームワーク
  - MUI
  - Chakra UI
  - Ant Design

Tailwind CSSで軽量に作るため。

- 日付ライブラリ
  - moment
  - date-fns
  - dayjs

MVPでは `Date` と自前utilityで対応する。

## PR Rule

依存ライブラリを追加するPRでは、以下を記載する。

```md
## Dependency Added

- package:

## Reason

-

## Alternatives Considered

-

## Risk

-
```

## Removal Rule

使わなくなった依存ライブラリは削除する。

```bash
npm uninstall <package-name>
```
