const peer = new Peer();
var currentCall;
peer.on("open", function (id) {
	document.getElementById("uuid").textContent = id;
});
async function callUser() {
	const peerId = document.querySelector("input").value;
	const stream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true,
	});
	document.getElementById("menu").style.display = "none";
	document.getElementById("live").style.display = "block";
	document.getElementById("local-video").srcObject = stream;
	document.getElementById("local-video").play();

	const call = peer.call(peerId, stream);

	call.on("stream", (stream) => {
		document.getElementById("remote-video").srcObject = stream;
		document.getElementById("remote-video").play();
	});
	call.on("data", (stream) => {
		document.querySelector("#remote-video").srcObject = stream;
	});
	call.on("error", (err) => {
		console.log(err);
	});
	call.on('close', () => {
		endCall();
	});
	currentCall = call;
}
peer.on("call", (call) => {
	if (confirm(`Accept call from ${call.peer}?`)) {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				document.querySelector("#local-video").srcObject = stream;
				document.querySelector("#local-video").play();
				call.answer(stream);
				currentCall = call;
				document.querySelector("#menu").style.display = "none";
				document.querySelector("#live").style.display = "block";
				call.on("stream", (remoteStream) => {
					document.getElementById("remote-video").srcObject = remoteStream;
					document.getElementById("remote-video").play();
				});
			})
			.catch((err) => {
				console.log("Failed to get local stream:", err);
			}
		);
	} else {
		call.close();
	}
});
function endCall() {
	// Go back to the menu
	document.querySelector("#menu").style.display = "block";
	document.querySelector("#live").style.display = "none";
	if (!currentCall) return;
	try {
		currentCall.close();
	} catch { }
	currentCall = undefined;
}