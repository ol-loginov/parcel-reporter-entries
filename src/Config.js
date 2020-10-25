import path from 'path';
import fs from 'fs';
import {createWriter, detectWriter, Writer} from "./Writer";

const PACKAGE_JSON_SECTION = "parcel-reporter-entries";

export class Config {
    writer: Writer

    constructor() {
        this.writer = createWriter(null);
    }

    loadFromPackageFolder(rootFolder: string) {
        const packageJson = fs.readFileSync(path.join(rootFolder, 'package.json')).toString();
        const packageInfo = JSON.parse(packageJson);
        const packageSection = packageInfo[PACKAGE_JSON_SECTION];
        if (!packageSection) {
            throw new Error(`no "${PACKAGE_JSON_SECTION}" section in package.json. Use no-rules config`);
        }

        const reportConfig = packageSection;
        if (!('file' in reportConfig)) {
            throw new Error(`Set "file" in report for ${PACKAGE_JSON_SECTION}`);
        }

        const file = path.resolve(rootFolder, reportConfig.file);
        let format = reportConfig.format || detectWriter(file);
        this.writer = createWriter(format, reportConfig);
        this.writer.file = file;
    }
}