const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%temp%}", orgVal.main.temp);
  temperature = temperature.replace("{%mintemp%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%maxtemp%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%city%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") { 
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=Karachi&appid=71da519f67ad9bd8caee65c05acc9260&units=metric`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");