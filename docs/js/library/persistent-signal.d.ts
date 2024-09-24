import { Signal } from '@preact/signals';
import * as funtypes from 'funtypes';
export declare function persistSignalEffect<T extends funtypes.ParsedValue<funtypes.String, R>['config'], R>(cacheKey: string, derivedSignal: Signal<R>, funTypeParser: T, storage?: Storage): {
    error: Signal<string | undefined>;
};
//# sourceMappingURL=persistent-signal.d.ts.map