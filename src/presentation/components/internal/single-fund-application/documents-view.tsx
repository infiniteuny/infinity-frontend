import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { FundApplication } from '@app/domain/entities';

type Props = {
  fundApplication: FundApplication;
};

export function DocumentsView({ fundApplication }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
          <Typography component="h2" variant="h6" className="font-medium">
            Documents
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Letter of Acceptance
            </Typography>
            <Typography variant="body2" component="p">
              {fundApplication.letterOfAcceptance as string}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Proposal
            </Typography>
            <Typography variant="body2" component="p">
              {fundApplication.proposal as string}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
