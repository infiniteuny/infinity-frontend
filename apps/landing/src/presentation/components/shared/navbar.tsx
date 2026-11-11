'use client';

import Link from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Skeleton,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import {
  CloseRounded,
  DarkModeOutlined,
  LightModeOutlined,
  LoginRounded,
  LogoutRounded,
  OpenInNewRounded,
  PersonRounded,
} from '@mui/icons-material';
import { ClickableViewTile } from './clickable-view-tile';
import { clientContainer } from '@app/client-injection';
import { GetSession, Login, Logout } from '@infiniteuny/infinity-application';
import { InfiniteTextLogo } from '@infiniteuny/infinity-ui';
import { isRight } from 'effect/Either';
import { NavbarDropdownMenu } from './navbar-dropdown-menu';
import { NavbarMenu } from './navbar-menu';
import { NestedMenu, PathMenu, Session, UrlMenu } from '@infiniteuny/infinity-domain';
import { SessionDto, SessionMapper } from '@infiniteuny/infinity-infrastructure';
import { SYMBOLS } from '@config';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

let hasCheckedSilentSso = false;

type Props = {
  menus?: (PathMenu | UrlMenu | NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>)[];
  session?: SessionDto;
  mobileOpen?: boolean;
  onToggleDrawer?: () => void;
};

