const util = require('util');
const glob = util.promisify(require('glob'));
const fs = require('fs');
const parseXMLString = util.promisify(require('xml2js').parseString);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

/**
 * @param dir <string>
 * @returns List<string> of all files in the dir
 */
module.exports.getFiles = async (dir) => {
  let files = [];
  
  try {
    files = await glob(dir);   
  } catch (e) {
    process.stderr.write(e);
  }

  return files;
}

/**
 * Naiive way to get contents of file. Used 
 * mainly for just xml and java files (i.e., small files)
 * 
 * @param file <string>
 * @returns <string> representation of a file
 */
module.exports.openFile = async (file) => {
  let data = "";

  try {
    data = await readFile(file);
  } catch (e) {
    process.stderr.write(e);
  }

  return data.toString();
}

/**
 * Parses the xml string into a usable format.  
 *
 * @param xml <string>
 * @returns <Object> representing the structure of the XML
 */
module.exports.parseXML = async (xml) => {
  let obj = {};

  try {
    obj = await parseXMLString(xml);
  } catch(e) {
    process.stderr.write(e);
  }

  return obj;
}

/**
 * Write the contents of a string to a file. 
 * 
 * @param fileName <string>
 * @param contents <string> 
 */
module.exports.dumpToFile = async (fileName, contents) => {
  try {
    await writeFile(fileName, contents);
  } catch (e) {
    process.stderr.write(e);
  }
}

