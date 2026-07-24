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
DB 없이 `data/*.json` 파일을 직접 읽고 쓰는 방식이라, 로컬에서 `npm run dev`로 켜기만 하면
바로 사용할 수 있습니다.

1. 프로젝트 루트에 `.env.local` 파일을 만들고 아래 내용을 추가하세요 (심사용 예시 비밀번호이며
   운영 시에는 다른 값으로 바꾸시면 됩니다):
   ```
   ADMIN_PASSWORD=yme2026admin
   ```
2. `npm run dev`로 서버를 켠 뒤 [http://localhost:3000/admin](http://localhost:3000/admin) 접속
3. 위 비밀번호로 로그인하면 대시보드에서 게시판/교수 정보를 관리할 수 있습니다.

`.env.local`은 `.gitignore`에 포함되어 있어 저장소에는 올라가지 않으므로, 이 파일은 실행하는
사람이 직접 만들어야 합니다.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
