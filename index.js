(async () => {
  const { Builder, By, Key, until } = require('selenium-webdriver');
  const { Options } = require('selenium-webdriver/chrome');
  let chrome = require('selenium-webdriver/chrome');
  const chromedriver = require('chromedriver');
  const fs = require('fs');
  const path = require('path');
  const _ = require('underscore');

  // ** Downloads Location ** //
  const DOWNLOAD_FOLDER = '';

  let driver;

  try {
    driver = await new Builder()
      .setAlertBehavior('ignore')
      .forBrowser('chrome')
      .setChromeOptions(
        new Options()
          .setMobileEmulation({ deviceName: 'Nexus 5X' })
          .addArguments('--log-level=3')
          .addArguments('--ignore-certificate-errors')
      )
      .build();
    await driver.get('https://ezgif.com/split');

    const input = await driver.wait(
      until.elementLocated(
        By.xpath('/html/body/div/div[4]/div[1]/form/fieldset/p[1]/input')
      ),
      10000
    );
    setTimeout(async () => {
      input.sendKeys(__dirname + '/metaforge.gif');
      const sumbit = await driver.wait(
        until.elementLocated(
          By.xpath('/html/body/div[1]/div[4]/div[1]/form/fieldset/p[4]/input')
        ),
        10000
      );
      sumbit.click();

      // ** Have to click twice ig?? ** //
      const splitToFrames = await driver.wait(
        until.elementLocated(
          By.xpath('/html/body/div[1]/div[4]/div[1]/form/p[2]/input')
        ),
        10000
      );
      splitToFrames.click();
      const splitToFrames2 = await driver.wait(
        until.elementLocated(
          By.xpath('/html/body/div[1]/div[4]/div[1]/form/p[2]/input')
        ),
        10000
      );
      splitToFrames2.click();

      const download = await driver.wait(
        until.elementLocated(
          By.xpath('/html/body/div/div[4]/div[1]/div[2]/p[1]/a[2]')
        ),
        10000
      );
      download.click();
      console.log(process.cwd());
      getLatestFile(
        { directory: DOWNLOAD_FOLDER, extension: 'zip' },
        (filename = null) => {
          fs.rename(
            DOWNLOAD_FOLDER + '/' + filename,
            __dirname + '/zips/gif.zip',
            async err => {
              if (err) throw err;
              console.log('File renamed!');
              await driver.quit();
            }
          );
        }
      );
    }, 2500);
  } catch (ex) {
    console.log(ex);
    await driver.quit();
  }
  function getLatestFile({ directory, extension }, callback) {
    fs.readdir(directory, (_, dirlist) => {
      const latest = dirlist
        .map(_path => ({
          stat: fs.lstatSync(path.join(directory, _path)),
          dir: _path,
        }))
        .filter(_path => _path.stat.isFile())
        .filter(_path => (extension ? _path.dir.endsWith(`.${extension}`) : 1))
        .sort((a, b) => b.stat.mtime - a.stat.mtime)
        .map(_path => _path.dir);
      callback(latest[0]);
    });
  }
})();
