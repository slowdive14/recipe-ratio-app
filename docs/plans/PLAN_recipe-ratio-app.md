# Implementation Plan: 레시피 비율 계산기 앱

**Status**: ✅ Complete
**Started**: 2025-12-31
**Last Updated**: 2025-12-31

---

## 📋 Overview

레시피를 기록하고 재료 비율을 자동으로 계산해주는 웹 앱입니다.

### 핵심 기능
- ✅ 레시피 생성, 수정, 삭제, 조회
- ✅ 카테고리 관리 (추가, 삭제, 필터링)
- ✅ 비율 변경 시 모든 재료 양 자동 계산
- ✅ 변경된 비율로 새 레시피 저장
- ✅ 오븐 설정 (예열, 가열 - 여러 단계 추가 가능)
- ✅ 이미지 업로드
- ✅ Firebase 데이터 영구 저장
- ✅ 반응형 디자인

---

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **State Management**: Zustand
- **Form**: React Hook Form + Zod

---

## 📁 Project Structure

```
recipe-ratio-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 홈
│   │   ├── categories/
│   │   │   └── page.tsx        # 카테고리 관리
│   │   └── recipes/
│   │       ├── page.tsx        # 레시피 목록
│   │       ├── new/
│   │       │   └── page.tsx    # 새 레시피
│   │       └── [id]/
│   │           ├── page.tsx    # 레시피 상세 + 비율 계산
│   │           └── edit/
│   │               └── page.tsx # 레시피 편집
│   ├── components/
│   │   ├── ui/                 # 공통 UI (Button, Input, Select, Card)
│   │   ├── layout/             # Navigation
│   │   ├── category/           # 카테고리 컴포넌트
│   │   └── recipe/             # 레시피 컴포넌트
│   ├── lib/
│   │   ├── firebase.ts         # Firebase 설정
│   │   ├── category.ts         # 카테고리 CRUD
│   │   ├── recipe.ts           # 레시피 CRUD
│   │   ├── storage.ts          # 이미지 업로드
│   │   ├── fraction.ts         # 분수 계산
│   │   ├── ratioCalculator.ts  # 비율 계산
│   │   ├── constants.ts        # 상수 (단위, 분수 등)
│   │   └── utils.ts            # 유틸리티
│   ├── store/
│   │   ├── categoryStore.ts    # 카테고리 상태
│   │   └── recipeStore.ts      # 레시피 상태
│   └── types/
│       ├── category.ts
│       └── recipe.ts
├── .env.local                  # Firebase 환경 변수
└── .env.example                # 환경 변수 예시
```

---

## 🚀 Getting Started

### 1. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Firestore Database 활성화
3. Storage 활성화
4. 웹 앱 추가 후 설정 값 복사

### 2. 환경 변수 설정

`.env.local` 파일에 Firebase 설정 값 입력:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. 실행

```bash
cd recipe-ratio-app
npm install
npm run dev
```

http://localhost:3000 에서 확인

---

## 📊 Implementation Progress

### Phase 1: 프로젝트 초기 설정 ✅
- Next.js + TypeScript + Tailwind CSS 설정
- Firebase 연결 설정
- 타입 정의, 상수 정의

### Phase 2: 카테고리 관리 CRUD ✅
- 카테고리 추가/수정/삭제
- Zustand Store 연동
- 카테고리 목록 UI

### Phase 3: 레시피 기본 정보 + 오븐 설정 ✅
- 레시피 CRUD
- 오븐 설정 (예열/가열, 온도, 시간)
- 가열 단계 동적 추가

### Phase 4: 재료 관리 + 비율 계산 ✅
- 재료 입력 (이름, 용량, 분수, 단위)
- 분수 지원 (1/8, 1/4, 1/3, 1/2, 2/3, 3/4)
- 한글 단위 (그램, 개, 밀리리터 등 14종)
- 비율 계산 기능
- "이 비율로 새 레시피 저장" 기능

### Phase 5: 이미지 업로드 ✅
- Firebase Storage 연동
- 이미지 업로드/미리보기/삭제
- 파일 유효성 검사

### Phase 6: UI 완성 + 반응형 ✅
- 공통 네비게이션
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 로딩 상태 (스켈레톤)
- 빈 상태 UI

---

## ✅ Final Status

모든 기능 구현 완료. Firebase 설정 후 바로 사용 가능.
