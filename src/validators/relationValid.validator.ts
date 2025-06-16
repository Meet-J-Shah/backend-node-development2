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

@ValidatorConstraint({ async: false })
export class InverseSideValidConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const object: any = args.object;

    const targetEntity = entitiesMap[object.target];
    console.log('mj', targetEntity);
    if (!targetEntity || typeof value !== 'string') {
      console.log(object);
      return false;
    }

    const prototypeKeys = Object.keys(new targetEntity());
    console.log('protoKeys', prototypeKeys);
    return prototypeKeys.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    const object: any = args.object;
    return `Property '${args.value}' does not exist on entity '${object.target}'.`;
  }
}
