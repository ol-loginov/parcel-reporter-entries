import {Reporter} from '@parcel/plugin';
import {Config} from "./Config";
import {PluginLogger} from '@parcel/logger';
import path from 'path';

// noinspection JSUnusedGlobalSymbols
export default new Reporter({
    writer: null,

    async report(opts: { event: { type: string }, options: PluginOptions, logger: PluginLogger }) {
        if (opts.event.type === 'buildSuccess' && opts.event.bundleGraph) {
            this.ensureConfig(opts.options.projectRoot, opts.options.packageManager, opts.logger);
            if (!this.writer) {
                return;
            }

            const entryRoot = opts.options.entryRoot;
            const distDir = opts.options.distDir;

            opts.event.bundleGraph.getBundles()
                .filter(bundle => bundle.isEntry)
                .forEach(bundle => {
                    const to = path.relative(distDir, bundle.filePath);

                    bundle.getEntryAssets().forEach(asset => {
                        const from = path.relative(entryRoot, asset.filePath);
                        this.writer.add(from, to);
                    });
                });
        }
    },

    ensureConfig(projectRoot: string, packageManager: {}, logger: PluginLogger) {
        if (!this.writer) {
            const config = new Config();
            config.loadFromPackageFolder(projectRoot, logger);
            if (!config.writer) {
                throw Error('No writer spec has been found in project. Set package.json#parcel-reporter-entries to configure');
            }
            this.writer = config.writer;
        }
    },

    rewrite(bundle: { id: string }, options: {}, superName: string) {
        this.writer.add(superName, rewrite);
    }
});
