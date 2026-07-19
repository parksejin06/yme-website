# /data 스키마 안내

콘텐츠 담당자가 이 폴더의 JSON/MD 파일만 수정하면 사이트에 그대로 반영됩니다. 컴포넌트 코드는 건드릴 필요 없습니다.

## labs.json (연구실·연구분야 소개)
`reference/labs.pdf`에서 추출 예정 (현재 비어 있음, `[]`). 각 항목 스키마:

```json
{
  "slug": "nanofab",
  "professorKr": "강신일",
  "professorEn": "Shinill Kang, Ph.D.",
  "labNameKr": "나노가공 및 마이크로광학 연구실",
  "labNameEn": "Nanofabrication & Microoptics Laboratory",
  "office": "연세대학교 제3공학관 324호",
  "tel": "(02) 2123-2829",
  "email": "snlkang@yonsei.ac.kr",
  "url": "http://nanofab.yonsei.ac.kr",
  "researchAreaKr": ["나노기술 응용", "나노 가공 / 소자 설계", "..."],
  "researchAreaEn": ["Nanotechnologies for automobile...", "..."],
  "images": [{ "src": "/images/labs/nanofab/figure-1.jpg", "alt": "..." }]
}
```

## faculty.json (교수진 소개)
`reference/연세대학교 기계공학부 교수진.xlsx`에서 `scripts/parse-faculty.mjs`로 추출 (32명). 엑셀이 갱신되면
같은 스크립트를 다시 실행하면 됩니다 (`node scripts/parse-faculty.mjs`, website 폴더에서 실행). 각 항목 스키마:

```json
{
  "name": "강건욱",
  "position": "교수",
  "field": "역학·소재",
  "email": "kwkang75@yonsei.ac.kr",
  "phone": "02-2123-2825",
  "office": "공학관 N204",
  "labName": "Computational Mechanics of Materials Laboratory",
  "labUrl": "https://sites.google.com/site/kwkanglab/",
  "photoPath": "/assets/faculty/강건욱.png",
  "slug": "gang-geonuk",
  "labSlug": null
}
```

`field`는 6개 고정 그룹(역학·소재 / 에너지·열유체 / 로보틱스·제어 / 설계·제조 / 마이크로·나노 / 바이오·포토닉스)
중 하나입니다. `phone`이 `null`이면 UI에 "번호 미등록"(EN: "Not listed")으로 표시됩니다(전화번호 없음 표시,
엑셀 원본 "X" 텍스트를 그대로 노출하지 않음). `position`은 엑셀에 직급 데이터가 없어 전원 기본값 "교수"로
채워져 있습니다 — 실제 직급이 다른 사람은 이 필드만 개별 수정하면 됩니다(`parse-faculty.mjs`를 재실행하면
덮어써지므로, 스크립트를 다시 돌릴 계획이면 FIELD_MAP 근처에 직급 예외 목록을 추가하는 방식을 권장).

`slug`는 `/faculty/[slug]` 상세 페이지 URL입니다. 엑셀에 로마자 표기가 없어 `hangul-romanization` 패키지로
기계적으로 생성했습니다(성 + "-" + 이름, 예: 강건욱 → gang-geonuk). **한글 문자를 슬러그로 그대로 쓰면 이
Next.js 16(Turbopack) 버전에서 `generateStaticParams`와 실제 라우트 매칭 사이에 유니코드 정규화(NFC/NFD)가
어긋나 404가 나는 버그가 있어(이 프로젝트에서 실제로 재현됨), 로마자 슬러그로 우회했습니다.** 향후 Next.js를
업그레이드해도 한글 슬러그로 되돌리기 전에 반드시 재검증할 것.

`labSlug`는 `data/labs.json`의 `professorKr` 값과 이름이 일치할 때만 자동으로 채워지며, 현재 `labs.json`이
비어 있어 전원 `null`입니다 — labs.json이 채워진 뒤 `parse-faculty.mjs`를 재실행하면 자동으로 연결됩니다.
사진 파일은 `/public/assets/faculty/{이름}.{확장자}`.

