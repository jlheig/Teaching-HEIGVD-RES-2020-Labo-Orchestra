/**
 * Author       : Blanc Jean-Luc
 * Description  : Auditor application for the Orchestra project
 */

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const moment = require('moment');
const UDP_PORT = 9904;
const TCP_PORT = 2205;
const MULTICAST = 239.255.22.5;
const WAITING_TIME = 5;
const INSTRUMENTS = new Map();
INSTRUMENTS.set('ti-ta-ti','piano');
INSTRUMENTS.set('pouet','trumpet');
INSTRUMENTS.set('trulu','flute');
INSTRUMENTS.set('gzi-gzi','violin');
INSTRUMENTS.set('boum-boum','drum');

var musicians = new Map();

/**
 * Functions
 */

function Musician(id, instrument, date) {
    this.uuid = id;
    this.instrument = instrument;
    this.lastActivity = date;
}

function validSound(sound) {
    if(INSTRUMENTS.has(sound)){
        console.log("The sound is valid.");
    }
    else{
        console.log("The sound is invalid");
        process.exit(0);
    }
    return INSTRUMENTS.get(sound);
}

/**
 * UDP Configuration
 */

//listening
socket.bind(UDP_PORT, function(){
    socket.addMembership(MULTICAST);
});

//getting informations on musicians
socket.on('message', function (msg) {
    const musicianInfo = JSON.parse(msg);
    musicians.set(musicianInfo.uuid, new Musician(musicianInfo.uuid, validSound(musicianInfo.sound), new Date()));
});

/**
 * TCP Server
 */

 const net = require("net");
 const server = net.createServer(function (socket) {
    var musiciansReceived = [];
    musicians.forEach((musician) => {
        if (moment(Date.now()).diff(musician.lastActivity, 'seconds') <= WAITING_TIME)
            musiciansReceived.push(musician);
        else
            musicians.delete(musician);
    });
    socket.write(musiciansReceived);
    socket.end();
 });

 server.listen(TCP_PORT);