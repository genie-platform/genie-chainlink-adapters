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
curl -X POST -H 'content-type: application/json' -d '{"id":"abc123","data":{"pool":"584350644653432764685826660008261375006629981845","level":1}}' http://localhost:8080
```
the pool value is the pool address converted to `uint256`, the original address is `0x665b306c39431e513382c5f641b75e6778f86e95`
- Observe results:
```
{"jobRunID":"abc123","data":{"winnerAccount":"0x000000000000000000000000d4c27c52763eae8d1fbb0da59ee1b9e937a5cb1f"}}
```
