import {
    createDefaultModule, createDefaultSharedModule, DefaultSharedModuleContext, inject,
    LangiumServices, LangiumSharedServices, Module, PartialLangiumServices
} from 'langium';
import { KalkulationsbogenGeneratedModule, KalkulationsbogenGeneratedSharedModule } from './generated/module';
import { KalkulationsbogenValidator, registerValidationChecks } from './kalkulationsbogen-validator';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type KalkulationsbogenAddedServices = {
    validation: {
        KalkulationsbogenValidator: KalkulationsbogenValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type KalkulationsbogenServices = LangiumServices & KalkulationsbogenAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const KalkulationsbogenModule: Module<KalkulationsbogenServices, PartialLangiumServices & KalkulationsbogenAddedServices> = {
    validation: {
        KalkulationsbogenValidator: () => new KalkulationsbogenValidator()
    }
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createKalkulationsbogenServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    Kalkulationsbogen: KalkulationsbogenServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        KalkulationsbogenGeneratedSharedModule
    );
    const Kalkulationsbogen = inject(
        createDefaultModule({ shared }),
        KalkulationsbogenGeneratedModule,
        KalkulationsbogenModule
    );
    shared.ServiceRegistry.register(Kalkulationsbogen);
    registerValidationChecks(Kalkulationsbogen);
    return { shared, Kalkulationsbogen };
}
