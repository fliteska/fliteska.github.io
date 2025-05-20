
const events = require('events');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

(async function processLineByLine() {
  const list = [];
  let mods = {
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
        mods.DLC.push(mod.replace("*DLC: ", ""));
      } else if (mod.includes("_separator")) {
        currentSeparator = mod.replace("_separator", "").replace("-", "").replace("+", "");
        mods[currentSeparator] = [];
      } else if (mod.startsWith("+")) {
        mods[currentSeparator].push(mod.replace("+", ""));
      }
    });
    const rl2 = readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, './loadorder.txt')),
      crlfDelay: Infinity
    });

    const loadOrder = []

    rl2.on('line', (line) => {
      if (!line.startsWith('#')) {
        loadOrder.push(line);
      }
    });
    await events.once(rl2, 'close');
    const obj = {
      mods,
      loadOrder
    }
    fs.writeFile('rebuilding-the-commonwealth.json', JSON.stringify(obj, null, 2), 'utf8', () => {});
  } catch (err) {
    console.error(err);
  }
})();