## graduation-requirements.json / dual-major.json / curriculum.json / courses.json (학부 교육과정)
`reference/연세대학교_기계공학부_학번별_졸업요건.xlsx`, `연세대학교_기계공학부_학부_교과목_소개.xlsx`에서
`scripts/parse-academics.mjs`로 추출 (15개 학번 그룹, 과목 49개). 엑셀이 갱신되면 재실행:
`node scripts/parse-academics.mjs` (website 폴더에서 실행, 콘솔에 파싱 리포트 출력).

- **graduation-requirements.json**: 학번 그룹 15개(03-05~25, 학사편입, 졸업예정자 복수전공) 배열. `summary`
  필드는 "웹사이트용 데이터" 시트 그대로, `specialNotes`는 "학번별 특이사항 및 예외" 시트에서 "적용 학번"
  범위가 겹치는 항목을 자동 매칭한 것. **동일 항목(구분)에 대해 "X학번 이후"식 규정이 여러 개 겹치면 가장
  최근(가장 큰 학번) 규정만 남기고 이전 규정은 제거함** (예: "19학번 이후 5개 영역" vs "22학번 이후 4개 영역"
  → 22 이후 학번에게는 4개 영역만 표시). 원문에 "확인 필요"/"불일치" 표현이 포함된 문장은 학생 화면에 노출하지
  않고 파서 콘솔 리포트로만 출력됨(코드 내 `ADMIN_ONLY_MARKERS` 참조).
- **dual-major.json**: "복수전공·부전공" 시트 그대로, 학번 공통 정보(모든 학번 상세 페이지 하단에 항상 노출).
- **curriculum.json**: "교과목 체계도용 데이터" 시트 기준(같은 내용의 "학년학기별 교육과정" 시트보다 필드가
  풍부해 이쪽을 채택). 학번별 버전이 아닌 단일 공통 편성표이므로 모든 학번 상세 페이지에서 동일하게 표시됨.
  `bucket`은 `1-1~4-2` 중 하나이며, 학기 구분 없이 개설되는 과목(창의제품설계, 연구논문)은 `4-1`/`4-2` 양쪽에
  중복 등록되어 있음(`spansBothSemesters: true`). 학부연구(3)(4)(MEU3008/9)는 원문 개설표에 학년/학기 정보가
  없어 그리드에는 표시되지 않고 `courses.json`에만 존재함.
- **courses.json**: "교과목 상세페이지용 데이터" 시트 그대로. `hasDetail: false`인 과목(9개)은 원문에
  "학부 교과목소개 페이지에 별도 상세설명 없음"으로만 채워져 있어, UI에서 "상세 설명 준비 중"으로 표시됨.

**알려진 원문 불일치 (임의로 고치지 않고 그대로 둠, 파서 리포트에도 출력됨):**
- 기계공학창의설계(MEU2300): 커리큘럼표는 `course_type=전필`(전공필수)이지만, 졸업요건 특이사항 시트는
  "24학번부터 전공필수에서 제외"라고 명시 — 커리큘럼표 자체는 학번 구분 없는 단일 편성표라 이 예외를
  반영하지 못함. 24-25학번 상세 페이지의 전공필수 교과목 칩에는 (졸업요건 데이터 기준으로) 정상적으로
  빠져 있으나, 아래 커리큘럼 그리드에는 여전히 전필로 표시됨 — 원본 확인 필요.
- 메카트로닉스(MEU3014 vs MEU3690), 공학재료(MEU3660 vs MEU3600, 응용고체역학과 학정번호 중복): 원문
  시트 자체에 기재된 불일치이며, "원문 검수" 시트에 이미 문서화되어 있음.

## notices.json (공지사항)
더미 데이터로 채워져 있습니다. 실제 운영 시 이 배열에 새 객체를 추가(맨 위에 추가 권장)하면 됩니다.

## history.json (연혁)
`기계공학부_연혁_및_오시는길.txt` 원본 그대로, 연대순(오름차순) 정렬.

## contact.json (오시는 길)
`기계공학부_연혁_및_오시는길.txt`의 주소/연락처/교통 정보 원본 그대로.
