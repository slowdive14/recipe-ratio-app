# 버그 리포트: 모바일 이미지 AI 분석 실패

**날짜**: 2026-01-11  
**상태**: 해결됨  
**영향 범위**: 모바일 사용자 전체

## 증상

- 웹 브라우저에서는 레시피 이미지 분석이 정상 작동
- 모바일(iOS/Android)에서 "An unexpected response was received from the server" 오류 발생

## 원인 분석

### 1. 잘못된 이미지 데이터 전달 방식

**문제 코드:**
```typescript
{
  type: 'image',
  image: new URL(`data:${mimeType};base64,${imageBase64}`),
}
```

**원인:**  
AI SDK에서 이미지를 전달할 때 data URL은 `URL` 객체가 아닌 **문자열**로 전달해야 함. `new URL()`은 HTTP/HTTPS URL에만 사용.

**수정 코드:**
```typescript
{
  type: 'image',
  image: `data:${mimeType};base64,${imageBase64}`,
}
```

### 2. 모바일 이미지 크기 문제

**문제:**
- 모바일 카메라 사진은 보통 3-12MB (고해상도)
- base64 인코딩 시 약 33% 크기 증가
- 서버 액션 payload 크기 제한 초과

**해결:**
- 클라이언트에서 이미지를 1024px, JPEG 80% 품질로 압축 후 전송
- 압축 후 일반적으로 100-300KB로 감소

### 3. HEIC/HEIF 형식 미지원

**문제:**
- iPhone은 기본적으로 HEIC 형식으로 사진 저장
- 기존 코드는 HEIC 형식을 허용하지 않음

**해결:**
- `accept` 속성과 validation에 `image/heic`, `image/heif` 추가
- Canvas를 통해 JPEG로 변환하여 전송

## 수정된 파일

1. `src/app/actions/extractRecipeFromImage.ts`
   - 이미지 전달 방식 수정 (`new URL()` → 문자열)

2. `src/components/recipe/RecipeScanner.tsx`
   - `compressImage()` 함수 추가
   - HEIC/HEIF 형식 지원 추가
   - 파일 크기 제한 완화 (4MB → 20MB, 압축 전)

## 재발 방지 체크리스트

- [ ] AI SDK 이미지 전달 시 항상 문자열 형태의 data URL 사용
- [ ] 모바일 이미지 업로드 시 반드시 클라이언트 압축 적용
- [ ] iOS 지원 시 HEIC/HEIF 형식 고려
- [ ] 새로운 이미지 관련 기능 추가 시 모바일 테스트 필수

## 참고 문서

- [AI SDK Prompts - Image Parts](https://ai-sdk.dev/docs/foundations/prompts#image-parts)
- [Google Generative AI Provider](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)
