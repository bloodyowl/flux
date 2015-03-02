import http from "http"
import fs from "fs"
import {Dispatcher} from "../../../dist"

const server = http.createServer((req, res) => {
  if(req.url == "/script.js") {
    res.setHeader("Content-Type", "text/javascript")
    fs.createReadStream("./dist/index.js")
      .pipe(res)
    return
  }
  res.write("<!DOCTYPE html>")
  res.write("<meta charset='utf8'>")
  res.write("<title>my website</title>")
  res.write("<div id='app'>")
  res.write("</div>")
  res.write("<script src='/script.js'></script>")
  res.end()
})

server.listen(4143)

console.log("open http://localhost:4143/")
