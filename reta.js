var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var corIn='yellow';
var corOut='red';
var width = parseInt(document.getElementById('myCanvas').getAttribute('width'));
var height = parseInt(document.getElementById('myCanvas').getAttribute('height'));

function gerar(){
    var param = getParameters();
    desenharFrame(param.frame);

    var retas = gerarRetas(param.numRetas);
    retas.forEach(function(reta, i){
        clipping(reta, param.frame);
    });
    console.log('end ' + param.numRetas + " retas")
}

function clipping(reta, frame){
    var posArrayInicial = getFramePositionArray(reta.pInicial, frame)
    var posArrayFinal = getFramePositionArray(reta.pFinal, frame)
    // desenharLinha(reta);
    
    if(isToPlotTrivial(posArrayInicial, posArrayFinal)){
        reta.pInicial.cor = corOut;
        reta.pFinal.cor = corOut;
        desenharLinha(reta);
    }
    // else if(isToClipTrivial(posArrayInicial, posArrayFinal)){
    //     clip(reta);
    // }else{
    //     // var retas = complexClip(reta, posArrayInicial, posArrayFinal, frame);
    //     // desenharLinha(reta)
    //     // retas.forEach(function(r, i){
    //     //     clip(r)
    //     // })
    //     console.log('n')
    // }
    
}

function complexClip(reta, posArrayInicial, posArrayFinal, frame){
    var retas = []
    if(!inFrame(posArrayInicial)){
        var intersecao = getIntersecao(reta.pInicial, reta.getM(), posArrayInicial, frame);
        retas.push(new Reta(reta.pInicial, intersecao))
        reta.pInicial = intersecao;
    } 
    if(!inFrame(posArrayFinal)){
        getIntersecao(reta.pFinal, reta.getM(), posArrayFinal, frame);   
        retas.push(new Reta(intersecao, reta.pFinal))
        reta.pFinal = intersecao;
    }
    return retas;
}

function getIntersecao(p, m, posArray, frame){
    var intersecao = new Ponto();

    if(posArray[0]){ // Above
        intersecao.y = frame.pNW.y 
        intersecao.x = (1/m)*(frame.pNW.y - p.y) + p.x
    }else if(posArray[1]){ // Bottom
        intersecao.y = frame.pSW.y 
        intersecao.x = (1/m)*(frame.pSW.y - p.y) + p.x
    }else if(posArray[2]){ // Right
        intersecao.x = frame.pNE.x
        intersecao.y = m * (frame.pNE.x - p.x) + p.y
    }else if(posArray[3]){ // Left
        intersecao.x = frame.pNW.x
        intersecao.y = m * (frame.pNW.x - p.x) + p.y
    }

    return intersecao;
}

function clip(reta){
    var omitir = document.getElementById('omitir')
    if(!omitir.checked){
        reta.pInicial.cor = corOut;
        reta.pFinal.cor = corOut;
        desenharLinha(reta)
    }
}

function getRandomNumber(end){
    return Math.floor(Math.random() * end);
}

function gerarRetas(numRetas){
    var retas = [];
    for(var i = 0; i < numRetas; i++){
        var x1 = getRandomNumber(width)
        var y1 = getRandomNumber(height)
        var pInicial = new Ponto(x1 , y1, corIn);

        var x2 = getRandomNumber(width)
        var y2 = getRandomNumber(height)
        var pFinal = new Ponto(x2 , y2, corIn);

        retas.push(new Reta(pInicial, pFinal));
    }
    return retas;
}

function isToPlotTrivial(aInicial, aFinal){
    return (inFrame(aInicial) && inFrame(aFinal));
}

function isToClipTrivial(posArrayInicial, posArrayFinal){
    for(var i = 0; i < 4; i++){
        if(posArrayFinal[i] && posArrayInicial[i]){
            return true;
        }
    }
    return false;
}

function inFrame(posArray){
    for(let i in posArray){
        if(posArray[i]){
            return false;
        }
    }
    return true;
}

