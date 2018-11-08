const { getFiles, openFile, parseXML } = require('./helpers.js');

function summarizeCheckErrors(errors) {
  let obj = {};

  for (error of errors) {
    let eSource = error.$.source.split('.');
    let baseSource = eSource[eSource.length - 1];
    
    obj[baseSource] = obj[baseSource] || {};
    obj[baseSource][error.$.message] = obj[baseSource][error.$.message] + 1 || 1;
  }

  //TODO: Output to markdown table
  process.stdout.write(JSON.stringify(obj, null, 2));
}

/**
 * Goes to the location of the report and produces a 
 * condensed format. 
 * 
 * @param check <string>
 */
module.exports.processCheckStyleReport = async (check) => {
  let checkFiles = await getFiles(check);
  let checkFileContents = await openFile(checkFiles[0]); 
  let checkObj = await parseXML(checkFileContents);
   
  for (file of checkObj.checkstyle.file) {
    process.stdout.write(file.$.name + '\n');
    summarizeCheckErrors(file.error);
    process.stdout.write(`\nTotal Errors: ${file.error.length}\n`);
  }
}

