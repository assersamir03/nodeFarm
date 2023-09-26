const http=require('http')
const fs=require('fs')
const url=require('url')
const replaceTemp=require('./modules/replaceFunc')
const slugify=require('slugify') 



const tempOverview=fs.readFileSync(`${__dirname}/Templates/overview.html`,'utf-8')
const tempProduct=fs.readFileSync(`${__dirname}/Templates/templateProduct.html`,'utf-8')
const tempCard=fs.readFileSync(`${__dirname}/Templates/templateCard.html`,'utf-8')
const data=fs.readFileSync(`${__dirname}/data/data.json`,'utf-8')
const dataObj=JSON.parse(data)
const slugs=dataObj.map(element=>slugify(element.productName),{lower:true})
console.log(slugs)

const server= http.createServer((req,res)=>{
    const {query,pathname}= url.parse(req.url,true)
    //overview paged
    if  (pathname==='/overview' || pathname === '/'){
        res.writeHead(200,{'Content-Type':'text/html'})
        
        const cardsHtml=dataObj.map(el=>replaceTemp(tempCard,el)).join('')
        const output=tempOverview.replace('{%PRODUCTCARDS%}',cardsHtml)

        res.end(output)
    }

    //product page
    else if  (pathname==='/product'){
        res.writeHead(200,{'Content-Type':'text/html'})
        const product=dataObj[query.id]
        const output=replaceTemp(tempProduct,product)
        res.end(output)
    }
    
    //overview api
    else if  (pathname==='/api'){
        res.writeHead(200,{'Content-Type':'application/json'})
        res.end(data)
    }
    
    
    else{
        res.writeHead(404,{'Content-Type':'text/html'})
        res.end('<h1>not avilable!</h1>')
    }
})

server.listen(6969,()=>{console.log('we are listening!')})