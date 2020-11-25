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
    promises.push(processSharp(directory, destinationDir, file, 200, 'xxxs', 'webp'));
    promises.push(processSharp(directory, destinationDir, file, 325, 'xxs', 'webp'));
    promises.push(processSharp(directory, destinationDir, file, 450, 'xs', 'webp'));
    promises.push(processSharp(directory, destinationDir, file, 575, 'sm', 'webp'));
    promises.push(processSharp(directory, destinationDir, file, 700, 'md', 'webp'));
    promises.push(processSharp(directory, destinationDir, file, 825, 'lg', 'webp'));
    promises.push(processSharp(directory, destinationDir, file, 950, 'xl', 'webp'));
    promises.push(processSharp(directory, destinationDir, file, 1080, 'xxl', 'webp'));
    promises.push(processSharp(directory, destinationDir, file, 1200, 'xxxl', 'webp'));

    // Resize original image with all sizes
    promises.push(processSharp(directory, destinationDir, file, 200, 'xxxs'));
    promises.push(processSharp(directory, destinationDir, file, 325, 'xxs'));
    promises.push(processSharp(directory, destinationDir, file, 450, 'xs'));
    promises.push(processSharp(directory, destinationDir, file, 575, 'sm'));
    promises.push(processSharp(directory, destinationDir, file, 700, 'md'));
    promises.push(processSharp(directory, destinationDir, file, 825, 'lg'));
    promises.push(processSharp(directory, destinationDir, file, 950, 'xl'));
    promises.push(processSharp(directory, destinationDir, file, 1080, 'xxl'));
    promises.push(processSharp(directory, destinationDir, file, 1200, 'xxxl'));

    Promise.all(promises).then(() => {
      // Create default image in medium size
      const extension = file.substring(file.lastIndexOf('.') + 1);
      copyFile(`${destinationDir}/${file.substring(0, file.lastIndexOf('.'))}-md.${extension}`, `${destinationDir}/${file}`, () => true);
      console.log(`${file} has been processed successfully.`);
    }).catch(error => {
      console.error(`Error occurred while processing ${file}`, error);
    });
  } else {
    console.log(`${file} has already been processed - skipping file.`);
  }
});

function processSharp(sourceDirectory, destinationDirectory, filename, size, sizeName, format) {
  const extension = filename.substring(filename.lastIndexOf('.') + 1);
  const image = sharp(`${sourceDirectory}/${filename}`).resize(size);

  if (format) {
    image.toFormat(format);
  }

  return image.toFile(`${destinationDirectory}/${filename.substring(0, filename.lastIndexOf('.'))}-${sizeName}.${format || extension}`);
}
