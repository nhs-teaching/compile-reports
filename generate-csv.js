const { promisify } = require('util');
const { getFiles, openFile, parseXML, dumpToFile } = require('./src/helpers.js');
const { fetchRoster, getStudent } = require('./src/lookupUser.js');
const path = require('path');
const csvStringify = promisify(require('csv-stringify'));

(async function main(args) {
    let location = path.resolve(args[0], '*');
    let projects = await getFiles(location);
    let roster = await fetchRoster(args[1]);

    let result = [];

    for (project of projects) {
        let testLoc = path.resolve(project, 'build', 'test-results', 'test', '*.xml');
        let testFiles = await getFiles(testLoc)

        let ghUname = path.basename(project);
        let studentInfo = getStudent(ghUname, roster);
        let studentResult = {};

        if (studentInfo) {
            studentResult['name'] = studentInfo['Student'];
        } else {
            studentResult['name'] = ghUname;
        }

        for (tfile of testFiles) {
            let tfileContents = await openFile(tfile);
            let tResults = await parseXML(tfileContents);

            let total = parseInt(tResults.testsuite.$.tests);
            let skipped = parseInt(tResults.testsuite.$.skipped);
            let failed = parseInt(tResults.testsuite.$.failures);
            let errors = parseInt(tResults.testsuite.$.errors);
            let totalPassed = total - (skipped + failed + errors);

            studentResult[ tfile.split('.').slice(1, -1).join('.') ] = `${totalPassed}`;
        }

        result.push(studentResult);
    }

    let csvStr = await csvStringify(result, {
        header: true
    });

    await dumpToFile('results.csv', csvStr);
})(process.argv.slice(2));