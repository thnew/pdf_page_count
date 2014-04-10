var exec = require('child_process').exec;
var fs = require('fs');
var http = require('http');
var tmp = require('tmp');

var initialized = false;

// Add Ghostscript executables path
var projectPath = __dirname.split("\\");
projectPath.pop();
projectPath = projectPath.join("\\");

exports.ghostscriptPath = projectPath + "\\executables\\ghostScript";

// for linux compability
exports.ghostscriptPath = exports.ghostscriptPath.split("\\").join("/");

exports.count = function(filepathOrData, callback) {
	var filepathOrData = arguments[0];
	var callback = arguments[1];
	var options = {};
	
	var tmpFileCreated = false;
	
	if(arguments[2] != null)
	{
		options = arguments[1];
		callback = arguments[2];
	}
	
	if(!initialized)
	{
		if(!options.useLocalGhostscript)
		{
			process.env.Path += ";" + exports.ghostscriptPath;
		}
		
		initialized = true;
	}
	
	var execute = function() {
		var cmd = 'gs -q -dNODISPLAY -c "(' + filepathOrData.replace(/\\/g, "/") + ') (r) file runpdfbegin pdfpagecount = quit"';
		
		exec(cmd, function (error, stdout, stderr) {
			// Remove temp file
			if(tmpFileCreated) fs.unlink(filepathOrData);
			
			if(error !== null)
			{
				//console.log("Error reading pdf: " + error);
				callback({ success: false, error: "Error reading pdf: " + error });
				return;
			}
			
			// Remove line break (\n) at the end
			var pageCount = stdout.substr(0, stdout.length - 1);
			
			callback({ success: true, data: pageCount });
		});
	};
	
	if(typeof(filepathOrData) == "object")
	{
		tmpFileCreated = true;
		
		var fileData = filepathOrData;
		
		// get temporary filepath
		tmp.file({ postfix: ".pdf" }, function (err, path, fd) {
			if(err)
			{
				callback({ success: false, error: "Error getting first temporary filepath: " + err });
				return;
			}
			
			fs.writeFile(path, fileData, function(err) {
				if(err)
				{
					callback({ success: false, error: "Error saving given binary filedata to file: " + err });
					return;
				}
				
				// set filepath
				filepathOrData = path;
				
				// Execute
				execute();
			});
		});
	}
	else if(filepathOrData.substr(0, 7) == "http://" || filepathOrData.substr(0, 8) == "https://")
	{
		tmpFileCreated = true;
		
		// get temporary filepath
		tmp.file({ postfix: ".pdf" }, function (err, path, fd) {
			if(err)
			{
				callback({ success: false, error: "Error getting first temporary filepath: " + err });
				return;
			}
			
			var file = fs.createWriteStream(path);
			var request = http.get(filepathOrData, function(response) {
				response.pipe(file);
				
				response.on('end', function () {
					// set filepath
					filepathOrData = path;
					
					// Execute
					execute();
				});
			});
		});
	}
	else execute();
};