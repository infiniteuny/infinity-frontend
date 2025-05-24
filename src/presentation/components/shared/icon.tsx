'use client';

import {
  BusinessCenterOutlined,
  BusinessCenterRounded,
  Diversity2Outlined,
  Diversity2Rounded,
  Diversity3Outlined,
  Diversity3Rounded,
  EmojiEventsOutlined,
  EmojiEventsRounded,
  Groups3Outlined,
  Groups3Rounded,
  GroupsOutlined,
  GroupsRounded,
  HandymanOutlined,
  HandymanRounded,
  HomeOutlined,
  HomeRounded,
  HubOutlined,
  HubRounded,
  ImageOutlined,
  ImageRounded,
  Inventory2Outlined,
  Inventory2Rounded,
  LockOutlined,
  LockRounded,
  ManageAccountsOutlined,
  ManageAccountsRounded,
  MilitaryTechOutlined,
  MilitaryTechRounded,
  MonetizationOnOutlined,
  MonetizationOnRounded,
  PeopleAltOutlined,
  PeopleAltRounded,
  PersonOutlined,
  PersonRounded,
  RequestQuoteOutlined,
  RequestQuoteRounded,
  ReviewsOutlined,
  ReviewsRounded,
  SettingsOutlined,
  SettingsRounded,
  WorkspacesOutlined,
  WorkspacesRounded,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

type Props = {
  name: string;
} & SvgIconProps;

export function Icon({ name, ...props }: Props) {
  switch (name) {
    case 'business-center':
      return <BusinessCenterRounded {...props} />;
    case 'business-center-outlined':
      return <BusinessCenterOutlined {...props} />;
    case 'diversity-2':
      return <Diversity2Rounded {...props} />;
    case 'diversity-2-outlined':
      return <Diversity2Outlined {...props} />;
    case 'diversity-3':
      return <Diversity3Rounded {...props} />;
    case 'diversity-3-outlined':
      return <Diversity3Outlined {...props} />;
    case 'emoji-events':
      return <EmojiEventsRounded {...props} />;
    case 'emoji-events-outlined':
      return <EmojiEventsOutlined {...props} />;
    case 'groups':
      return <GroupsRounded {...props} />;
    case 'groups-outlined':
      return <GroupsOutlined {...props} />;
    case 'groups-3':
      return <Groups3Rounded {...props} />;
    case 'groups-3-outlined':
      return <Groups3Outlined {...props} />;
    case 'handyman':
      return <HandymanRounded {...props} />;
    case 'handyman-outlined':
      return <HandymanOutlined {...props} />;
    case 'home':
      return <HomeRounded {...props} />;
    case 'home-outlined':
      return <HomeOutlined {...props} />;
    case 'hub':
      return <HubRounded {...props} />;
    case 'hub-outlined':
      return <HubOutlined {...props} />;
    case 'image':
      return <ImageRounded {...props} />;
    case 'image-outlined':
      return <ImageOutlined {...props} />;
    case 'inventory-2':
      return <Inventory2Rounded {...props} />;
    case 'inventory-2-outlined':
      return <Inventory2Outlined {...props} />;
    case 'lock':
      return <LockRounded {...props} />;
    case 'lock-outlined':
      return <LockOutlined {...props} />;
    case 'manage-account':
      return <ManageAccountsRounded {...props} />;
    case 'manage-account-outlined':
      return <ManageAccountsOutlined {...props} />;
    case 'military-tech':
      return <MilitaryTechRounded {...props} />;
    case 'military-tech-outlined':
      return <MilitaryTechOutlined {...props} />;
    case 'monetization-on':
      return <MonetizationOnRounded {...props} />;
    case 'monetization-on-outlined':
      return <MonetizationOnOutlined {...props} />;
    case 'people-alt':
      return <PeopleAltRounded {...props} />;
    case 'people-alt-outlined':
      return <PeopleAltOutlined {...props} />;
    case 'person':
      return <PersonRounded {...props} />;
    case 'person-outlined':
      return <PersonOutlined {...props} />;
    case 'request-quote':
      return <RequestQuoteRounded {...props} />;
    case 'request-quote-outlined':
      return <RequestQuoteOutlined {...props} />;
    case 'reviews':
      return <ReviewsRounded {...props} />;
    case 'reviews-outlined':
      return <ReviewsOutlined {...props} />;
    case 'settings':
      return <SettingsRounded {...props} />;
    case 'settings-outlined':
      return <SettingsOutlined {...props} />;
    case 'workspaces':
      return <WorkspacesRounded {...props} />;
    case 'workspaces-outlined':
      return <WorkspacesOutlined {...props} />;
    default:
      throw new Error(`Icon ${name} not defined yet or not found`);
  }
}
