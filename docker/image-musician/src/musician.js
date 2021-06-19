/**
 * Author       : Blanc Jean-Luc
 * Description  : Musician application for the Orchestra project
 */

 const dgram = require('dgram');
 const socket = dgram.createSocket('udp4');
 const { v4: uuidv4 } = require ('uuid');
 const UDP_PORT = 9904;
 const TCP_PORT = 2205;
 const MULTICAST = "239.255.22.5";
 const WAITING_TIME = 1000;
 const SOUNDS = new Map();
 SOUNDS.set('piano','ti-ta-ti');
 SOUNDS.set('trumpet','pouet');
 SOUNDS.set('flute','trulu');
 SOUNDS.set('violin','gzi-gzi');
 SOUNDS.set('drum','boum-boum');

var musician = {
    uuid : uuidv4(),
    sound : validInstrument(process.argv[2])
};

/**
 * Functions
 */

function validInstrument(instrument) {
    if(SOUNDS.has(instrument)){
        console.log("The instrument is valid.");
    }
    else{
        console.log("The instrument is invalid");
        process.exit(1);
    }
    return SOUNDS.get(instrument);
}


function playInstrument(){
    var msg = JSON.stringify(musician);
    socket.send(msg, 0, msg.length, UDP_PORT, MULTICAST);
    console.log("Sent message to " + MULTICAST + ":" + UDP_PORT);
}


//execute application each second
setInterval(playInstrument, WAITING_TIME);