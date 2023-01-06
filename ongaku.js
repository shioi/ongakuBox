const fs = require("fs")
const fse = require("fs-extra")
const chokidar = require('chokidar');
const pt = require("path");
var copyfiles = require('copyfiles');

function initialize(path) {
    const folderNames = [".ongaku", ".snapshots"]
    for (let i = 0; i < 2; i++) {
        try {
            if (!fs.existsSync(path + folderNames[i]))
                fs.mkdirSync(path + folderNames[i]);
        }
        catch (err) {
            console.error(err);
        }
    }
    snapShotCopy(path);
}

function snapShotCopy(path) {
    basepath = path + ".snapshots/"
    let versionNo = "";
    fs.readdir(basepath, (err, files) => {
        if (err) {
            console.log("Error!!!")
        } else {
            if (!files.length) {
                console.log("none is executed !!!")
                fs.mkdirSync(basepath + "V1");
                fs.writeFile(basepath + "versionfile", "1", err => {
                    console.error(err);
                });
                versionNo = "1";
                const destDir = basepath + "V" + versionNo;
                CopyFiles(path, destDir)
            }
            else {
                console.log("else is executed !!!")
                fs.readFile(basepath + "versionfile", 'utf8', function read(err, data) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        versionNo = (parseInt(data) + 1).toString();
                        fs.mkdirSync(basepath + "V" + versionNo);
                        fs.writeFile(basepath + "versionfile", versionNo, err => {
                            console.error(err);
                        });
                        const destDir = basepath + "V" + versionNo;
                        CopyFiles(path, destDir)
                    }
                });
            }
        }
    })
}

function CopyFiles(src, des) {
    fse.copySync(src, './tmp', { overwrite: true })
    fse.copySync('./tmp', des, { overwrite: true })
    fs.rmSync('./tmp', { recursive: true, force: true });

}


function staging() {
    chokidar.watch('.').on('all', (event, path) => {
        console.log(event, path);
    });
}

module.exports = { initialize, snapShotCopy };