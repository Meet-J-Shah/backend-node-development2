// decorators/relation-valid.decorator.ts

import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  RelationTargetValidConstraint,
  InverseSideValidConstraint,
} from '../validators/relationValid.validator';

export function IsValidEntityTarget(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidEntityTarget',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: RelationTargetValidConstraint,
    });
  };
}

export function IsValidInverseSide(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidInverseSide',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: InverseSideValidConstraint,
    });
  };
}
