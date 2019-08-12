const fs = require('fs');
const path = require('path');

/**
 * FileLoader loads files from folders that export an instance or extension of the given class.
 * @namespace
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
    Object.defineProperty(this, 'root', { value: root });
  }

  loadDirectory({ dir, importClass: ImportClass, makeDir = true }) {
    const result = [];
    const dirPath = path.join(this.root || require.main.path, dir);
    try {
      if (makeDir && !fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        return [];
      }
      const files = this.readDirectory(dirPath);
      try {
        // eslint-disable-next-line global-require
        const requires = files.map(t => require(t.replace(__dirname, './')));
        requires.forEach((Imported) => {
          // check if Imported is a instance of ImportClass or a class that extends ImportClass
          const instance = Imported instanceof ImportClass;
          if (instance) {
            result.push(Imported);
          } else if (!instance && Imported.prototype instanceof ImportClass) {
            result.push(new Imported());
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

  readDirectory(dir) {
    const extExp = /\.(js|ts)$/;
    return fs
      .readdirSync(dir)
      .reduce((files, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        if (isDirectory) {
          return [...files, ...this.readDirectory(name)];
        }
        return /^_/.test(file) || !extExp.test(file) ? [...files] : [...files, name];
      }, [])
      .map(filePath => filePath.replace('.ts', ''));
  }
}

module.exports = FileLoader;
