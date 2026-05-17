import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { CheckRounded, ContentCopyRounded, OpenInNewRounded } from '@mui/icons-material';
import { SettingTile } from '@app/presentation/components/internal/settings';
import { User } from '@app/domain/entities';
import { useState } from 'react';
import { ViewTile } from '@app/presentation/components/internal/shared';

type Props = {
  user: User;
};

export function ContactsView({ user }: Props) {
  const [copied, setCopied] = useState(false);

  const handleDiscordCopy = async () => {
    try {
      await navigator.clipboard.writeText(user.links?.discord || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy Discord username: ', err);
    }
  };

  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Contacts
          </Typography>
        </Toolbar>
        <Grid container spacing={0.5} className="tiles-rounded-dynamic">
          <Grid size={12}>
            <ViewTile title="Email Address" subtitle={user.emailAddress} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Phone Number" subtitle={user.phoneNumber} position="middle" />
          </Grid>
          {user.links?.linkedin && (
            <Grid size={12}>
              <SettingTile
                title="LinkedIn"
                subtitle={user.links.linkedin}
                trailingIcon={<OpenInNewRounded />}
                position="middle"
                href={`https://www.linkedin.com/in/${user.links.linkedin}`}
              />
            </Grid>
          )}
          {user.links?.github && (
            <Grid size={12}>
              <SettingTile
                title="GitHub"
                subtitle={user.links.github}
                trailingIcon={<OpenInNewRounded />}
                position="middle"
                href={`https://github.com/${user.links.github}`}
              />
            </Grid>
          )}
          {user.links?.discord && (
            <Grid size={12}>
              <SettingTile
                title="Discord"
                subtitle={user.links.discord}
                trailingIcon={copied ? <CheckRounded color="success" /> : <ContentCopyRounded />}
                position="middle"
                onClick={handleDiscordCopy}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
