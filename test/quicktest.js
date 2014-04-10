var pdfPageCount = require("../lib/pdfPageCount.js");
var fs = require("fs");

var projectPath = __dirname.split("\\");
projectPath.pop();
projectPath = projectPath.join("\\");

var gsPath = projectPath + "\\executables\\ghostScript";

// Rewrite the ghostscript path
pdfPageCount.ghostscriptPath = gsPath;

// test with pdf with one page
pdfPageCount.count(__dirname + "/example_with_one_page.pdf", function(resp){
	if(!resp.success)
	{
		console.log("Something went wrong: " + resp.error);
		
		return;
	}
	
	if(resp.data == 1) console.log("Yayy, test with one page works!");
	else console.log("Oh no..tool says the PDF has " + resp.data + " pages, but it should say it has one page!");
});

// test with pdf with one page
pdfPageCount.count("http://www.ruhr-uni-bochum.de/www-rz/schwanbs/TeX/einfuehrung-in-tex.pdf", function(resp){
	if(!resp.success)
	{
		console.log("Something went wrong: " + resp.error);
		
		return;
	}
	
	if(resp.data == 1) console.log("Yayy, test with one page, given through a web url works!");
	else console.log("Oh no..tool says the PDF has " + resp.data + " pages, but it should say it has one page!");
});

// test with pdf with one page, but first read the file and give the function the raw data
var file = fs.readFileSync(__dirname + "/example_with_one_page.pdf");

pdfPageCount.count(file, function(resp){
	if(!resp.success)
	{
		console.log("Something went wrong: " + resp.error);
		
		return;
	}
	
	console.log("ONline docuemnt has " + resp.data + " pages!");
});

// test with PDF with three pages
pdfPageCount.count(__dirname + "/example_with_three_pages.pdf", function(resp){
	if(!resp.success)
	{
		console.log("Something went wrong: " + resp.error);
		
		return;
	}
	
	if(resp.data == 3) console.log("Yayy, test with multiple pages works!");
	else console.log("Oh no..tool says the PDF has " + resp.data + " pages, but it should say it has three pages!");
});