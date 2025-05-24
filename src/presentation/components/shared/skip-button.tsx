import { Button } from '@mui/material';

export function SkipToContentButton() {
  return (
    <Button
      href="#content"
      variant="outlined"
      className="absolute top-2 -left-96 z-[-99] focus:left-2 focus:z-[1500] active:left-2 active:z-[1500]"
    >
      Skip to content
    </Button>
  );
}
