const { src, dest, series, parallel } = require('gulp');
const del = require('del');
const fs   = require('fs');
const zip = require('gulp-zip');
const log = require('fancy-log');
var exec = require('child_process').exec;

const paths = {
  prod_build: '../prod-build',
  server_file_name: 'app.js',
  server_auth_routes: '../prod-build/auth_routes',
  server_inventory_routes: '../prod-build/inventory_routes',
  server_issued_items_routes: '../prod-build/issued_items_routes',
  server_sfs_s6_inventory_routes: '../prod-build/sfs_s6_inventory_routes',
  server_sfs_cape_inventory_routes: '../prod-build/sfs_cape_inventory_routes',
  server_fss45_bowling_inventory_routes: '../prod-build/fss45_bowling_inventory_routes',
  server_sfs_patrick_inventory_routes: '../prod-build/sfs_patrick_inventory_routes',
  server_shoppingcart_routes: '../prod-build/shoppingcart_routes',
  server_user_routes: '../prod-build/user_routes',
  zipped_file_name: 'react-nodejs.zip'
};

function clean()  {
  log('removing the old files in the directory')
  return del('../prod-build/**', {force:true});
}

function createProdBuildFolder() {

  const dir = paths.prod_build;
  log(`Creating the folder if not exist  ${dir}`)
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    log('folder created:', dir);
  }

  return Promise.resolve('the value is ignored');
}




function copyNodeJSCodeTask() {
  log('building and copying server code into the directory')
  return src(['package.json', 'app.js', '.env', 'dist/**'])
        .pipe(dest(`${paths.prod_build}`))
}

function copyAuthRoutesTask() {
  log('copying server AUTH routes into the directory')
  return src(['auth_routes/**'])
        .pipe(dest(`${paths.server_auth_routes}`))
}

function copyInventoryRoutesTask() {
  log('copying server INVENTORY routes into the directory')
  return src(['inventory_routes/**'])
        .pipe(dest(`${paths.server_inventory_routes}`))
}

function copyIssuedItemsRoutesTask() {
  log('copying server ISSUED ITEMS routes into the directory')
  return src(['issued_items_routes/**'])
        .pipe(dest(`${paths.server_issued_items_routes}`))
}

function copySfsS6InventoryRoutesTask() {
  log('copying server S6 INV routes into the directory')
  return src(['sfs_s6_inventory_routes/**'])
        .pipe(dest(`${paths.server_sfs_s6_inventory_routes}`))
}

function copyFss45BowlingInventoryRoutesTask() {
  log('copying server 45 SFS Bowling routes into the directory')
  return src(['fss45_bowling_inventory_routes/**'])
        .pipe(dest(`${paths.server_fss45_bowling_inventory_routes}`))
}

function copySfsCapeInventoryRoutesTask() {
  log('copying server CAPE INV routes into the directory')
  return src(['sfs_cape_inventory_routes/**'])
        .pipe(dest(`${paths.server_sfs_cape_inventory_routes}`))
}

function copySfsPatrickInventoryRoutesTask() {
  log('copying server PATRICK INV routes into the directory')
  return src(['sfs_patrick_inventory_routes/**'])
        .pipe(dest(`${paths.server_sfs_patrick_inventory_routes}`))
}

function copyShoppingCartRoutesTask() {
  log('copying server CART routes into the directory')
  return src(['shoppingcart_routes/**'])
        .pipe(dest(`${paths.server_shoppingcart_routes}`))
}

function copyUserRoutesTask() {
  log('copying server USER routes into the directory')
  return src(['user_routes/**'])
        .pipe(dest(`${paths.server_user_routes}`))
}


function zippingTask() {
  log('zipping the code')
  return src(`${paths.prod_build}/**/*`)
      .pipe(zip(`${paths.zipped_file_name}`))
      .pipe(dest(`${paths.prod_build}`))
}

exports.default = series(
  clean,
  createProdBuildFolder,
  copyNodeJSCodeTask,
  parallel(
    copyAuthRoutesTask, 
    copyInventoryRoutesTask, 
    copyIssuedItemsRoutesTask,
    copySfsS6InventoryRoutesTask,  
    copySfsCapeInventoryRoutesTask, 
    copySfsPatrickInventoryRoutesTask, 
    copyShoppingCartRoutesTask, 
    copyUserRoutesTask,
    copyFss45BowlingInventoryRoutesTask
    ),
  zippingTask
);