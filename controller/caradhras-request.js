const axios = require("axios");

async function makeToken(){
  const configToken = {
    url: 'https://auth.hml.caradhras.io/oauth2/token?grant_type=client_credentials',
    method: 'post',
    headers: {
      'Authorization': 'Basic MjhzdXJ0M2pqdnJoOHMzdmlwZzU4N28xaWc6b3Nsc2cwN3FzbjQzdGdkZjFzcDBza29ycmY3bzR0b3AzZjlyYzM1MnFscTl1MGp1MW1o',
      'Content-type' : 'application/x-www-form-urlencoded'
    }
  }
  const responseToken = await axios(configToken)
  return responseToken.data.access_token
}

async function makeTicketRequest(service,date,account_id,from,to,format){
  const token = await makeToken()
  const configTicket = {
    url: 'https://data.hml.caradhras.io/v1/transactions?service='+service+'&date='+date+'&accountId='+account_id+'&from='+from+'&to='+to+'&format='+format,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }
  const responseTicket = await axios(configTicket)
  return responseTicket.data.ticket
}

async function makeStatusRequest(ticket){
  const token = await makeToken()
  const configStatus = {
    url: 'https://data.hml.caradhras.io/v1/transactions/'+ticket,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  }
  const responseStatus = await axios(configStatus)
  return responseStatus.data.status
}
module.exports = {makeTicketRequest, makeStatusRequest}

