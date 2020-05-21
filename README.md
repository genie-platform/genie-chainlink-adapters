# Instructions

- Run the app.js file:
```
node app.js
```
- Call the adapter with `curl`:
```
curl -X POST -H 'content-type: application/json' -d '{"id":"abc123","data":{"pool":"0x0d65b0802d0713bac6426cf4935d252807f59136000000000000000000000000","level":1}}' http://localhost:8080
```
- Observe results:
```
{"jobRunID":"abc123","data":{"winnerAccount":"0x000000000000000000000000302f7c3f304a5611658753bfc259e53600a1df71"}}
```