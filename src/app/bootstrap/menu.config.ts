import { Routes } from '@angular/router';
import { AppConfigService, MicroFrontConfigService } from '@common/context/config/app-config.service';
import { isAuthenticated } from '@common/context/authorization-access/guards/is-authenticated.guards';
import { MenuItem } from './layout/container/model/menu-item.model';

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
      path: 'sites',
      data: { label: 'Tenants', path: 'Access' },
      canActivate: [isAuthenticated],
      loadChildren: () =>
        import('@features/organization/site/routes/site-view-list-route/site-view-list-route.module').then(
          (m) => m.SiteViewListRouteModule,
        ),
    },
    {
      path: 'floors',
      data: { label: 'Tenants', path: 'Access' },
      canActivate: [isAuthenticated],
      loadChildren: () =>
        import('@features/organization/floor/routes/floor-view-list-route/floor-view-list-route.module').then(
          (m) => m.FloorViewListRouteModule,
        ),
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
      label: 'access',
      icon: 'badge',
      subItems: [
        {
          label: 'clients',
          icon: 'group',
          route: 'clients',
        },
        {
          label: 'sites',
          icon: 'domain',
          route: 'sites',
        },
        {
          label: 'floors',
          icon: 'domain',
          route: 'floors',
        },
      ],
    },
  ];
}
