const { getFiles, openFile } = require('./helpers.js');
const { processCheckStyleReport } = require('./check.js');
const { processTestReports } = require('./testReport.js');
const path = require('path');
const Enquirer = require('enquirer');
const enq = new Enquirer();

enq.register('confirm', require('prompt-confirm'));

enq.question({
  type: 'confirm',
  name: 'continue',
  message: 'Would you like to show the next file?'
});

async function showSrcFiles(proj) {
  let srcFiles = await getFiles(proj);

  try {
     for (srcFile of srcFiles) {
       let contents = await openFile(srcFile);
       process.stdout.write(contents);
     
       while (!(await enq.ask('continue')).continue) {}
     }
  } catch (e) {
    process.stderr.write(e);
  }
}

async function getStudent(proj) {
  let logLoc = path.resolve(proj, 'output.log');

  let logFile = await openFile(logLoc);
  
  console.log(logFile.split('\n').slice(0, 4).join('\n'));
}

/**
 * Processes the results of the project for tests and checks. 
 * 
 * @param proj <string>
 */
async function processProject(proj) {
  await getStudent(proj);
  while(!(await enq.ask('continue')).continue) {}
  
  let srcLoc = path.resolve(proj, 'src', 'main', '**', '*.java');
  await showSrcFiles(srcLoc); 
  
  let checkLoc = path.resolve(proj, 'build', 'reports', 'check*.xml');
  await processCheckStyleReport(checkLoc);

  let testLoc = path.resolve(proj, 'build', 'reports', 'tests', '*.xml');
  await processTestReports(testLoc);

  while(!(await enq.ask('continue')).continue) {}
}

(async function main(args) {
  let projPattern = path.resolve(args[0], '*');
  let projects = await getFiles(projPattern);

  for (project of projects) {
    await processProject(project);
  }
})(process.argv.slice(2))