function getFramePositionArray(ponto, frame){
    //              A B R L
    //              0 1 2 3
    let posArray = [0,0,0,0]
    if(ponto.x < frame.pNW.x){
        posArray[3] = 1
    }else if(ponto.x > frame.pNE.x){
        posArray[2] = 1
    }
    if(ponto.y < frame.pNW.y){
        posArray[0] = 1;
    }else if(ponto.y > frame.pSW.y){
        posArray[1] = 1;
    }
    return posArray;
}

function getParameters(){
    var Largura = parseInt(document.getElementById("x1").value);
    var Altura = parseInt(document.getElementById("y1").value);

    var xmin = parseInt(document.getElementById("xmin").value);
    var ymin = parseInt(document.getElementById("ymin").value);

    var xmax = parseInt(document.getElementById("xmax").value);
    var ymax = parseInt(document.getElementById("ymax").value);

    var numRetas = parseInt(document.getElementById("numRetas").value);

    var cor = 'black';
    
    var frame = new Frame(Largura, Altura);
    frame.pNE = new Ponto(xmax, ymin, cor);
    frame.pNW = new Ponto(xmin, ymin, cor);
    frame.pSW = new Ponto(xmin, ymax, cor);
    frame.pSE = new Ponto(xmax, ymax, cor);

    return {
        frame: frame,
        numRetas: numRetas
    }
}

function desenharFrame(frame){
    desenharLinha(new Reta(frame.pNE, frame.pNW))
    desenharLinha(new Reta(frame.pNE, frame.pSE))
    desenharLinha(new Reta(frame.pSW, frame.pSE))
    desenharLinha(new Reta(frame.pSW, frame.pNW))
}

// 30 30 250 45
function desenhar(){
    var x1 = parseInt(document.getElementById("x1").value);
    var y1 = parseInt(document.getElementById("y1").value);
    var x2 = parseInt(document.getElementById("x2").value);
    var y2 = parseInt(document.getElementById("y2").value);

    var pInicial = new Ponto(x1,y1);
    var pFinal = new Ponto(x2,y2)
    var reta = new Reta(pInicial, pFinal)

    desenharLinha(reta);
}

function Frame(width, height){
    this.Largura = width;
    this.Altura = height;
    this.pNE;
    this.pNW;
    this.pSW;
    this.pSE;
}

function Reta(p1, p2){
    this.pInicial = p1;
    this.pFinal = p2;
    this.getM = ()=>{
        return ((p2.y - p1.y)/(p2.x - p1.x))
    }
}

function Ponto(x, y, cor){
    this.x = x;
    this.y = y;
    this.cor = cor || "black";
}
function desenharLinha(reta, isInverted){
    bresenham(reta, isInverted);
}
function bresenham(reta, isInverted){
    var pInicial = reta.pInicial;
    var pFinal = reta.pFinal;

    if(pInicial.x > pFinal.x){
        var z = pFinal;
        pFinal = pInicial;
        pInicial = z;
    }

    var deltaX, deltaY, incrE, incrNE, d; 
    deltaX = Math.abs(pFinal.x - pInicial.x);
    deltaY = Math.abs(pFinal.y - pInicial.y);
    
    if(Math.abs(deltaY/deltaX) > 1){
        var pI = new Ponto(pInicial.y, pInicial.x, pInicial.cor);
        var pF = new Ponto(pFinal.y, pFinal.x, pFinal.cor);

        desenharLinha(new Reta(pI, pF), true);
        return;
    }

    d = deltaY * 2 - deltaX;
    incrE = deltaY * 2;
    incrNE = (deltaY - deltaX) * 2;

    var yIncrement = 1;
    if(pInicial.y > pFinal.y){
        yIncrement = -1;
    }
    
    var ponto = new Ponto(pInicial.x, pInicial.y, pInicial.cor);

    drawPixel(ponto);
    while(ponto.x < pFinal.x){
        if(d <= 0){
            d += incrE;
        }else{
            d +=incrNE;
            ponto.y += yIncrement;
        }
        ponto.x++;
        if(isInverted){
            drawPixel(new Ponto(ponto.y, ponto.x, ponto.cor));
        }else{
            drawPixel(ponto);
        }
    }
}

function limpar(){
    ctx.clearRect(0,0, width, height)
}

function drawPixel(p){
    ctx.fillStyle = p.cor;	
    ctx.fillRect(p.x, p.y, 1, 1);
}