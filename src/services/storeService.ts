import fs from "fs";
import path from "path";
import { homedir } from "os";
import { promisify } from "util";

const STORE_FOLDER = path.join(homedir(), ".timetracker");

export default class Storage {
  private storageLoaded: Promise<boolean>;

  constructor() {
    this.storageLoaded = this.checkForFolder().then(() => {
      return true;
    });
  }

  write(
    identifier: string,
    dataSet:
      | Record<string, unknown>
      | Record<string, unknown>[]
      | string[]
      | number[]
  ) {
    const cleanIdentifier = this.clean(identifier);
    const asyncWrite = promisify(fs.writeFile);
    const jsonifiedData = JSON.stringify(dataSet);
    const buf = Buffer.from(jsonifiedData);
    return asyncWrite(path.join(STORE_FOLDER, cleanIdentifier), buf);
  }

  async read(
    identifier: string
  ): Promise<
    Record<string, unknown> | Record<string, unknown>[] | string[] | number[]
  > {
    const cleanIdentifier = this.clean(identifier);
    const asyncRead = promisify(fs.readFile);
    const readData = await asyncRead(path.join(STORE_FOLDER, cleanIdentifier));
    try {
      const returnData: Record<string, unknown> = JSON.parse(
        readData.toString("utf-8")
      );
      return returnData;
    } catch (error) {
      console.error("Error reading data from disk", error);
      return {};
    }
  }

  private clean(string: string) {
    return string.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  }

  private async checkForFolder() {
    const asyncMkdir = promisify(fs.mkdir);
    try {
      await asyncMkdir(path.dirname(STORE_FOLDER), { recursive: true });
    } catch (err) {
      console.error(err);
      throw new Error("Creating storage folder failed. Exiting.");
    }
  }
}
