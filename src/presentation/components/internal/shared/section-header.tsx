import Link from 'next/link';
import { ArrowBackRounded } from '@mui/icons-material';
import { Container, IconButton, Toolbar, Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  title: string;
  backUrl?: string;
  children?: ReactNode;
};

export function SectionHeader({ title, backUrl, children }: Props) {
  return (
    <Toolbar component="header" className="items-start p-6">
      <Container
        maxWidth={false}
        disableGutters
        className={`m-0 inline-flex w-auto items-center ${children ? 'mr-4' : ''}`}
      >
        {backUrl && (
          <IconButton
            component={Link}
            size="small"
            href={backUrl}
            className="-my-2 mr-3 -ml-2 box-content inline-flex"
          >
            <ArrowBackRounded />
          </IconButton>
        )}
        <Typography component="h1" variant="h5" className="inline font-medium">
          {title}
        </Typography>
      </Container>
      {children}
    </Toolbar>
  );
}
