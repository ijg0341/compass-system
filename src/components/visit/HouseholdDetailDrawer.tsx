/**
 * 세대상세 Drawer 컴포넌트
 * 화면 ID: CP-SA-99-001
 */
import { CircularProgress, Box } from '@mui/material';
import BaseDrawer, { DrawerSection, DrawerInfoTable } from '@/src/components/common/BaseDrawer';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { useHouseholdDetail } from '@/src/hooks/useDongho';

interface HouseholdDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  donghoId: number;
}

export default function HouseholdDetailDrawer({
  open,
  onClose,
  donghoId,
}: HouseholdDetailDrawerProps) {
  const { projectUuid } = useCurrentProject();
  const { data, isLoading } = useHouseholdDetail(projectUuid, donghoId);

  return (
    <BaseDrawer open={open} onClose={onClose} title="세대상세" size="medium">
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : data ? (
        <>
          {/* 기본 정보 */}
          <DrawerSection title="기본 정보" isFirst>
            <DrawerInfoTable
              rows={[
                [
                  { label: '동', value: data.dong },
                  { label: '호', value: data.ho },
                ],
                [
                  { label: '타입', value: data.unit_type },
                  { label: 'EV라인', value: data.ev_lines?.join(', ') },
                ],
              ]}
            />
          </DrawerSection>

          {/* 계약자 정보 */}
          <DrawerSection title="계약자 정보">
            <DrawerInfoTable
              rows={[
                [
                  { label: '계약자명', value: data.contractor_name },
                  { label: '연락처', value: data.contractor_phone },
                ],
                { label: '생년월일', value: data.contractor_birth },
              ]}
            />
          </DrawerSection>

          {/* 입주자 정보 */}
          <DrawerSection title="입주자 정보">
            <DrawerInfoTable
              rows={[
                [
                  { label: '입주자명', value: data.resident_name },
                  { label: '연락처', value: data.resident_phone },
                ],
                [
                  { label: '생년월일', value: data.resident_birth },
                  { label: '입주형태', value: data.resident_type },
                ],
                [
                  { label: '입주일', value: data.resident_date },
                  { label: '등급', value: data.level },
                ],
              ]}
            />
          </DrawerSection>

          {/* 검침 정보 */}
          <DrawerSection title="검침 정보">
            <DrawerInfoTable
              rows={[
                [
                  { label: '검침일자', value: data.meter_date },
                  { label: '전기', value: data.meter_electric },
                ],
                [
                  { label: '수도', value: data.meter_water },
                  { label: '가스', value: data.meter_gas },
                ],
                [
                  { label: '난방', value: data.meter_heating },
                  { label: '온수', value: data.meter_hotwater },
                ],
                [
                  { label: '담당자', value: data.meterman_name },
                  { label: '연락처', value: data.meterman_phone },
                ],
              ]}
            />
          </DrawerSection>

          {/* 키불출 정보 */}
          <DrawerSection title="키불출 정보">
            <DrawerInfoTable
              rows={[
                [
                  { label: '키 지급일자', value: data.key_date },
                  { label: '키불출', value: data.key_release },
                ],
                [
                  { label: '세대키', value: data.key_house },
                  { label: '공동현관', value: data.key_lobby },
                ],
                [
                  { label: '우편함', value: data.key_post },
                  { label: '기타', value: data.key_etc },
                ],
                [
                  { label: '담당자', value: data.keyman_name },
                  { label: '연락처', value: data.keyman_phone },
                ],
              ]}
            />
          </DrawerSection>

          {/* 지급품 정보 */}
          <DrawerSection title="지급품 정보">
            <DrawerInfoTable
              rows={[
                { label: '지급일자', value: data.give_date },
                {
                  label: '지급품',
                  value: data.give_items
                    ? Object.entries(data.give_items)
                        .filter(([, v]) => v)
                        .map(([k]) => k)
                        .join(', ') || '-'
                    : '-',
                  fullWidth: true,
                },
              ]}
            />
          </DrawerSection>

          {/* 부동산 정보 */}
          {data.agent_companys && data.agent_companys.length > 0 && (
            <DrawerSection title="부동산 정보">
              <DrawerInfoTable
                rows={data.agent_companys.map((agent) => ({
                  label: agent.name,
                  value: `${agent.manager_name} (${agent.manager_phone})`,
                }))}
              />
              {data.agent_memo && (
                <DrawerInfoTable rows={[{ label: '메모', value: data.agent_memo, fullWidth: true }]} />
              )}
            </DrawerSection>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>세대 정보를 찾을 수 없습니다.</Box>
      )}
    </BaseDrawer>
  );
}
