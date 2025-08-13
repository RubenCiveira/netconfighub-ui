import { Routes } from '@angular/router';
import { AppConfigService, MicroFrontConfigService } from '@common/context/config/app-config.service';
import { isAuthenticated } from '@common/context/authorization-access/guards/is-authenticated.guards';
import { MenuItem } from './layout/container/model/menu-item.model';
import { PendingOperationsComponent } from '@features/installations/operation/pending-operations/pending-operations.component';
import { InstallOperationsComponent } from '@features/installations/operation/install-operations/install-operations.component';
import { HistoryOperationsComponent } from '@features/installations/operation/history-operations/history-operations.component';

export function menuRoutes(_appConfig: AppConfigService, _mfeConfig: MicroFrontConfigService): Routes {
  return [
    {
      path: 'clients',
      data: { label: 'Tenants', path: 'Access' },
      canActivate: [isAuthenticated],
      loadChildren: () =>
        import('@features/organization/client/routes/client-view-list-route/client-view-list-route.module').then(
          (m) => m.ClientViewListRouteModule,
        ),
    },
    {
      path: 'vendors',
      data: { label: 'Tenants', path: 'Access' },
      canActivate: [isAuthenticated],
      loadChildren: () =>
        import('@features/infrastructure/vendor/routes/vendor-view-list-route/vendor-view-list-route.module').then(
          (m) => m.VendorViewListRouteModule,
        ),
    },
    {
      path: 'types',
      data: { label: 'Tenants', path: 'Access' },
      canActivate: [isAuthenticated],
      loadChildren: () =>
        import('@features/infrastructure/type/routes/type-view-list-route/type-view-list-route.module').then(
          (m) => m.TypeViewListRouteModule,
        ),
    },
    {
      path: 'configs',
      data: { label: 'Tenants', path: 'Access' },
      canActivate: [isAuthenticated],
      loadChildren: () =>
        import(
          '@features/infrastructure/config-template/routes/config-template-view-list-route/config-template-view-list-route.module'
        ).then((m) => m.ConfigTemplateViewListRouteModule),
    },
    {
      path: 'projects',
      data: { label: 'Tenants', path: 'Access' },
      canActivate: [isAuthenticated],
      loadChildren: () =>
        import('@features/installations/project/routes/project-view-list-route/project-view-list-route.module').then(
          (m) => m.ProjectViewListRouteModule,
        ),
    },
    {
      path: 'pending-operations',
      data: { label: 'Tenants', path: 'Access' },
      canActivate: [isAuthenticated],
      component: PendingOperationsComponent,
    },
    {
      path: 'operations-history',
      data: { label: 'Tenants', path: 'Access' },
      canActivate: [isAuthenticated],
      component: HistoryOperationsComponent,
    },

    // {
    //   path: 'info',
    //   loadChildren: () =>
    //     import(
    //       '../../../features/actuator/info/info.routing.module'
    //     ).then((m) => m.InfoRoutingModule),
    // }
  ];
}

// Este será el menú.
export function menu(): MenuItem[] {
  return [
    {
      label: 'configuracion',
      icon: 'badge',
      subItems: [
        {
          label: 'clients',
          icon: 'group',
          route: 'clients',
        },
        {
          label: 'vendors',
          icon: 'domain',
          route: 'vendors',
        },
        {
          label: 'types',
          icon: 'domain',
          route: 'types',
        },
        {
          label: 'configs',
          icon: 'domain',
          route: 'configs',
        },
      ],
    },
    {
      label: 'operativa',
      icon: 'badge',
      subItems: [
        {
          label: 'projects',
          icon: 'group',
          route: 'projects',
        },
        {
          label: 'Pending instalations',
          icon: 'group',
          route: 'pending-operations',
        },
        {
          label: 'History instalations',
          icon: 'group',
          route: 'operations-history',
        },
      ],
    },
  ];
}
