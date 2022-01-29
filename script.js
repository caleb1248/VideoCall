import "https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"
navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream) => {
	var peer = new Peer
})