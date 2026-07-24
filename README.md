This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 관리자 페이지 (`/admin`)

공지사항·뉴스·행사·교수 정보를 코드 수정 없이 등록/수정/삭제할 수 있는 관리자 페이지입니다.
데이터는 Upstash Redis(Vercel Marketplace)에 저장됩니다 — Vercel 서버리스 함수는 파일 시스템에
영구적으로 쓸 수 없어서(재배포 시 초기화됨), `data/*.json` 파일을 직접 쓰는 방식 대신 Redis를
사용합니다. `data/*.json`은 최초 시드 데이터 + 로컬에서 Redis 키가 아직 없을 때의 폴백으로만
남아 있습니다.

1. 프로젝트 루트에 `.env.local` 파일을 만들고 아래 내용을 추가하세요 (심사용 예시 비밀번호이며
   운영 시에는 다른 값으로 바꾸시면 됩니다):
   ```
   ADMIN_PASSWORD=yme2026admin
   UPSTASH_REDIS_REST_URL=...
   UPSTASH_REDIS_REST_TOKEN=...
   ```
   Redis 값은 Vercel 대시보드 → 프로젝트 → Storage 탭 → 연결한 Upstash Redis DB → "REST" 탭에서
   복사할 수 있습니다.
2. `npm run dev`로 서버를 켠 뒤 [http://localhost:3000/admin](http://localhost:3000/admin) 접속
3. 위 비밀번호로 로그인하면 대시보드에서 게시판/교수 정보를 관리할 수 있습니다.

`.env.local`은 `.gitignore`에 포함되어 있어 저장소에는 올라가지 않으므로, 이 파일은 실행하는
사람이 직접 만들어야 합니다.

### Vercel 배포 시 필요한 환경변수

Vercel 대시보드 → 프로젝트 → Settings → Environment Variables에 아래 세 개를 등록해야 합니다
(Upstash Redis를 Storage 탭에서 이 프로젝트에 연결하면 `UPSTASH_REDIS_REST_URL`/`_TOKEN`은
자동으로 추가되고, `ADMIN_PASSWORD`만 직접 추가하면 됩니다):

- `ADMIN_PASSWORD` — 관리자 로그인 비밀번호
- `UPSTASH_REDIS_REST_URL` — Upstash Redis 연결 시 자동 추가
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis 연결 시 자동 추가

기존 `data/*.json`의 데이터를 Redis로 옮기려면(최초 1회): `node --env-file=.env.local
scripts/migrate-to-redis.mjs` (이미 Redis에 값이 있는 키는 건너뛰며, 덮어쓰려면 `--force` 추가)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
