import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

import { PermissionAuthGuard } from '../guards/permissionAuth.guard';

/**
 * DECORATOR: set permission decorate
 */
export const PermissionDecorator = (permission: string) => {
  // TODO: update decoratorPermissionKey with dynamically value
  // const configService = new ConfigService();
  // const decoratorPermissionKey = configService.get<string>(
  //   'api.decoratorPermissionKey',
  // );
  const decoratorPermissionKey: string = 'permission';
  return applyDecorators(
    SetMetadata(decoratorPermissionKey, permission),
    UseGuards(PermissionAuthGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
