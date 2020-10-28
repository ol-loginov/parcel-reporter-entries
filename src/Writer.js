import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

export class Writer {
    add(from: string, to: string): void {
    }
}

export class NullWriter extends Writer {
    add(from: string, to: string): void {
    }
}

export function detectWriter(file: string): string {
    if (file.endsWith('.properties')) return "properties";
    if (file.endsWith('.yml')) return "yml";
    return null;
}

export function createWriter(format: string, options = {}): Writer {
    if (!format) {
        format = '';
    }

    switch (format) {
        case 'properties':
            return new JavaPropertiesWriter(options);
        case 'yml':
            return new YmlWriter(options);
        default:
            return new NullWriter();
    }
}

class BaseWriter extends Writer {
    file: string;
    fileCreated: false;

    add(from: string, to: string): void {
        if (!this.fileCreated) {
            fs.mkdirSync(path.dirname(this.file), {recursive: true});
            fs.writeFileSync(this.file, "");
            this.createFile();
            this.fileCreated = true;
        }
        this.writeFile(from, to);
    }

    createFile() {
    }

    writeFile(from: string, to: string) {
    }
}


class JavaPropertiesWriter extends BaseWriter {
    writeFile(from: string, to: string) {
        fs.writeFileSync(this.file, `${from}=${to}`, {flag: 'a'});
    }
}

class YmlWriter extends BaseWriter {
    schema = undefined;
    schemaAppender = null;

    constructor(options: {}) {
        super();

        let parent = undefined;

        this.fromPrefix = this.getConfigStringValue(options, 'from-prefix', '');
        this.fromSuffix = this.getConfigStringValue(options, 'from-suffix', '');
        this.toPrefix = this.getConfigStringValue(options, 'to-prefix', '');
        this.toSuffix = this.getConfigStringValue(options, 'to-suffix', '');

        if (options['yml-write'] === 'array') {
            parent = [];

            const fromField = options['yml-array-from'] || 'from';
            const toField = options['yml-array-to'] || 'to';
            this.schemaAppender = (from, to) => {
                const pp = {};
                pp[fromField] = from;
                pp[toField] = to;
                parent.push(pp);
            };
        } else {
            parent = {};

            this.schemaAppender = (from, to) => {
                parent[from] = to;
            };
        }

        let container = parent;

        if (typeof options['yml-parent'] === 'string') {
            options['yml-parent'].split('/').reverse().forEach(key => {
                const previous = {};
                previous[key] = container;
                container = previous;
            })
        }

        this.schema = container;
    }

    getConfigStringValue(config, key, defaultString) {
        if (key in config) {
            return `${config[key]}`;
        }
        return defaultString;
    }

    writeFile(from: string, to: string) {
        this.schemaAppender(`${this.fromPrefix}${from}${this.fromSuffix}`, `${this.toPrefix}${to}${this.toSuffix}`);
        fs.writeFileSync(this.file, YAML.stringify(this.schema));
    }
}