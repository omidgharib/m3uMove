var f = require("file");
var help =
"m3uMove by Ivan Malopinsky (http://imsky.co)\n\
Usage: m3uMove.js <path to .m3u file> <directory to copy the music files> [<mode>]\n\
Example: m3uMove.js c:\\test.m3u c:\\music\n\
Example: m3uMove.js c:\\test.m3u c:\\music copy # Copies files instead of moving them";
if (system.args.length < 3 || system.args.length > 4) {
	print(help);
} else {
	var mode = "move";
	if (system.args[3] !== undefined && system.args[3] == "copy") {
		mode = "copy";
	}
	var lFile = system.args[1];
	var fDir = system.args[2];
	if (lFile.indexOf(".m3u") !== -1 && f.exists(lFile) && f.isFile(lFile)) {
		if (f.exists(fDir) && f.isDirectory(fDir) && f.isWritable(fDir)) {
			var list = f.read(lFile).split("\n");
			var dir = f.canonical(fDir);
			var pList = [];
			for (var line in list) {
				if (list[line].toLowerCase().test(/\.mp3|\.ogg|\.wma/i)) {
					if (f.exists(list[line]) && f.isFile(list[line])) {
						var song = list[line];
						var songFile = f.split(song);
						pList.push([song, songFile[songFile.length - 1]]);
					} else {
						print("File doesn't exist: " + list[line]);
					}
				}
			}
			for (var i = 0, lCount = pList.length; i < lCount; i++) {
				try {
					if (mode === "move") {
						f.move(pList[i][0], dir + "/" + pList[i][1]);
					} else {
						f.copy(pList[i][0], dir + "/" + pList[i][1]);
					}
					print((mode == "move" ? "Moved: " : "Copied: ") + pList[i][0]);
					print(((i + 1) + "/" + lCount + " (" + parseInt(((i + 1) / lCount) * 100) + "%)"));
				} catch (err) {
					print("Copying failed: " + err);
				}
			}
		} else {
			print("Directory specified is not an directory or doesn't exist");
		}
	} else {
		print("File specified is not an .m3u file or doesn't exist");
	}
}
