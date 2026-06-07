import Link from 'next/link';
import { Box, ButtonBase, Typography } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';
import { deepmerge } from '@mui/utils';

type Props = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  sx?: Parameters<typeof ButtonBase>[0]['sx'];
  position?: 'top' | 'middle' | 'bottom' | 'single';
} & (
  | {
      href?: string;
      target?: '_blank' | '_self' | '_parent' | '_top';
      onClick?: never;
    }
  | {
      href?: never;
      target?: never;
      onClick?: MouseEventHandler<HTMLButtonElement>;
    }
);

export function ClickableViewTile({
  title,
  subtitle,
  icon,
  trailingIcon,
  href,
  target,
  onClick,
  className,
  sx,
  position = 'single',
}: Props) {
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
    <ButtonBase
      sx={deepmerge({ bgcolor: 'surfaceContainerHigh.main' }, sx || {})}
      className={`w-full justify-start p-4 text-left select-text ${roundedClass} ${className || ''}`}
      focusVisibleClassName="bg-(--m3-palette-action-focus)"
      component={href ? Link : 'button'}
      href={href}
      target={target}
      onClick={onClick}
    >
      {icon ? (
        <Box className="flex w-10 shrink-0 items-center justify-center pr-4">{icon}</Box>
      ) : null}
      <Box className="flex-1">
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
      {trailingIcon ? <Box className="flex shrink-0 items-center pl-4">{trailingIcon}</Box> : null}
    </ButtonBase>
  );
}
