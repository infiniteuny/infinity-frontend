import { Toolbar, Typography } from '@mui/material';

type Props = {
  title: string;
};

export function SectionHeader({ title }: Props) {
  return (
    <Toolbar component="header" className="p-6">
      <Typography component="h1" variant="h5" className="font-medium">
        {title}
      </Typography>
    </Toolbar>
  );
}
