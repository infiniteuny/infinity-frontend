import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { CheckRounded, ContentCopyRounded, OpenInNewRounded } from '@mui/icons-material';
import { ClickableViewTile, ViewTile } from '@app/presentation/components/internal/shared';
import { User } from '@app/domain/entities';
import { useState } from 'react';

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
            <ClickableViewTile
              title="Email Address"
              subtitle={user.emailAddress}
              trailingIcon={<OpenInNewRounded />}
              position="middle"
              href={`mailto:${user.emailAddress}`}
              target="_blank"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Phone Number" subtitle={user.phoneNumber} position="middle" />
          </Grid>
          {user.links?.linkedin && (
            <Grid size={12}>
              <ClickableViewTile
                title="LinkedIn"
                subtitle={user.links.linkedin}
                trailingIcon={<OpenInNewRounded />}
                position="middle"
                href={`https://www.linkedin.com/in/${user.links.linkedin}`}
                target="_blank"
              />
            </Grid>
          )}
          {user.links?.github && (
            <Grid size={12}>
              <ClickableViewTile
                title="GitHub"
                subtitle={user.links.github}
                trailingIcon={<OpenInNewRounded />}
                position="middle"
                href={`https://github.com/${user.links.github}`}
                target="_blank"
              />
            </Grid>
          )}
          {user.links?.discord && (
            <Grid size={12}>
              <ClickableViewTile
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
