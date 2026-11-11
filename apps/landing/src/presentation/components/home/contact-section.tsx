'use client';

import { APP } from '@config';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  SvgIconProps,
  Typography,
} from '@mui/material';
import {
  EmailOutlined,
  Instagram,
  LocationOnOutlined,
  OpenInNewRounded,
  WhatsApp,
  X,
} from '@mui/icons-material';
import { ComponentType } from 'react';
import { DiscordIcon } from '@infiniteuny/infinity-ui';

const CONTACT_META: Record<
  string,
  {
    icon: ComponentType<SvgIconProps>;
    title: string;
    actionLabel?: string;
  }
> = {
  address: {
    icon: LocationOnOutlined,
    title: 'Alamat',
  },
  whatsapp: {
    icon: WhatsApp,
    title: 'WhatsApp',
    actionLabel: 'Chat via WhatsApp',
  },
  email: {
    icon: EmailOutlined,
    title: 'Email',
    actionLabel: 'Kirim Email',
  },
  instagram: {
    icon: Instagram,
    title: 'Instagram',
    actionLabel: 'Kunjungi Instagram',
  },
  discord: {
    icon: DiscordIcon,
    title: 'Discord Komunitas',
    actionLabel: 'Gabung Discord',
  },
  x: {
    icon: X,
    title: 'X',
    actionLabel: 'Kunjungi X',
  },
};

export function ContactSection() {
  return (
    <Box id="contacts" component="section" className="py-20">
      <Container maxWidth="lg">
        <Stack className="mx-auto mb-14 max-w-3xl items-center text-center">
          <Chip label="Hubungi Kami" color="primary" size="small" className="mb-3 font-semibold" />
          <Typography
            variant="h3"
            component="h2"
            className="mb-4 text-3xl font-extrabold sm:text-4xl"
          >
            Mari Berkolaborasi Bersama INFINITE
          </Typography>
          <Typography
            variant="body1"
            className="text-base text-(--m3-palette-onSurfaceVariant-main)"
          >
            Punya pertanyaan, tawaran kerja sama, partner media, atau undangan kegiatan? Hubungi
            kami melalui kanal komunikasi resmi berikut.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {APP.contacts.map((contact) => {
            const meta = CONTACT_META[contact.id] ?? {
              icon: EmailOutlined,
              title: contact.id,
              actionLabel: 'Buka Tautan',
            };
            const IconComponent = meta.icon;
            const isExternal = contact.link.startsWith('http');

            return (
              <Grid key={contact.id} size={{ xs: 12, sm: 6 }}>
                <Card
                  elevation={0}
                  className="h-full rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none"
                >
                  <CardContent className="p-6">
                    <Stack direction="row" spacing={2} className="items-start">
                      <Avatar
                        variant="rounded"
                        className="h-12 w-12 shrink-0 rounded-2xl bg-(--m3-palette-primaryContainer-main) text-(--m3-palette-onPrimaryContainer-main)"
                      >
                        <IconComponent />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" className="mb-1 font-bold">
                          {meta.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="mb-2 leading-relaxed text-(--m3-palette-onSurfaceVariant-main)"
                        >
                          {contact.text}
                        </Typography>
                        {contact.link && meta.actionLabel && (
                          <Button
                            component="a"
                            href={contact.link}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            variant="text"
                            size="small"
                            endIcon={<OpenInNewRounded fontSize="small" />}
                          >
                            {meta.actionLabel}
                          </Button>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