export function Navbar({ menus, session, mobileOpen = false, onToggleDrawer }: Props) {
  const getSession = useMemo(() => clientContainer.get<GetSession>(SYMBOLS.GetSession), []);
  const login = useMemo(() => clientContainer.get<Login>(SYMBOLS.Login), []);
  const logout = useMemo(() => clientContainer.get<Logout>(SYMBOLS.Logout), []);
  const serverSession = useMemo(
    () => (session ? SessionMapper.fromDtoToDomain(session) : undefined),
    [session],
  );
  const [clientSession, setClientSession] = useState<Session | null | undefined>(undefined);
  const parsedSession = clientSession === undefined ? serverSession : (clientSession ?? undefined);
  const [isCheckingSso, setIsCheckingSso] = useState(() => !serverSession && !hasCheckedSilentSso);
  const router = useRouter();
  const { mode, systemMode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (parsedSession || hasCheckedSilentSso) {
      return;
    }

    hasCheckedSilentSso = true;

    void (async () => {
      try {
        const loginResult = await login.execute(undefined, true);
        if (isRight(loginResult)) {
          const sessionResult = await getSession.execute();
          if (isRight(sessionResult)) {
            setClientSession(sessionResult.right);
          }
          router.refresh();
        }
      } finally {
        setIsCheckingSso(false);
      }
    })();
  }, [getSession, login, parsedSession, router]);

  const resolvedMode = mode === 'system' ? systemMode : mode;

  const handleToggleTheme = () => {
    setMode(resolvedMode === 'dark' ? 'light' : 'dark');
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = async () => {
    setAnchorEl(null);
    await login.execute(window.location.origin + window.location.pathname);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    setClientSession(null);
    await logout.execute();
    router.refresh();
  };

  return (
    <Box component="nav" className="flex items-center justify-end gap-2 md:ml-4 md:grow">
      <List dense={true} disablePadding={true} className="hidden items-center text-center md:flex">
        {menus &&
          menus.map((menu, i) => {
            if (menu.hasOwnProperty('path') || menu.hasOwnProperty('url')) {
              return <NavbarMenu key={i} menu={menu as PathMenu | UrlMenu} />;
            } else {
              return <NavbarDropdownMenu key={i} menu={menu as NestedMenu} />;
            }
          })}
      </List>

      <Tooltip title={resolvedMode === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}>
        <IconButton
          onClick={handleToggleTheme}
          aria-label="Toggle color scheme"
          size="small"
          className="hidden text-(--m3-palette-onSurfaceVariant-main) md:inline-flex"
        >
          {resolvedMode === 'dark' ? (
            <LightModeOutlined fontSize="small" />
          ) : (
            <DarkModeOutlined fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      {isCheckingSso ? (
        <Box className="p-1" aria-label="Loading account">
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      ) : (
        <>
          {!parsedSession && (
            <Button
              variant="filled"
              size="medium"
              startIcon={<LoginRounded fontSize="small" />}
              onClick={handleLogin}
              className="hidden md:inline-flex"
            >
              Sign In
            </Button>
          )}

          <IconButton
            onClick={handleClick}
            size="small"
            className={parsedSession ? 'p-1' : 'p-1 md:hidden'}
            aria-label="INFINITE Account"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              variant="circular"
              sizes="32px"
              src={parsedSession?.user.picture}
              alt={parsedSession?.user.name || 'User'}
              className="h-8 w-8"
            />
          </IconButton>
        </>
      )}

      <Popover
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        disableScrollLock
        keepMounted
        marginThreshold={0}
        slotProps={{
          paper: {
            elevation: 0,
            className:
              'max-w-[100%] min-w-[200px] w-[350px] p-4 mt-3 rounded-2xl drop-shadow-md max-[450px]:flex! max-[450px]:flex-col! max-[450px]:w-full! max-[450px]:right-0! max-[450px]:left-0! max-[450px]:top-0! max-[450px]:bottom-0! max-[450px]:m-0! max-[450px]:h-screen! max-[450px]:max-h-screen! max-[450px]:rounded-none! max-[450px]:py-12! max-[450px]:px-6!',
            sx: [
              (theme) => ({
                bgcolor: theme.vars?.palette.surfaceContainerHigh.main,
                '&::before': {
                  bgcolor: theme.vars?.palette.surfaceContainerHigh.main,
                },
              }),
              (theme) =>
                theme.applyStyles('dark', {
                  bgcolor: theme.vars?.palette.surfaceContainerHigh.main,
                  '&::before': {
                    bgcolor: theme.vars?.palette.surfaceContainerHigh.main,
                  },
                }),
            ],
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography variant="h5" className="px-4 text-center">
          Hi! {parsedSession?.user.name || 'Guest'}
        </Typography>

        {parsedSession && (
          <ClickableViewTile
            title="Profile"
            position="top"
            icon={<PersonRounded />}
            href="https://dash.infiniteuny.id/settings/profile"
            className="mt-6 md:rounded-2xl!"
            sx={{ bgcolor: 'surfaceContainer.main' }}
          />
        )}

        <ClickableViewTile
          title="Theme"
          position={parsedSession ? 'bottom' : 'single'}
          icon={resolvedMode === 'dark' ? <DarkModeOutlined /> : <LightModeOutlined />}
          trailingIcon={
            <Typography variant="body2" color="textSecondary">
              {resolvedMode === 'dark' ? 'Dark' : 'Light'}
            </Typography>
          }
          onClick={(e) => {
            e.stopPropagation();
            handleToggleTheme();
          }}
          className={`${parsedSession ? 'mt-1' : 'mt-6'} md:hidden!`}
          sx={{ bgcolor: 'surfaceContainer.main' }}
        />

        {parsedSession ? (
          <Button
            variant="tonal"
            fullWidth
            className="mt-4 max-[450px]:mt-auto!"
            size="large"
            startIcon={<LogoutRounded fontSize="small" />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="filled"
            fullWidth
            className="mt-4 max-[450px]:mt-auto!"
            size="large"
            startIcon={<LoginRounded fontSize="small" />}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        )}

        <IconButton
          onClick={handleClose}
          className="absolute top-2 right-2 hidden max-[450px]:block!"
          aria-label="Close"
        >
          <CloseRounded />
        </IconButton>
      </Popover>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={onToggleDrawer}
        slotProps={{
          paper: {
            className: 'w-72 bg-(--m3-palette-surfaceContainerLow-main) p-4',
          },
        }}
      >
        <Box className="mb-4 flex items-center justify-between">
          <InfiniteTextLogo
            width={130}
            height={40}
            className="fill-infinite-light-green dark:fill-infinite-dark-green block"
          />
          <IconButton onClick={onToggleDrawer} aria-label="Close navigation menu" size="small">
            <CloseRounded fontSize="small" />
          </IconButton>
        </Box>

        <Divider className="mb-2" />

        <List disablePadding className="flex flex-col gap-1">
          {menus &&
            menus.map((menu, i) => {
              if (menu.hasOwnProperty('path') || menu.hasOwnProperty('url')) {
                const isExternal = menu.hasOwnProperty('url');
                const href = menu.hasOwnProperty('path')
                  ? (menu as PathMenu).path
                  : (menu as UrlMenu).url;

                return (
                  <ListItemButton
                    key={i}
                    component={isExternal ? 'a' : Link}
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    onClick={onToggleDrawer}
                    className="rounded-full"
                  >
                    <ListItemText primary={menu.name} />
                  </ListItemButton>
                );
              }

              const nested = menu as NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>;
              return (
                <Box key={i} className="mt-2">
                  <Typography
                    variant="overline"
                    className="px-4 text-(--m3-palette-onSurfaceVariant-main)"
                  >
                    {nested.name}
                  </Typography>
                  {nested.items.map((sub, j) => {
                    const isExternal = sub.hasOwnProperty('url');
                    const href = sub.hasOwnProperty('path')
                      ? (sub as PathMenu).path
                      : (sub as UrlMenu).url;

                    return (
                      <ListItemButton
                        key={j}
                        component={isExternal ? 'a' : Link}
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        onClick={onToggleDrawer}
                        className="flex items-center justify-between rounded-full"
                      >
                        <ListItemText primary={sub.name} />
                        {isExternal ? <OpenInNewRounded sx={{ fontSize: 16 }} /> : null}
                      </ListItemButton>
                    );
                  })}
                </Box>
              );
            })}
        </List>
      </Drawer>
    </Box>
  );
}
