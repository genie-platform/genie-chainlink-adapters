# Instructions

- Install dependencies:
```
npm install
```
- Run the app.js file:
```
node app.js
```
- Call the adapter with `curl`:
```
curl -X POST -H 'content-type: application/json' -d '{"id":"abc123","data":{"pool":"0xd97ca7e7d3bef6ad2f1f79a541f276c10d40666c000000000000000000000000","level":1}}' http://localhost:8080
```
- Observe results:
```
{"jobRunID":"abc123","data":{"winnerAccount":"0x000000000000000000000000d418c5d0c4a3d87a6c555b7aa41f13ef87485ec6"}}
```
