'use client';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { CommunityGroupAdminMemberCard } from './community-group-admin-member-card';
import { CommunityGroupAdminMemberDto } from '@infiniteuny/infinity-infrastructure';

type Props = {
  members: CommunityGroupAdminMemberDto[];
};

export function CommunityGroupAdminsGrid({ members }: Props) {
  return (
    <Box component="section">
      {members.length > 0 ? (
        <Grid container spacing={3}>
          {members.map((member) => (
            <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <CommunityGroupAdminMemberCard member={member} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card
          elevation={0}
          className="rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none"
        >
          <CardContent className="p-12 text-center">
            <Typography variant="h6" className="font-bold">
              Tidak ada administrator yang ditemukan
            </Typography>
            <Typography variant="body2" className="mt-1 text-(--m3-palette-onSurfaceVariant-main)">
              Coba ubah kata kunci pencarian atau pilih filter grup komunitas lainnya.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
