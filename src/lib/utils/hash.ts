/**
 * 사전방문 URL 해시 유틸리티
 * ID만으로 접근하지 못하도록 행사명을 조합하여 해시 생성
 */

// 비밀 키 (환경변수로 관리 권장, 현재는 고정값 사용)
const SECRET_KEY = 'compass-previsit-2025';

/**
 * 간단한 해시 생성 함수 (SHA-256 대신 경량화된 방식 사용)
 * @param str 해시할 문자열
 * @returns 해시값
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32-bit 정수로 변환
  }
  // 양수로 변환 후 16진수 문자열
  return Math.abs(hash).toString(16);
}

/**
 * 사전방문 URL용 해시 생성
 * @param id 사전방문 ID
 * @param name 사전방문 행사명
 * @returns URL-safe 해시 문자열
 */
export function generatePrevisitHash(id: number, name: string): string {
  // ID + 행사명 + 비밀키 조합
  const payload = `${id}:${name}:${SECRET_KEY}`;

  // Base64 인코딩 후 URL-safe 변환
  const base64 = btoa(encodeURIComponent(payload));

  // 간단한 해시값 추가 (더 보안적)
  const hashSuffix = simpleHash(payload);

  // 앞 8자리 + 해시 6자리 조합 (URL 길이 적절히 유지)
  const urlHash = base64.slice(0, 8) + hashSuffix.slice(0, 6);

  // URL-safe 문자로 변환
  return urlHash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * 사전방문 예약 URL 생성
 * @param baseUrl 기본 URL (예: https://reservation.compass1998.com)
 * @param id 사전방문 ID
 * @param name 사전방문 행사명
 * @returns 전체 URL
 */
export function generatePrevisitUrl(baseUrl: string, id: number, name: string): string {
  const hash = generatePrevisitHash(id, name);
  return `${baseUrl}/visit/${id}/${hash}`;
}
