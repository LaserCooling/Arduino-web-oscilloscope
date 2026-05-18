let port;
let reader;
let writer;

let x = [];
let y1 = [];
let y2 = [];
let y3 = [];

for(let i=0;i<300;i++){

    x.push(i);

    y1.push(0);
    y2.push(0);
    y3.push(0);
}

Plotly.newPlot('graph',[

{
x:x,
y:y1,
mode:'lines',
name:'CH1',
line:{color:'#58a6ff',width:2}
},

{
x:x,
y:y2,
mode:'lines',
name:'CH2',
line:{color:'#3fb950',width:2}
},

{
x:x,
y:y3,
mode:'lines',
name:'CH3',
line:{color:'#f85149',width:2}
}

],

{
paper_bgcolor:'#0d1117',
plot_bgcolor:'#0d1117',

font:{color:'#e6edf3'},

xaxis:{
title:'Samples',
gridcolor:'#30363d'
},

yaxis:{
range:[-2,7],
title:'Voltage',
gridcolor:'#30363d'
}
}

);

document.getElementById('connectButton')
.addEventListener('click',connectArduino);

async function connectArduino(){

    port = await navigator.serial.requestPort();

    await port.open({
        baudRate:115200
    });

    writer = port.writable.getWriter();

    reader = port.readable.getReader();

    readSerial();

    sendFrequencies();
}

async function sendFrequencies(){

    setInterval(async ()=>{

        let f1 =
        parseInt(
        document.getElementById('freq1').value
        );

        let f2 =
        parseInt(
        document.getElementById('freq2').value
        );

        let f3 =
        parseInt(
        document.getElementById('freq3').value
        );

        let data =
        new Uint8Array([f1,f2,f3]);

        await writer.write(data);

    },100);

}

async function readSerial(){

    while(true){

        const { value, done } =
        await reader.read();

        if(done){
            reader.releaseLock();
            break;
        }

        if(value && value.length >= 3){

            let ch1 = (value[0]/255)*5;
            let ch2 = (value[1]/255)*5;
            let ch3 = (value[2]/255)*5;

            // CHECKBOXES

            if(
            document.getElementById('chk1').checked
            ){
                y1.push(ch1 + 2);
            }
            else{
                y1.push(null);
            }

            y1.shift();

            if(
            document.getElementById('chk2').checked
            ){
                y2.push(ch2);
            }
            else{
                y2.push(null);
            }

            y2.shift();

            if(
            document.getElementById('chk3').checked
            ){
                y3.push(ch3 - 2);
            }
            else{
                y3.push(null);
            }

            y3.shift();

            Plotly.update('graph',{
                y:[y1,y2,y3]
            });
        }
    }
}