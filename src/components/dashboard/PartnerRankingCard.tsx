
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import type { PartnerData } from '@/src/types/dashboard';
import { COLOR_TOKENS } from '@/src/lib/config/compassTheme';

interface PartnerRankingCardProps {
  bestPartners: PartnerData[];
  worstPartners: PartnerData[];
}

export default function PartnerRankingCard({
  bestPartners,
  worstPartners,
}: PartnerRankingCardProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return COLOR_TOKENS.warning.main; // Gold
    if (rank === 2) return COLOR_TOKENS.neutral[400]; // Silver
    return '#CD7F32'; // Bronze
  };

  const renderTable = (data: PartnerData[], isBest: boolean) => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>순위</TableCell>
          <TableCell>협력사</TableCell>
          <TableCell align="right">처리율</TableCell>
          <TableCell align="right">응답시간</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((partner) => (
          <TableRow key={partner.id}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {partner.rank && partner.rank <= 3 && (
                  <EmojiEvents
                    sx={{
                      fontSize: 16,
                      color: getRankColor(partner.rank),
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {partner.rank}
                </Typography>
              </Box>
            </TableCell>
            <TableCell>{partner.name}</TableCell>
            <TableCell align="right">
              <Chip
                label={`${partner.processRate.toFixed(1)}%`}
                size="small"
                color={isBest ? 'success' : 'error'}
                variant="outlined"
                sx={{
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '0.75rem',
                  height: 20,
                }}
              />
            </TableCell>
            <TableCell align="right">
              <Typography
                variant="body2"
                sx={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {partner.avgResponseTime.toFixed(1)}h
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="h6" gutterBottom>
          협력사 랭킹
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {/* Best 협력사 */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: 'success.main', fontWeight: 600 }}
            >
              Best 협력사 Top 3
            </Typography>
            {renderTable(bestPartners, true)}
          </Box>

          {/* Worst 협력사 */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: 'error.main', fontWeight: 600 }}
            >
              개선 필요 협력사 Top 3
            </Typography>
            {renderTable(worstPartners, false)}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
