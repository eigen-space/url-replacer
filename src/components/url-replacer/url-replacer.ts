import { AnyDictionary } from '@eigenspace/common-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryValue = any;
// eslint-disable-next-line
type Matcher = (match: string, ...args: any[]) => string;
export class UrlReplacer {

    process(url: string, params: AnyDictionary = {}): string {
        const sanitized = url.replace(/([^?&=]+)=:([a-zA-Z]+)/g, this.processNamedStatement(params))
            .replace(/([^=]):([a-zA-Z]+)/g, this.processUnnamedStatement(params))
            .replace(/[a-zA-Z_-]*=&/g, '')
            .replace(/[?&]?[a-zA-Z_-]*=$/g, '');

        return decodeURIComponent(sanitized);
    }

    private processNamedStatement(urlParams: AnyDictionary): Matcher {
        return (_: string, key: string, templateParam: string): string => {
            const param = urlParams[templateParam];
            const normalized = Array.isArray(param) ? param : [param];
            return normalized.map(item => `${key}=${this.sanitizeQueryValue(item)}`)
                .join('&');
        };
    }

    private processUnnamedStatement(urlParams: AnyDictionary): Matcher {
        return (_: string, prevSymbol: string, templateParam: string): string => {
            return `${prevSymbol}${this.sanitizeQueryValue(urlParams[templateParam])}`;
        };
    }

    // noinspection JSMethodCanBeStatic
    private sanitizeQueryValue(param: QueryValue): QueryValue {
        if (param == null) {
            return '';
        }

        if (typeof param !== 'string') {
            return param;
        }

        return encodeURIComponent(param);
    }
}
