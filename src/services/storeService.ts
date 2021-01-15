import fs from "fs";
import path from "path";
import { homedir } from "os";
import { promisify } from "util";

import Datastore from "nedb";

const STORE_FILENAME = path.join(homedir(), ".timetracker", "store.nedb");

export default class Storage {
  private store: Datastore;

  constructor() {
    this.checkForFolder().then(() => {
      this.store = new Datastore({
        filename: STORE_FILENAME,
        autoload: true,
      });
    });
  }

  insert(data) {
    return new Promise((res, rej) => {
      this.store.insert(data, (err, newDoc) => {
        if (err) {
          return rej(err);
        }
        res(newDoc);
      });
    });
  }

  find(query, projection = {}) {
    return new Promise((res, rej) => {
      this.store.find(query, projection, (err, docs) => {
        if (err) {
          return rej(err);
        }
        res(docs);
      });
    });
  }

  count(query, projection = {}) {
    return new Promise((res, rej) => {
      this.store.count(query, (err, count) => {
        if (err) {
          return rej(err);
        }
        res(count);
      });
    });
  }

  async checkForFolder() {
    const asyncMkdir = promisify(fs.mkdir);
    try {
      await asyncMkdir(path.dirname(STORE_FILENAME), { recursive: true });
    } catch (err) {
      console.error(err);
    }
  }
}
