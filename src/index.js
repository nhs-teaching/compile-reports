const { getFiles } = require('./helpers.js');
const { processCheckStyleReport } = require('./check.js');
const { processTestReports } = require('./testReport.js');
const path = require('path');

/**
 * Processes the results of the project for tests and checks. 
 * 
 * @param proj <string>
 */
async function processProject(proj) {
  // get check*.xml
  let checkLoc = path.resolve(proj, 'build', 'reports', 'check*.xml');
  await processCheckStyleReport(checkLoc);

  // get tests/*.xml
  let testLoc = path.resolve(proj, 'build', 'reports', 'tests', '*.xml');
  await processTestReports(testLoc);
}

(async function main(args) {
  let projPattern = path.resolve(args[0], '*');
  let projects = await getFiles(projPattern);

  for (project of projects) {
    await processProject(project);
  }
})(process.argv.slice(2))

