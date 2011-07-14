var f = require("file");
var help =
"M3U Move by Ivan Malopinsky (http://imsky.co)\n\
Usage: m3u.js <path to .m3u file> <directory to copy the music files> [<mode>]\n\
Example: m3u.js c:\\test.m3u c:\\music\n\
Example: m3u.js c:\\test.m3u c:\\music copy # Copies files instead of moving them";
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
			for (var song in list) {
				var s = "";
				if (list[song].toLowerCase().indexOf(".mp3") !== -1 || list[song].toLowerCase().indexOf(".ogg") !== -1) {
					if (f.exists(list[song]) && f.isFile(list[song])) {
						s = list[song];
					} else {
						print("File doesn't exist: " + list[song]);
					}
				}
				var filenameSplit = f.split(s);
				if (s !== "") {
					pList.push([s, filenameSplit[filenameSplit.length - 1]]);
				}
			}
			for (var i = 0, lCount = pList.length; i < lCount; i++) {
				try {
					if (mode == "move") {
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
