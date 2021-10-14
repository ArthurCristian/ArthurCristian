const {makeTicketRequest, makeStatusRequest} = require("./caradhras-request")

const ticketsConsulta = new Map()
const ticketsProccess = new Map()
const ticketsError = new Map()

async function requestDataExtraction(req,res){
  const {account_id, service, callback, date, from, to, format} = req.body
    try {
      if(req.headers["api-key"] != "1234"){
        console.log("api-key inválida!")
        return res.status(401).json({success:false})
      }
        if(account_id == "" || service == "" || callback == "" || (date == "" && (from == "" || to == ""))){
          console.log("body inválido, parâmetro obrigatório vazio!")
          return res.status(400).json({success:false})
        }
          const ticket = await makeTicketRequest(service,date,account_id,from,to,format)
          const data = new Map([ ['account_id',account_id], ['service',service], ['callback',callback], ['date',date], ['from',from], ['to',to], ['format',format], ['ticket',ticket] ])
          console.log("Map criado, Valores abaixo!")
          ticketsConsulta.set(ticket, data)
          console.log(ticketsConsulta)

            let cicloConsulta = setInterval(async function() { 
            for (const [key, value] of ticketsConsulta) {
                const status = await makeStatusRequest(ticketsConsulta.get(''+key).get('ticket'))
                console.log('esperando')
                if(status == 'finished'){
                  ticketsProccess.set(key, value)
                  ticketsConsulta.delete(key)
                  console.log(status)
                  res.status(200).json({success:true, ticket:key, ticket_status:status})
                }
                else if(status!='finished' && status!='requested'){
                  ticketsError.set(key, value)
                  ticketsConsulta.delete(key)
                  console.log(status)
                  res.status(200).json({success:true, ticket:key, ticket_status:status})
                }
            }
            if(ticketsConsulta.size == 0){
              console.log('Map ticketConsulta',ticketsConsulta)
              console.log('Map ticketsError',ticketsError)
              console.log('Map ticketsProccess',ticketsProccess)
               clearInterval(cicloConsulta)
              }
          }, 10000)

    }
    catch (error) {
        console.log("Erro", error)
        res.status(500).json({success:false})
    }
  }
  module.exports = requestDataExtraction