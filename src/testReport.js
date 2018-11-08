const { openFile, parseXML, getFiles } = require('./helpers.js'); 
const table = require('markdown-table');

/** 
 * Prints out a table of the test results
 * 
 * @params test 
 */
module.exports.processTestReports = async (test) => {
  let testFiles = await getFiles(test);

  let errors = 0;
  let failures = 0;
  let total = 0;
  for (file of testFiles) {
    let fileContents = await openFile(file);
    let fileObj = await parseXML(fileContents);

    total += parseInt(fileObj.testsuite.$.tests);
    failures += parseInt(fileObj.testsuite.$.failures);
    errors += parseInt(fileObj.testsuite.$.errors);
  }

  
  let tableStr = table([
    ['Failures', 'Errors', 'Total'],
    [failures, errors, total]
  ]);

  process.stdout.write(`${tableStr}\n\n`);
}

