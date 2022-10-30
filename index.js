const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const app = express();

const csvPath = "/tmp/data.csv";

// serve your css as static
app.use("/", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.post("/updateTASK",(req, res) => {
	let dataCSV;
	let newDATACSV = "";
	let exists;
	try {
		if (fs.existsSync(csvPath)) {
			dataCSV = fs.readFileSync(csvPath, "utf-8").split("\n");
		} else {
			dataCSV = fs.readFileSync(__dirname + "/public/data.csv", "utf-8").split("\n");
		}
		for (let i = 0; i < dataCSV.length - 1; i++){
			let data = dataCSV[i].split(";");
			let delflg = data[5];
			if (dataCSV[i].split(";")[0] == req.body.ID){
				data[1] = req.body.TASK;
				data[2] = req.body.DESCRIPTION;
				data[3] = req.body.AUTHOR;
				data[4] = req.body.FLAG;
				exists = true;
			}
			newDATACSV += `${data[0]};${data[1]};${data[2]};${data[3]};${data[4]};${delflg}\n`;
		}
		if (exists){
			let newCSVPATH;
			if (fs.existsSync(csvPath)) {
			
				newCSVPATH = csvPath;
			} else {
				
				newCSVPATH = __dirname + "/public/data.csv";
			}
			fs.writeFile(newCSVPATH, newDATACSV, function (err) {
				if (err) throw err;
				res.sendStatus(200);
			});
			
		} else {
			
			res.sendStatus(404);
		}
	} catch (err) {
		console.error(err);
	}
});

app.post("/addTASK",(req, res) => {
	let dataCSV;
	let err;
	try {
		if (fs.existsSync(csvPath)) {
			dataCSV = fs.readFileSync(csvPath, "utf-8").split("\n");
		} else {
			dataCSV = fs.readFileSync(__dirname + "/public/data.csv", "utf-8").split("\n");
		}
		for (let i = 1; i < dataCSV.length; i++){
			if (dataCSV[i].split(";")[0] == req.body.ID){
				err = true;
				break;
			}
		}
		if (err){
			res.sendStatus(404);
		} else {
			let newDATACSV;
			let newCSVPATH;
			if (fs.existsSync(csvPath)) {
				newDATACSV = fs.readFileSync(csvPath, "utf-8");
				newCSVPATH = csvPath;
			} else {
				newDATACSV = fs.readFileSync(__dirname + "/public/data.csv", "utf-8");
				newCSVPATH = __dirname + "/public/data.csv";
			}
			newDATACSV += `${req.body.ID};${req.body.TASK};${req.body.DESCRIPTION};${req.body.AUTHOR};${req.body.FLAG};0\n`;
			fs.writeFile(newCSVPATH, newDATACSV, function (err) {
				if (err) throw err;
				res.sendStatus(200);
			});
			
		}
	} catch (err) {
		console.error(err);
	}
});

app.post("/deleteTASK",(req, res) => {
	let dataCSV;
	let newDATACSV = "";
	let exists;
	try {
		if (fs.existsSync(csvPath)) {
			dataCSV = fs.readFileSync(csvPath, "utf-8").split("\n");
		} else {
			dataCSV = fs.readFileSync(__dirname + "/public/data.csv", "utf-8").split("\n");
		}
		for (let i = 0; i < dataCSV.length - 1; i++){
			let data = dataCSV[i].split(";");
			let delflg = data[5];
			if (dataCSV[i].split(";")[0] == req.body.ID){
				delflg = 1;
				exists = true;
			}
			newDATACSV += `${data[0]};${data[1]};${data[2]};${data[3]};${data[4]};${delflg}\n`;
		}
		if (exists){
			let newCSVPATH;
			if (fs.existsSync(csvPath)) {
			
				newCSVPATH = csvPath;
			} else {
				
				newCSVPATH = __dirname + "/public/data.csv";
			}
			fs.writeFile(newCSVPATH, newDATACSV, function (err) {
				if (err) throw err;
				res.sendStatus(200);
			});
			
		} else {
			
			res.sendStatus(404);
		}
	} catch (err) {
		console.error(err);
	}
});

app.get("/data", function (req, res) {
	try {
		if (fs.existsSync(csvPath)) {
			res.sendFile(csvPath);
		} else {
			res.sendFile(__dirname + "/public/data.csv");
		}
	} catch (err) {
		console.error(err);
	}
});

app.get("/getNewID", function (req, res) {
	let dataCSV;
	try {
		if (fs.existsSync(csvPath)) {
			dataCSV = fs.readFileSync(csvPath, "utf-8").split("\n");
		} else {
			dataCSV = fs.readFileSync(__dirname + "/public/data.csv", "utf-8").split("\n");
		}
		if (dataCSV.length <= 1){
			res.json("1");
		} else {
			res.json(parseInt(dataCSV[dataCSV.length - 2].split(";")[0]) + 1);
		}
	} catch (err) {
		console.error(err);
	}
});

app.listen(80, () => {
	console.log("Application started and Listening on port 80");
});

module.exports = app;
