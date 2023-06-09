const fs = require('fs');

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const myArgs = process.argv.slice(2);
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const src = myArgs[0];
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const dst = myArgs[1];
fs.copyFile(src, dst, (err) => {
  if (err) throw err;
  console.log(src + ' was copied to ' + dst);
});
