import { ReactNode } from 'react';
import { Toolbar, Typography } from '@mui/material';

type Props = {
  title: string;
  children?: ReactNode;
};

export function SectionHeader({ title, children }: Props) {
  return (
    <Toolbar component="header" className="p-6">
      <Typography component="h1" variant="h5" className={`${children ? 'mr-4' : ''} font-medium`}>
        {title}
      </Typography>
      {children}
    </Toolbar>
  );
}
