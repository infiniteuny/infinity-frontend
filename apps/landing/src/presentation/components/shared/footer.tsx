'use client';

import NextLink from 'next/link';
import { APP } from '@config';
import {
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  SvgIconProps,
  Typography,
} from '@mui/material';
import { EmailOutlined, Instagram, LocationOnOutlined, WhatsApp, X } from '@mui/icons-material';
import { ComponentType } from 'react';
import { DiscordIcon, InfiniteTextLogo } from '@infiniteuny/infinity-ui';
import { PathMenu, UrlMenu } from '@infiniteuny/infinity-domain';

const CONTACT_ICONS: Record<string, ComponentType<SvgIconProps>> = {
  address: LocationOnOutlined,
  whatsapp: WhatsApp,
  email: EmailOutlined,
  instagram: Instagram,
  discord: DiscordIcon,
  x: X,
};

export function Footer() {
  const contacts = APP.contacts.filter((c) => c.id !== 'address' && Boolean(c.link));

  return (
    <Container
      component="footer"
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainer.main' }}
      className="w-full px-4 py-10 sm:px-6"
    >
      <Grid container spacing={{ xs: 6, lg: 10 }} className="justify-between">
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={2} className="items-center text-center lg:items-start lg:text-left">
            <Link
              component={NextLink}
              href="/"
              underline="none"
              className="inline-flex w-fit items-center"
            >
              <InfiniteTextLogo
                width={150}
                height={46}
                className="fill-infinite-light-green dark:fill-infinite-dark-green block"
              />
            </Link>
            <Typography
              variant="subtitle2"
              className="font-semibold text-(--m3-palette-primary-main)"
            >
              {APP.site.tagline}
            </Typography>
            <Typography
              variant="body2"
              className="max-w-xl leading-relaxed text-(--m3-palette-onSurfaceVariant-main)"
            >
              {APP.site.description}
            </Typography>
            <Stack direction="row" spacing={1} className="justify-center pt-1 lg:justify-start">
              {contacts.map((contact) => {
                const IconComponent = CONTACT_ICONS[contact.id] ?? EmailOutlined;
                const isExternal = contact.link.startsWith('http');

                return (
                  <IconButton
                    key={contact.id}
                    component="a"
                    href={contact.link}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    aria-label={`${contact.id} INFINITE UNY`}
                    size="small"
                    className="bg-(--m3-palette-surfaceContainerHigh-main) text-(--m3-palette-onSurface-main)"
                  >
                    <IconComponent fontSize="small" />
                  </IconButton>
                );
              })}
            </Stack>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Grid container spacing={4}>
            {APP.footer.menus.map((category) => (
              <Grid key={category.name} size={{ xs: 6, sm: 3 }}>
                <Stack spacing={2}>
                  <Typography variant="subtitle1" className="font-semibold">
                    {category.name}
                  </Typography>
                  <Stack spacing={1.25}>
                    {category.items.map((item) => {
                      const isExternal = item.hasOwnProperty('url');
                      const href = item.hasOwnProperty('path')
                        ? (item as Omit<PathMenu, 'icon'>).path
                        : (item as Omit<UrlMenu, 'icon'>).url;

                      return (
                        <Link
                          key={item.name}
                          component={isExternal ? 'a' : NextLink}
                          href={href}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          underline="hover"
                          variant="body2"
                          color="textSecondary"
                          className="w-fit leading-relaxed transition-colors hover:text-(--m3-palette-primary-main)"
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Divider className="my-8" />

      <Typography
        component="p"
        sx={{ color: 'outline' }}
        className="mx-auto my-0 w-full text-center"
      >
        &copy; {new Date().getFullYear()}. Made with &#128154; by INFINITE UNY.
      </Typography>
    </Container>
  );
}
