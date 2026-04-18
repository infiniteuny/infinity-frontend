import Link from 'next/link';
import { Box, ButtonBase, Typography } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  position?: 'top' | 'middle' | 'bottom' | 'single';
} & (
  | {
      href?: string;
      onClick?: never;
    }
  | {
      href?: never;
      onClick?: MouseEventHandler<HTMLButtonElement>;
    }
);

export function SettingTile({ title, subtitle, icon, href, onClick, position = 'single' }: Props) {
  let roundedClass;
  switch (position) {
    case 'top':
      roundedClass = 'rounded-t-2xl rounded-b-md';
      break;
    case 'middle':
      roundedClass = 'rounded-none';
      break;
    case 'bottom':
      roundedClass = 'rounded-tl-md rounded-b-2xl';
      break;
    case 'single':
    default:
      roundedClass = 'rounded-2xl';
      break;
  }

  return (
    <ButtonBase
      sx={{ bgcolor: 'surfaceContainerHigh.main' }}
      className={`w-full justify-start p-4 text-left ${roundedClass}`}
      focusVisibleClassName="bg-(--m3-palette-action-focus)"
      component={href ? 'a' : 'button'}
      LinkComponent={href ? Link : undefined}
      href={href}
      onClick={onClick}
    >
      {icon ? <Box className="flex w-10 items-center justify-center pr-4">{icon}</Box> : null}
      <Box>
        <Typography
          variant="body1"
          component="p"
          className={`font-medium ${subtitle ? 'mb-0.5' : ''}`}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" component="p">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    </ButtonBase>
  );
}
