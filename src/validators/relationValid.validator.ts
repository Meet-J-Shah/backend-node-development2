// validators/relation-valid.validator.ts

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import entitiesArray from '../configs/entity.config'; // path to your loaded entity classes

const entitiesMap = Object.fromEntries(entitiesArray.map((e) => [e.name, e]));

@ValidatorConstraint({ async: false })
export class RelationTargetValidConstraint
  implements ValidatorConstraintInterface
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, args: ValidationArguments) {
    return !!entitiesMap[value];
  }

  defaultMessage(args: ValidationArguments) {
    return `Target entity '${args.value}' does not exist.`;
  }
}

// @ValidatorConstraint({ async: false })
// export class InverseSideValidConstraint
//   implements ValidatorConstraintInterface
// {
//   validate(value: any, args: ValidationArguments) {
//     const object: any = args.object;

//     const targetEntity = entitiesMap[object.target];
//     console.log(args.value, 'mj', targetEntity);
//     if (!targetEntity || typeof value !== 'string') {
//       console.log(args.value, 'not a string:', object);
//       return false;
//     }

//     const prototypeKeys = Object.keys(new targetEntity());
//     console.log(args.value, 'protoKeys', prototypeKeys);
//     return prototypeKeys.includes(value);
//   }

//   defaultMessage(args: ValidationArguments) {
//     const object: any = args.object;
//     return `Property '${args.value}' does not exist on entity '${object.target}'. ${args},dff,`;
//   }
// }
import { Logger } from '@nestjs/common';

@ValidatorConstraint({ async: false })
export class InverseSideValidConstraint
  implements ValidatorConstraintInterface
{
  private readonly logger = new Logger(InverseSideValidConstraint.name);

  validate(value: any, args: ValidationArguments) {
    const object: any = args.object;

    const targetEntity = entitiesMap[object.target];
    const selectFields = (targetEntity as any)?.selectFields;

    this.logger.debug(`${value} mj ${targetEntity?.name || 'undefined'}`);

    if (!selectFields || typeof value !== 'string') {
      this.logger.warn(
        `${value} not a string or no selectFields: ${JSON.stringify(object)}`,
      );
      return false;
    }

    // Use the recursive key collector from earlier:
    const validKeys = getFieldPaths(selectFields);
    this.logger.debug(`${value} validKeys: ${validKeys.join(', ')}`);

    return validKeys.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    const object: any = args.object;
    return `Property '${args.value}' does not exist on entity '${object.target}'.`;
  }
}

function getFieldPaths(obj: Record<string, any>, prefix = ''): string[] {
  const result: string[] = [];

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const fullPath = prefix ? `${prefix}.${key}` : key;

    if (value === true) {
      result.push(fullPath);
      // } else if (typeof value === 'object' && value !== null) {
      //   result.push(...getFieldPaths(value, fullPath));
    }
  }

  return result;
}
