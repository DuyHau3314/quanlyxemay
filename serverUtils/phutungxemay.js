export const readPhuTung = (fs, pathName) => {
  let readerStream = fs.createReadStream(pathName);
  let data = '';

  readerStream.setEncoding('utf8');

  readerStream.on('data', function (chunk) {
    data += chunk;
  });

  readerStream.on('end', function () {
    return JSON.parse(data);
  });

  readerStream.on('error', function (err) {
    console.log(err.stack);
    return { error: err.message };
  });
};

export const writePhuTung = (fs, data, pathName) => {
  const writeStream = fs.createWriteStream(pathName);
  writeStream.write(JSON.stringify(data));
  writeStream.end();
  writeStream.on('finish', () => {
    res.json({ message: 'Success' });
  });
  writeStream.on('error', function (err) {
    return { error: err.message };
  });
};

export const copyFile = (fs, rootFile, destinationFile) => {
  let readerStream = fs.createReadStream(filePathInput);
  let writeStream = fs.createWriteStream(filePathOutput);
  readerStream.pipe(writeStream);
};
