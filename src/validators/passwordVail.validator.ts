import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'DynamicPasswordValidator', async: false })
export class DynamicPasswordValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const obj = args.object as any;

    if (typeof value !== 'string') return false;

    const min = obj.minLength ?? 8;
    const max = obj.maxLength ?? 15;
    if (value.length < min || value.length > max) return false;

    // Always required
    const lowercase = /[a-z]/.test(value);
    const uppercase = /[A-Z]/.test(value);

    if (!lowercase || !uppercase) return false;

    // Optional checks
    if (obj.Numeric !== false && !/\d/.test(value)) return false;
    if (obj.specialCharaters !== false && !/[@$!%*#?&]/.test(value))
      return false;

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const obj = args.object as any;
    const parts = [
      `between ${obj.minLength ?? 8}-${obj.maxLength ?? 15} characters`,
      `one lowercase`,
      `one uppercase`,
    ];

    if (obj.Numeric !== false) parts.push('one number');
    if (obj.specialCharaters !== false) parts.push('one special character');

    return `Password must contain ${parts.join(', ')}`;
  }
}
