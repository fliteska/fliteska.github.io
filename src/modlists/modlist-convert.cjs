
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
      console.log(mod, currentSeparator);
      if (mod.startsWith("*DLC: ")) {
        mods.DLC.push({ name: mod.replace("*DLC: ", "") });
      } else if (mod.includes("_separator")) {
        currentSeparator = mod.replace("_separator", "").replace("-", "").replace("+", "");
        mods[currentSeparator] = [];
      } else if (mod.startsWith("+")) {
        try {
          const tempSeparator = currentSeparator;
        const metaFile = readline.createInterface({
          input: fs.createReadStream(`D:\\MO2\\Fallout 4\\mods\\${mod.replace("+", "")}\\meta.ini`),
          crlfDelay: Infinity
        });
          let modId = null;
          metaFile.on('line', (line) => {
            if (line.startsWith("modid")) {
              modId = line.split("=")[1].trim();
              if (modId === "0") {
                mods[tempSeparator].push({ name: mod.replace("+", "") });
              } else {
                mods[tempSeparator].push({ name: mod.replace("+", ""), url: `https://www.nexusmods.com/fallout4/mods/${modId}` });
              }
            }
          });
        } catch (err) {
          console.error(`Error processing mod ${mod}: ${err}`);
        }
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
