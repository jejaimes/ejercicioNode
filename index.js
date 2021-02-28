const fs = require('fs')
const http = require('http')
const axios = require('axios')
const urlProveedores = 'https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json'
const urlClientes = 'https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json'
let array = []
let who = ''

const modifyHTML = (callback) => {
  fs.readFile('index.html', 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    let strListado = ''
    for (let i = 0; i < array.length; i++) {
      if (who === 'de proveedores') {
        strListado += '<tr><td>' + array[i].idproveedor + '</td><td>' + array[i].nombrecompania + '</td><td>' + array[i].nombrecontacto + '</td></tr>\n'
      } else {
        strListado += '<tr><td>' + array[i].idCliente + '</td><td>' + array[i].NombreCompania + '</td><td>' + array[i].NombreContacto + '</td></tr>\n'
      }
    }
    let result = data.replace('de</h1>', who + '</h1>')
    result = result.replace('<tbody></tbody>', '<tbody>' + strListado + '</tbody>')
    // fs.writeFile('index.html', result, 'utf8', function (err) {
    //   if (err) return console.log(err)
    // })
    callback(result.toString())
  })
}

http.createServer((req, res) => {
  let url
  if (req.url === '/api/proveedores') {
    url = urlProveedores
    who = 'de proveedores'
  } else if (req.url === '/api/clientes') {
    url = urlClientes
    who = 'de clientes'
  } else {
    res.statusCode = 404
    res.end('Sorry! Wrong url')
  }

  axios.get(url).then((response) => {
    array = response.data
  }).catch((err) => {
    console.log(err)
  }).then(() => {
    modifyHTML((data) => {
      res.statusCode = 200
      res.end(data)
    })
  })
}).listen(8081)
