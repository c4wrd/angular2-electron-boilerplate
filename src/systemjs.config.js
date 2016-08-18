(function(global) {

  // map tells the System loader where to look for things
  var map = {
      'app': 'app',
      'rxjs': 'assets/js/vendor/rxjs',
      'angular2-in-memory-web-api': 'assets/js/vendor/angular2-in-memory-web-api',
      '@angular': 'assets/js/vendor/@angular',
      '@angular2-material': 'assets/js/vendor/@angular2-material'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
      'app': {
          main: 'boot.js',
          defaultExtension: 'js'
      },
      'rxjs': {
          defaultExtension: 'js'
      },
      'angular2-in-memory-web-api': {
          defaultExtension: 'js'
      }
  };

  var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/forms',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    '@angular/upgrade',
    '@angular2-material',
    'core-js'
  ];

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

/**
 Simplicity sake for Angular 2 Material
 **/

var materialPkgs = [
  'core',
  'toolbar',
  'icon',
  'button',
  'sidenav',
  'list',
  'card',
  'input',
];

materialPkgs.forEach((pkg) => {
  packages[`@angular2-material/${pkg}`] = {main: `${pkg}.js`};
});

  var config = {
    map: map,
    packages: packages
  }

  // filterSystemConfig - index.html's chance to modify config before we register it.
  if (global.filterSystemConfig) { global.filterSystemConfig(config); }

  System.config(config);

})(this);
