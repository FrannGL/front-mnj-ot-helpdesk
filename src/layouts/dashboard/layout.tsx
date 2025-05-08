'use client';

import type { Task } from 'src/types/interfaces';
import type { SettingsState } from 'src/components/settings';
import type { NavSectionProps } from 'src/components/nav-section';
import type { Theme, SxProps, CSSObject, Breakpoint } from '@mui/material/styles';

import { useMemo } from 'react';

import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { _contacts } from 'src/_mock';
import { varAlpha, stylesMode } from 'src/theme/styles';

import { bulletColor } from 'src/components/nav-section';
import { useSettingsContext } from 'src/components/settings';

import { TaskStatus, TaskPriority } from 'src/types/enums';

import { Main } from './main';
import { NavMobile } from './nav-mobile';
import { layoutClasses } from '../classes';
import { NavVertical } from './nav-vertical';
import { NavHorizontal } from './nav-horizontal';
import { _account } from '../config-nav-account';
import { HeaderBase } from '../core/header-base';
import { _workspaces } from '../config-nav-workspace';
import { LayoutSection } from '../core/layout-section';
import { navData as dashboardNavData } from '../config-nav-dashboard';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  data?: {
    nav?: NavSectionProps['data'];
  };
};

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Error al iniciar sesión',
    description: 'El cliente no puede acceder con sus credenciales.',
    status: TaskStatus.PENDIENTE,
    createdAt: '2025-05-01T09:00:00Z',
    closedAt: null,
    priority: TaskPriority.MEDIA,
    createdBy: 'cliente_123',
    assignedTo: 'agente_soporte_01',
  },
  {
    id: '2',
    title: 'Pago no registrado',
    description: 'El cliente reporta que su pago no aparece en la cuenta.',
    status: TaskStatus.PENDIENTE,
    createdAt: '2025-05-02T14:30:00Z',
    closedAt: null,
    priority: TaskPriority.ALTA,
    createdBy: 'cliente_456',
    assignedTo: 'agente_soporte_02',
  },
  {
    id: '3',
    title: 'Error 404 en el panel',
    description: 'Al acceder a la configuración aparece un error 404.',
    status: TaskStatus.PENDIENTE,
    createdAt: '2025-04-30T12:10:00Z',
    closedAt: '2025-05-01T08:00:00Z',
    priority: TaskPriority.MEDIA,
    createdBy: 'cliente_789',
    assignedTo: 'agente_soporte_03',
  },
  {
    id: '4',
    title: 'Solicitud de cambio de plan',
    description: 'El cliente desea cambiar su suscripción a un plan premium.',
    status: TaskStatus.PENDIENTE,
    createdAt: '2025-05-03T10:00:00Z',
    closedAt: null,
    priority: TaskPriority.ALTA,
    createdBy: 'cliente_234',
    assignedTo: 'agente_soporte_02',
  },
  {
    id: '5',
    title: 'Problemas con facturación',
    description: 'Facturas duplicadas en el sistema.',
    status: TaskStatus['EN PROCESO'],
    createdAt: '2025-05-01T17:45:00Z',
    closedAt: null,
    priority: TaskPriority.MEDIA,
    createdBy: 'cliente_321',
    assignedTo: 'agente_soporte_01',
  },
  {
    id: '6',
    title: 'No recibe correos',
    description: 'El sistema no envía correos de confirmación.',
    status: TaskStatus['EN PROCESO'],
    createdAt: '2025-04-28T08:30:00Z',
    closedAt: '2025-04-29T16:00:00Z',
    priority: TaskPriority.ALTA,
    createdBy: 'cliente_678',
    assignedTo: 'agente_soporte_03',
  },
  {
    id: '7',
    title: 'Actualización fallida',
    description: 'El sistema dejó de funcionar tras una actualización.',
    status: TaskStatus['EN PROCESO'],
    createdAt: '2025-05-04T13:20:00Z',
    closedAt: null,
    priority: TaskPriority.MEDIA,
    createdBy: 'cliente_987',
    assignedTo: 'agente_soporte_04',
  },
  {
    id: '8',
    title: 'Problema con integración',
    description: 'La integración con Zapier falla en los triggers.',
    status: TaskStatus['EN PROCESO'],
    createdAt: '2025-05-01T11:00:00Z',
    closedAt: null,
    priority: TaskPriority.BAJA,
    createdBy: 'cliente_654',
    assignedTo: 'agente_soporte_02',
  },
  {
    id: '9',
    title: 'Consulta sobre uso de API',
    description: 'Solicita ejemplos de uso para autenticar con la API.',
    status: TaskStatus.RESUELTO,
    createdAt: '2025-04-27T15:45:00Z',
    closedAt: '2025-04-28T10:15:00Z',
    priority: TaskPriority.CRITICA,
    createdBy: 'cliente_159',
    assignedTo: 'agente_soporte_05',
  },
  {
    id: '10',
    title: 'Problemas de rendimiento',
    description: 'El sistema se ralentiza durante horas pico.',
    status: TaskStatus.RESUELTO,
    createdAt: '2025-05-05T08:00:00Z',
    closedAt: null,
    priority: TaskPriority.BAJA,
    createdBy: 'cliente_753',
    assignedTo: 'agente_soporte_01',
  },
  {
    id: '11',
    title: 'Duplicación de usuarios',
    description: 'Aparecen usuarios duplicados en el dashboard.',
    status: TaskStatus.RESUELTO,
    createdAt: '2025-05-02T09:20:00Z',
    closedAt: null,
    priority: TaskPriority.CRITICA,
    createdBy: 'cliente_852',
    assignedTo: 'agente_soporte_04',
  },
  {
    id: '12',
    title: 'Reintegro solicitado',
    description: 'El cliente pide reintegro por cargo indebido.',
    status: TaskStatus.RESUELTO,
    createdAt: '2025-05-03T17:00:00Z',
    closedAt: null,
    priority: TaskPriority.BAJA,
    createdBy: 'cliente_951',
    assignedTo: 'agente_soporte_02',
  },
  {
    id: '13',
    title: 'Consulta por características del producto',
    description: 'El cliente pide información de nuevas funciones.',
    status: TaskStatus.RESUELTO,
    createdAt: '2025-04-26T16:00:00Z',
    closedAt: '2025-04-27T12:00:00Z',
    priority: TaskPriority.CRITICA,
    createdBy: 'cliente_357',
    assignedTo: 'agente_soporte_03',
  },
  {
    id: '14',
    title: 'No puede cancelar suscripción',
    description: 'El botón de cancelar no funciona.',
    status: TaskStatus.RESUELTO,
    createdAt: '2025-05-04T11:30:00Z',
    closedAt: null,
    priority: TaskPriority.BAJA,
    createdBy: 'cliente_753',
    assignedTo: 'agente_soporte_01',
  },
  {
    id: '15',
    title: 'Problemas con descarga de archivos',
    description: 'Archivos adjuntos no se descargan correctamente.',
    status: TaskStatus.CANCELADO,
    createdAt: '2025-05-01T13:45:00Z',
    closedAt: null,
    priority: TaskPriority.CRITICA,
    createdBy: 'cliente_468',
    assignedTo: 'agente_soporte_05',
  },
  {
    id: '16',
    title: 'Consulta por facturación mensual',
    description: 'Solicita factura de meses anteriores.',
    status: TaskStatus.CANCELADO,
    createdAt: '2025-04-25T14:30:00Z',
    closedAt: '2025-04-26T09:15:00Z',
    priority: TaskPriority.BAJA,
    createdBy: 'cliente_963',
    assignedTo: 'agente_soporte_04',
  },
  {
    id: '17',
    title: 'Ticket duplicado',
    description: 'Ticket creado dos veces por error.',
    status: TaskStatus.CANCELADO,
    createdAt: '2025-05-03T10:10:00Z',
    closedAt: '2025-05-03T12:30:00Z',
    priority: TaskPriority.MEDIA,
    createdBy: 'cliente_214',
    assignedTo: 'agente_soporte_02',
  },
  {
    id: '18',
    title: 'Solicitud de reenvío de correo de activación',
    description: 'El cliente no recibió el correo de activación.',
    status: TaskStatus.CANCELADO,
    createdAt: '2025-04-30T07:45:00Z',
    closedAt: '2025-04-30T09:00:00Z',
    priority: TaskPriority.MEDIA,
    createdBy: 'cliente_342',
    assignedTo: 'agente_soporte_03',
  },
  {
    id: '19',
    title: 'Problema con login usando SSO',
    description: 'El cliente no puede iniciar sesión con SSO.',
    status: TaskStatus['EN PROCESO'],
    createdAt: '2025-05-05T13:00:00Z',
    closedAt: null,
    priority: TaskPriority.MEDIA,
    createdBy: 'cliente_111',
    assignedTo: 'agente_soporte_01',
  },
  {
    id: '20',
    title: 'Cambiar correo asociado a cuenta',
    description: 'Solicita cambiar el email registrado.',
    status: TaskStatus.PENDIENTE,
    createdAt: '2025-05-06T10:15:00Z',
    closedAt: null,
    priority: TaskPriority.BAJA,
    createdBy: 'cliente_212',
    assignedTo: 'agente_soporte_05',
  },
];

