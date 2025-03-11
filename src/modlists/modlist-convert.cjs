
const events = require('events');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

(async function processLineByLine() {
  const list = [];
  let obj = {
    DLC: [],
  };
  let currentSeparator = "DLC";
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, './modlist.txt')),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      list.push(line);
    });

    await events.once(rl, 'close');
    list.reverse();
    list.map((mod) => {
      if (mod.startsWith("*DLC: ")) {
        obj.DLC.push(mod.replace("*DLC: ", ""));
      } else if (mod.includes("_separator")) {
        currentSeparator = mod.replace("_separator", "").replace("-", "").replace("+", "");
        obj[currentSeparator] = [];
      } else if (mod.startsWith("+")) {
        obj[currentSeparator].push(mod.replace("+", ""));
      }
    });
    fs.writeFile('rebuilding-the-commonwealth.json', JSON.stringify(obj, null, 2), 'utf8', () => {});
  } catch (err) {
    console.error(err);
  }
})();
