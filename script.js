let port;
let reader;

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
line:{color:'cyan'}
},

{
x:x,
y:y2,
mode:'lines',
name:'CH2',
line:{color:'yellow'}
},

{
x:x,
y:y3,
mode:'lines',
name:'CH3',
line:{color:'red'}
}

],

{
paper_bgcolor:'#111',
plot_bgcolor:'#111',

font:{color:'white'},

yaxis:{
range:[-2,7],
title:'Voltage'
},

xaxis:{
title:'Samples'
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

    reader = port.readable.getReader();

    readSerial();
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

            y1.push(ch1 + 2);
            y1.shift();

            y2.push(ch2);
            y2.shift();

            y3.push(ch3 - 2);
            y3.shift();

            Plotly.update('graph',{
                y:[y1,y2,y3]
            });
        }
    }
}