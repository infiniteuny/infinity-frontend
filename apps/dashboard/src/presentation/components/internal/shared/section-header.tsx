'use client';

import Link from 'next/link';
import { ArrowBackRounded } from '@mui/icons-material';
import { Container, IconButton, Toolbar, Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  title: string;
  badge?: ReactNode;
  backUrl?: string;
  children?: ReactNode;
};

export function SectionHeader({ title, badge, backUrl, children }: Props) {
  return (
    <Toolbar component="header" className="items-start p-6">
      <Container
        maxWidth={false}
        disableGutters
        className={`m-0 inline-flex w-auto flex-wrap items-center gap-y-2 ${children ? 'mr-4' : ''}`}
      >
        {backUrl && (
          <IconButton
            component={Link}
            size="small"
            href={backUrl}
            aria-label="Back"
            className="-my-2 mr-3 -ml-2 box-content inline-flex"
          >
            <ArrowBackRounded />
          </IconButton>
        )}
        <Typography component="h1" variant="h5" className="inline font-medium">
          {title}
        </Typography>
        {badge ? <span className="ml-3 inline-flex items-center">{badge}</span> : null}
      </Container>
      {children}
    </Toolbar>
  );
}
