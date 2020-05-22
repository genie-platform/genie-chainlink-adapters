const { request } = require('graphql-request')
const axios = require('axios')

const getAccountCharacters = async accountName => {
  var options = {
    method: 'POST',
    url: 'https://www.pathofexile.com/character-window/get-characters',
    headers: {
      authority: 'www.pathofexile.com',
      accept: 'application/json, text/javascript, */*; q=0.01',
      dnt: '1',
      'x-requested-with': 'XMLHttpRequest',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty'
    },
    data: `accountName=${accountName}`
  }

  try {
    const response = await axios(options)
    return response.data
  } catch (error) {
    return error.toJSON()
  }
}

const getAccountCharacter = async (accountName, genieToken) => {
  const characters = await getAccountCharacters(accountName)
  // console.log(characters)
  for (const character of characters) {
    // console.log(character)
    if (character.name.endsWith(genieToken)) {
      return character
    }
  }
}

// Path of Exile adapter
const poeAdapter = async (body, res) => {
  const level = body.data.level
  const pool = body.data.pool
  const poolAddress = pool.substring(0, 42)

  // getting list of users that joined the pool
  const query = `query geDeposits($pool: String!) {
    deposits(pool: $pool) {
      sender
      amount
      userId
    }
  }`

  const variables = {
    pool: poolAddress
  }

  const { deposits } = await request(
    'https://api.thegraph.com/subgraphs/name/genie-platform/genie-graph',
    query,
    variables
  )
  console.log({ deposits })

  // for each joined user
  for (const deposit of deposits) {
    // const senderBytes = '0x' + deposit.sender.slice(2).padStart(64, '0')
    // console.log('0x' + deposit.sender.slice(2).padStart(64, '0'))
    const [accountName, genieToken] = deposit.userId.split('#')

    // get the character from poe API
    const character = await getAccountCharacter(accountName, genieToken)
    // console.log({ character })

    // the goal level reached -> we got a winner
    if (character && character.level >= level) {
      console.log({ character })
      const winnerAccount = '0x' + deposit.sender.slice(2).padStart(64, '0')

      const response = {
        jobRunID: body.id,
        data: winnerAccount
      }

      console.log(response)
      return res(200, response)
    }
  }

  console.log('no winner found')
  // still no winner
  return res(200, {
    jobRunID: body.id
  })
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  poeAdapter(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  poeAdapter(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  poeAdapter(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

exports.poeAdapter = poeAdapter
