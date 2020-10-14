
var fs = require('fs');
var archiver = require('archiver');

var output = fs.createWriteStream('GenBotPlugin.zip');
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

output.on('end', function () {
  console.log('Data has been drained');
});

archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

// good practice to catch this error explicitly
archive.on('error', function (err) {
  throw err;
});

// pipe archive data to the file
archive.pipe(output);

// append a file from stream
archive.file('../cambria-chatframe.php')
archive.file('../index.php')
archive.file('../uninstall.php')
archive.file('../white-listed-pages.php')
archive.directory('partials', 'public/partials')
archive.file('class-cambria-chatframe-public.php', { name: 'public/class-cambria-chatframe-public.php' })
archive.file('index.php', { name: 'public/index.php' })
archive.directory('../build', 'public/app/build')
archive.directory('../admin', 'admin')
archive.directory('../includes', 'includes')

archive.finalize();
