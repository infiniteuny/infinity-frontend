import { Box, Container, Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle: string | number;
  icon?: ReactNode;
  position?: 'top' | 'middle' | 'bottom' | 'single';
};

export function ViewTile({ title, subtitle, icon, position = 'single' }: Props) {
  let roundedClass;
  switch (position) {
    case 'top':
      roundedClass = 'rounded-t-2xl rounded-b-md';
      break;
    case 'middle':
      roundedClass = 'rounded-md';
      break;
    case 'bottom':
      roundedClass = 'rounded-t-md rounded-b-2xl';
      break;
    case 'single':
    default:
      roundedClass = 'rounded-2xl';
      break;
  }

  return (
    <Container
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainerHigh.main' }}
      className={`flex w-full justify-start p-4 text-left select-text ${roundedClass}`}
    >
      {icon ? <Box className="flex w-10 items-center justify-center pr-4">{icon}</Box> : null}
      <Box>
        <Typography variant="body1" component="p" className="font-medium">
          {title}
        </Typography>
        <Typography variant="body2" component="p">
          {subtitle}
        </Typography>
      </Box>
    </Container>
  );
}
