/**
 * 사전방문 URL 유틸리티
 * UUID 기반 URL 생성 (보안을 위해 추측 불가능한 UUID 사용)
 */

/**
 * 사전방문 예약 URL 생성
 * @param baseUrl 기본 URL (예: https://customer.compass1998.com)
 * @param uuid 사전방문 행사 UUID
 * @returns 전체 URL
 */
export function generatePrevisitUrl(baseUrl: string, uuid: string): string {
  return `${baseUrl}/visit/${uuid}`;
}
