const fs = require('fs');
const util = require('util');

const readDir = util.promisify(fs.readdir);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const stat = util.promisify(fs.stat);
const { join } = require('path');

/**
 * FileLoader loads files from folders that export an instance or extension of the given class.
 * @namespace
 * @since v0.0.1
 */
class FileLoader {
  constructor(client, root) {
    /**
     * The client that instantiated this loader.
     * @name FileLoader#client
     * @type {ChopClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
    /**
     * Path to the root directory Chop will look for commands, tasks, etc...
     * If not set, Chop will use the directory where the client was instantiated.
     * @name FileLoader#root
     * @type {String}
     * @readonly
     */
    Object.defineProperty(this, 'root', { value: root || require.main.path });
  }

  loadDirectorySync({ dir, importClass: ImportClass, makeDir = true }) {
    const result = [];
    const dirPath = join(this.root, dir);
    try {
      if (makeDir && !fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        return [];
      }
      const files = this.readDirectorySync(dirPath);
      try {
        // eslint-disable-next-line global-require
        const requires = files.map(t => require(t.replace(__dirname, './')));
        requires.forEach((Imported, i) => {
          // check if Imported is a instance of ImportClass or a class that extends ImportClass
          const isInstance = Imported instanceof ImportClass;
          if (isInstance) {
            Imported.client = this.client;
            result.push(Imported);
          } else if (!isInstance && Imported.prototype instanceof ImportClass) {
            const newInstance = new Imported();
            newInstance.client = this.client;
            result.push(newInstance);
          } else {
            // console.warn('error', `Invalid ${ImportClass.name}: ${files[i]}`);
          }
        });
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      return result;
    }
    return result;
  }

  readDirectorySync(dir) {
    const extExp = /\.(js|ts)$/;
    const ignoreExp = /^_/;
    return fs
      .readdirSync(dir)
      .reduce((files, file) => {
        const name = join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        const ignore = ignoreExp.test(file);
        if (isDirectory) {
          return [...files, ...this.readDirectorySync(name)];
        }
        return ignore || !extExp.test(file) ? [...files] : [...files, name];
      }, [])
      .map(filePath => filePath.replace('.ts', ''));
  }

  async readDirectory(dir) {
    const extExp = /\.(js|ts)$/;
    const ignoreExp = /^_/;
    const dirContents = await readDir(dir);
    return dirContents
      .reduce(async (files, file) => {
        files = await files;
        const name = join(dir, file);
        const isDirectory = await stat(name).isDirectory();
        const ignore = ignoreExp.test(file);
        if (isDirectory) {
          return [...files, ...(await this.readDirectory(name))];
        }
        return ignore || !extExp.test(file) ? [...files] : [...files, name];
      }, [])
      .map(filePath => filePath.replace('.ts', ''));
  }

  async loadDirectory({ dir, importClass: ImportClass, makeDir = true }) {
    const result = [];
    const dirPath = join(this.root, dir);
    try {
      if (makeDir && (await !exists(dirPath))) {
        await mkdir(dirPath);
        return [];
      }
      const files = await this.readDirectory(dirPath);
      try {
        // eslint-disable-next-line global-require
        const requires = files.map(t => require(t.replace(__dirname, './')));
        requires.forEach((Imported) => {
          // check if Imported is a instance of ImportClass or a class that extends ImportClass
          const isInstance = Imported instanceof ImportClass;
          if (isInstance) {
            result.push(Imported);
          } else if (!isInstance && Imported.prototype instanceof ImportClass) {
            result.push(new Imported());
          }
        });
      } catch (err) {
        // console.error(err);
      }
    } catch (err) {
      // console.error(err);
      return result;
    }
    return result;
  }
}

module.exports = FileLoader;
