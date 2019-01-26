const { openFile, parseXML, getFiles } = require('./helpers.js'); 
const table = require('markdown-table');

/** 
 * Prints out a table of the test results
 * 
 * @params test 
 */
module.exports.processTestReports = async (test) => {
  let errors = 0;
  let failures = 0;
  let total = 0;

  let failedTests = [];
  let errorTests = [];

  let testFiles = await getFiles(test);
  
  for (file of testFiles) {
    let fileContents = await openFile(file);
    let fileObj = await parseXML(fileContents);

    total += parseInt(fileObj.testsuite.$.tests);
    failures += parseInt(fileObj.testsuite.$.failures);
    errors += parseInt(fileObj.testsuite.$.errors);

    failedTests = failedTests
      .concat(
        fileObj.testsuite.testcase.filter((t) => {
          return t.failure !== undefined; 
        })
        .sort((a, b) => {
          if (a.$.name > b.$.name) {
            return 1;
          } else if (a.$.name < b.$.name) {
            return -1;
          } else {
            return 0;
          }
        })
      );
    
    errorTests = errorTests 
      .concat(
        fileObj.testsuite.testcase.filter((t) => {
          return t.error !== undefined; 
        })
        .sort((a, b) => {
          if (a.$.name > b.$.name) {
            return 1;
          } else if (a.$.name < b.$.name) {
            return -1;
          } else {
            return 0;
          }
        })
      );
  }

  let failureStr = failedTests
    .map((t) => {
      return `${t.$.name}\n\t${t.failure[0].$.message}`;
    })
    .join('\n');
  
  let errorStr = errorTests 
    .map((t) => {
      return `${t.$.name}\n\t${t.error[0].$.message}`;
    })
    .join('\n');

  let tableStr = table([
    ['Failures', 'Errors', 'Total'],
    [failures, errors, total]
  ]);

  process.stdout.write(`${failureStr}\n\n${errorStr}\n\n${tableStr}\n\n`);
}

