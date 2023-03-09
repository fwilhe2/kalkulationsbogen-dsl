import { ValidationAcceptor, ValidationChecks } from 'langium';
import { KalkulationsbogenAstType, Person } from './generated/ast';
import type { KalkulationsbogenServices } from './kalkulationsbogen-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: KalkulationsbogenServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.KalkulationsbogenValidator;
    const checks: ValidationChecks<KalkulationsbogenAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class KalkulationsbogenValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
