'use client';

import {
  EmojiEventsRounded,
  HandymanRounded,
  HomeRounded,
  ImageRounded,
  Inventory2Rounded,
  MonetizationOnRounded,
  PeopleAltRounded,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

type Props = {
  name: string;
} & SvgIconProps;

export function Icon({ name, ...props }: Props) {
  switch (name) {
    case 'emoji-events':
      return <EmojiEventsRounded {...props} />;
    case 'handyman':
      return <HandymanRounded {...props} />;
    case 'home':
      return <HomeRounded {...props} />;
    case 'image':
      return <ImageRounded {...props} />;
    case 'inventory-2':
      return <Inventory2Rounded {...props} />;
    case 'monetization-on':
      return <MonetizationOnRounded {...props} />;
    case 'people-alt':
      return <PeopleAltRounded {...props} />;
    default:
      return <></>;
  }
}
