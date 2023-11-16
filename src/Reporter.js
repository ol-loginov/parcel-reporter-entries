//@flow
import {Reporter} from '@parcel/plugin';
import {Config} from "./Config";
import {PluginLogger} from '@parcel/logger';
import path from 'path';

// noinspection JSUnusedGlobalSymbols
export default new Reporter({
    writer: null,
    assetRoot: null,

    async report(opts: { event: { type: string }, options: PluginOptions, logger: PluginLogger }) {
        if (opts.event.type === 'buildSuccess' && opts.event.bundleGraph) {
            this.ensureConfig(opts.options.projectRoot, opts.options.packageManager, opts.logger);
            if (!this.writer) {
                opts.logger.warn({message: "no writer, skip out"});
                return;
            }

            const bundleGraph = opts.event.bundleGraph;
            bundleGraph.getBundles()
                .forEach(bundle => {
                    const target = bundle.target;
                    const targetFile = path.relative(target.distDir, bundle.filePath);

                    bundle.getEntryAssets().forEach(asset => {
                        let assetRoot = bundleGraph.getEntryRoot(target);
                        if (this.assetRoot) {
                            assetRoot = path.resolve(opts.options.projectRoot, this.assetRoot || '.');
                        }
                        const sourceFile = path.relative(assetRoot, asset.filePath);
                        this.writer.add(sourceFile, (target.publicUrl || '/') + targetFile);
                    })
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
            this.assetRoot = config.assetRoot;
        }
    },

    rewrite(bundle: { id: string }, options: {}, superName: string) {
        this.writer.add(superName, rewrite);
    }
});
