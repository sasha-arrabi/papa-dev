const sharp = require('sharp');
const { readdirSync, existsSync, copyFile } = require('fs');
const directory = './images';
const destinationDir = './src/assets/images';

readdirSync(directory).forEach(file => {
  const extension = file.substring(file.lastIndexOf('.'));
  const promises = [];

  // Only convert the source if it hasn't already been converted before
  if (!existsSync(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-xs${extension}`)) {
    // Create webp versions for all sizes
    promises.push(
      sharp(`${directory}/${file}`)
        .resize(360)
        .toFormat('webp')
        .toFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-xs.webp`)
    );

    promises.push(
      sharp(`${directory}/${file}`)
        .resize(540)
        .toFormat('webp')
        .toFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-sm.webp`)
    );

    promises.push(
      sharp(`${directory}/${file}`)
        .resize(720)
        .toFormat('webp')
        .toFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-md.webp`)
    );

    promises.push(
      sharp(`${directory}/${file}`)
        .resize(1080)
        .toFormat('webp')
        .toFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-lg.webp`)
    );

    promises.push(
      sharp(`${directory}/${file}`)
        .resize(1200)
        .toFormat('webp')
        .toFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-xl.webp`)
    );

    // Resize original image with all sizes
    promises.push(
      sharp(`${directory}/${file}`)
        .resize(360)
        .toFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-xs${extension}`)
    );

    promises.push(
      sharp(`${directory}/${file}`)
        .resize(540)
        .toFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-sm${extension}`)
    );

    promises.push(
      sharp(`${directory}/${file}`)
        .resize(720)
        .toFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-md${extension}`)
    );

    promises.push(
      sharp(`${directory}/${file}`)
        .resize(1080)
        .toFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-lg${extension}`)
    );

    promises.push(
      sharp(`${directory}/${file}`)
        .resize(1200)
        .toFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-xl${extension}`)
    );

    // Create default image in medium size
    copyFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-md${extension}`, `${destinationDir}/${file}`, () => true);

    Promise.all(promises).then(() => {
      console.log(`${file} has been processed successfully.`);
    }).catch(error => {
      console.error(`Error occurred while processing ${file}`, error);
    });
  } else {
    console.log(`${file} has already been processed - skipping file.`);
  }
});