export function DashboardLayout({ sx, children, data }: DashboardLayoutProps) {
  const theme = useTheme();

  const mobileNavOpen = useBoolean();

  const settings = useSettingsContext();

  const navColorVars = useNavColorVars(theme, settings);

  const layoutQuery: Breakpoint = 'lg';

  const navData = data?.nav ?? dashboardNavData;

  const isNavMini = settings.navLayout === 'mini';

  const isNavHorizontal = settings.navLayout === 'horizontal';

  const isNavVertical = isNavMini || settings.navLayout === 'vertical';

  return (
    <>
      <NavMobile
        tasks={mockTasks}
        isNavMini={isNavMini}
        data={[]}
        open={mobileNavOpen.value}
        onClose={mobileNavOpen.onFalse}
        cssVars={navColorVars.section}
      />

      <LayoutSection
        /** **************************************
         * Header
         *************************************** */
        headerSection={
          <HeaderBase
            layoutQuery={layoutQuery}
            disableElevation={isNavVertical}
            onOpenNav={mobileNavOpen.onTrue}
            data={{
              nav: navData,
              langs: [
                { value: 'en', label: 'English', countryCode: 'GB' },
                { value: 'fr', label: 'French', countryCode: 'FR' },
                { value: 'vi', label: 'Vietnamese', countryCode: 'VN' },
                { value: 'cn', label: 'Chinese', countryCode: 'CN' },
                { value: 'ar', label: 'Arabic', countryCode: 'SA' },
              ],
              account: _account,
              contacts: _contacts,
              workspaces: _workspaces,
              // notifications: _notifications,
            }}
            slotsDisplay={{
              signIn: false,
              purchase: false,
              helpLink: false,
            }}
            slots={{
              topArea: (
                <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                  This is an info Alert.
                </Alert>
              ),
              bottomArea: isNavHorizontal ? (
                <NavHorizontal
                  data={navData}
                  layoutQuery={layoutQuery}
                  cssVars={navColorVars.section}
                />
              ) : null,
            }}
            slotProps={{
              toolbar: {
                sx: {
                  [`& [data-slot="logo"]`]: {
                    display: 'none',
                  },
                  [`& [data-area="right"]`]: {
                    gap: { xs: 0, sm: 0.75 },
                  },
                  ...(isNavHorizontal && {
                    bgcolor: 'var(--layout-nav-bg)',
                    [`& .${iconButtonClasses.root}`]: {
                      color: 'var(--layout-nav-text-secondary-color)',
                    },
                    [theme.breakpoints.up(layoutQuery)]: {
                      height: 'var(--layout-nav-horizontal-height)',
                    },
                    [`& [data-slot="workspaces"]`]: {
                      color: 'var(--layout-nav-text-primary-color)',
                    },
                    [`& [data-slot="logo"]`]: {
                      display: 'none',
                      [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
                    },
                    [`& [data-slot="divider"]`]: {
                      [theme.breakpoints.up(layoutQuery)]: {
                        display: 'flex',
                      },
                    },
                  }),
                },
              },
              container: {
                maxWidth: false,
                sx: {
                  ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
                },
              },
            }}
          />
        }
        /** **************************************
         * Sidebar
         *************************************** */
        sidebarSection={
          isNavHorizontal ? null : (
            <NavVertical
              data={[]}
              tasks={mockTasks}
              isNavMini={isNavMini}
              layoutQuery={layoutQuery}
              cssVars={navColorVars.section}
              onToggleNav={() =>
                settings.onUpdateField(
                  'navLayout',
                  settings.navLayout === 'vertical' ? 'mini' : 'vertical'
                )
              }
            />
          )
        }
        /** **************************************
         * Footer
         *************************************** */
        footerSection={null}
        /** **************************************
         * Style
         *************************************** */
        cssVars={{
          ...navColorVars.layout,
          '--layout-transition-easing': 'linear',
          '--layout-transition-duration': '120ms',
          '--layout-nav-mini-width': '75px',
          '--layout-nav-vertical-width': '300px',
          '--layout-nav-horizontal-height': '64px',
          '--layout-dashboard-content-pt': theme.spacing(1),
          '--layout-dashboard-content-pb': theme.spacing(8),
          '--layout-dashboard-content-px': theme.spacing(5),
        }}
        sx={{
          [`& .${layoutClasses.hasSidebar}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
              pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
            },
          },
          ...sx,
        }}
      >
        <Main isNavHorizontal={isNavHorizontal}>{children}</Main>
      </LayoutSection>
    </>
  );
}

// ----------------------------------------------------------------------

function useNavColorVars(
  theme: Theme,
  settings: SettingsState
): Record<'layout' | 'section', CSSObject> {
  const {
    vars: { palette },
  } = theme;

  return useMemo(() => {
    switch (settings.navColor) {
      case 'integrate':
        return {
          layout: {
            '--layout-nav-bg': palette.background.default,
            '--layout-nav-horizontal-bg': varAlpha(palette.background.defaultChannel, 0.8),
            '--layout-nav-border-color': varAlpha(palette.grey['500Channel'], 0.12),
            '--layout-nav-text-primary-color': palette.text.primary,
            '--layout-nav-text-secondary-color': palette.text.secondary,
            '--layout-nav-text-disabled-color': palette.text.disabled,
            [stylesMode.dark]: {
              '--layout-nav-border-color': varAlpha(palette.grey['500Channel'], 0.08),
              '--layout-nav-horizontal-bg': varAlpha(palette.background.defaultChannel, 0.96),
            },
          },
          section: {},
        };
      case 'apparent':
        return {
          layout: {
            '--layout-nav-bg': palette.grey[900],
            '--layout-nav-horizontal-bg': varAlpha(palette.grey['900Channel'], 0.96),
            '--layout-nav-border-color': 'transparent',
            '--layout-nav-text-primary-color': palette.common.white,
            '--layout-nav-text-secondary-color': palette.grey[500],
            '--layout-nav-text-disabled-color': palette.grey[600],
            [stylesMode.dark]: {
              '--layout-nav-bg': palette.grey[800],
              '--layout-nav-horizontal-bg': varAlpha(palette.grey['800Channel'], 0.8),
            },
          },
          section: {
            // caption
            '--nav-item-caption-color': palette.grey[600],
            // subheader
            '--nav-subheader-color': palette.grey[600],
            '--nav-subheader-hover-color': palette.common.white,
            // item
            '--nav-item-color': palette.grey[500],
            '--nav-item-root-active-color': palette.primary.light,
            '--nav-item-root-open-color': palette.common.white,
            // bullet
            '--nav-bullet-light-color': bulletColor.dark,
            // sub
            ...(settings.navLayout === 'vertical' && {
              '--nav-item-sub-active-color': palette.common.white,
              '--nav-item-sub-open-color': palette.common.white,
            }),
          },
        };
      default:
        throw new Error(`Invalid color: ${settings.navColor}`);
    }
  }, [
    palette.background.default,
    palette.background.defaultChannel,
    palette.common.white,
    palette.grey,
    palette.primary.light,
    palette.text.disabled,
    palette.text.primary,
    palette.text.secondary,
    settings.navColor,
    settings.navLayout,
  ]);
}
