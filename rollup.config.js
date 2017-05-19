import {readFileSync} from 'fs';

var pkg = JSON.parse(readFileSync('bower.json', 'utf-8'));
var banner = '/*! ' + pkg.name + ' v' + pkg.version +
  ' (' + pkg.homepage + ') */';

export default {
  entry: 'src/dable.js',
  banner: banner,
  moduleId: 'Dable',
  moduleName: 'Dable',
  legacy: true,
  targets: [
    {dest: 'lib/dable.js', format: 'umd'}
  ]
};
