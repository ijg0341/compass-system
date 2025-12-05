
import { ToggleButton, ToggleButtonGroup, Typography, Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import type { SmartnetCategory } from '@/src/types/smartnet';
import { CATEGORY_LABELS } from '@/src/types/smartnet';

interface CategorySelectorProps {
  value: SmartnetCategory | null;
  onChange: (category: SmartnetCategory | null) => void;
}

const categoryIcons: Record<Exclude<SmartnetCategory, 'vote'>, React.ReactNode> = {
  visit: <EventIcon />,
  move: <LocalShippingIcon />,
};

const VISIBLE_CATEGORIES: SmartnetCategory[] = ['visit', 'move'];

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newCategory: SmartnetCategory | null
  ) => {
    onChange(newCategory);
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        카테고리 선택
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            px: 3,
            py: 1,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
        }}
      >
        {VISIBLE_CATEGORIES.map((category) => (
          <ToggleButton key={category} value={category}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {categoryIcons[category as Exclude<SmartnetCategory, 'vote'>]}
              {CATEGORY_LABELS[category]}
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
