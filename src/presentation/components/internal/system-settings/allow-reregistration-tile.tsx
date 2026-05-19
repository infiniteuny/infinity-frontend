import { CreateConfig, UpdateConfig } from '@app/application';
import { clientContainer } from '@app/client-injection';
import { Config } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { Box, Container, Switch, Typography } from '@mui/material';
import { match } from 'effect/Either';
import { useMemo, useState } from 'react';

type Props = {
  initialValue?: Config;
};

export function AllowReregistrationTile({ initialValue }: Props) {
  const key = 'allow_reregistration';
  const createConfig = useMemo(() => clientContainer.get<CreateConfig>(SYMBOLS.CreateConfig), []);
  const updateConfig = useMemo(() => clientContainer.get<UpdateConfig>(SYMBOLS.UpdateConfig), []);

  const [created, setCreated] = useState(initialValue !== undefined);
  const [checked, setChecked] = useState(initialValue?.value === 'true');
  const [disabled, setDisabled] = useState(false);

  const handleToggle = async () => {
    const newValue = !checked;

    setDisabled(true);

    let result;
    if (!created) {
      result = await createConfig.execute({
        key: key,
        value: newValue.toString(),
        type: 'BOOLEAN',
        isPrivate: true,
      });
    } else {
      result = await updateConfig.execute(key, {
        value: newValue.toString(),
      });
    }

    match(result, {
      onLeft: (error) => {
        console.error('Failed to update config:', error);
      },
      onRight: () => {
        setCreated(true);
        setChecked(newValue);
      },
    });

    setDisabled(false);
  };

  return (
    <Container
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainerHigh.main' }}
      className={`inline-flex w-full justify-start rounded-t-2xl rounded-b-md p-4 text-left select-text`}
    >
      <Box className="flex-1">
        <Typography variant="body1" component="p" className="font-medium">
          Allow re-registration
        </Typography>
        <Typography variant="body2" component="p">
          Show membership extension menu
        </Typography>
      </Box>
      <Box className="flex shrink-0 items-center pl-4">
        <Switch checked={checked} disabled={disabled} onChange={handleToggle} />
      </Box>
    </Container>
  );
}
