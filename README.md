pdf_page_count.js
============

Install:
npm install pdf_page_count

This project uses ghostscript, but there's no need to install it (if you use windows).
If you want the module to use a local installation of ghostscript, set the option useLocalGhostscript true.

Tested on Windows/Tested on AZURE

Not tested on linux!
If you want to use it with linux, you may replace the ghostscript-executable with something that works with linux.
Or you install ghostscript for linux.
http://www.ghostscript.com/

here are some examples how to use it:

```javascript
// test with pdf with one page
pdfPageCount.count(__dirname + "/example_with_one_page.pdf", function(resp){
	if(!resp.success)
	{
		console.log("Something went wrong: " + resp.error);
		
		return;
	}
	
	if(resp.data == 1) console.log("Yayy, test with one page works!");
	else console.log("Oh no..tool says the PDF has " + res.data + " pages, but it should say it has one page!");
});

// ..you can also give the function raw data
var file = fs.readFileSync(__dirname + "/example_with_one_page.pdf");

pdfPageCount.count(file, function(resp){
	if(!resp.success)
	{
		console.log("Something went wrong: " + resp.error);
		
		return;
	}
	
	if(resp.data == 1) console.log("Yayy, test with one page and giving raw data works!");
	else console.log("Oh no..tool says the PDF has " + res.data + " pages, but it should say it has one page!");
});

// ..or you give a web url, also possible (should be a http, not a https)
pdfPageCount.count("http://blablabla.com/blablabla.pdf", function(resp){
	if(!resp.success)
	{
		console.log("Something went wrong: " + resp.error);
		
		return;
	}
	
	if(resp.data == 1) console.log("Yayy, test with one page and giving raw data works!");
	else console.log("Oh no..tool says the PDF has " + res.data + " pages, but it should say it has one page!");
});
```

If an error like this appears:
Something went wrong: Error converting pdf to png: Error: Command failed: 'gs' is not recognized as an internal or external command, operable program or batch file.

Maybe you have the node file you execute in a subfolder and Pdf2Png doesn't set  the path to ghostscript correctly anymore.
You can rewrite the path to the executable by setting "pdf2png.ghostscriptPath".
Look at the following example of a script, being in the subfolder /lib.
It first detects the project-root folder and then builds the absolute path to the ghostscript folder.

```javascript
var projectPath = __dirname.split("\\");
projectPath.pop();
projectPath = projectPath.join("\\");

var gsPath = projectPath + "\\executables\\ghostScript";

// Rewrite the ghostscript path
pdf2png.ghostscriptPath = gsPath;
```