function stopBothVideoAndAudio(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
    });
}

async function removeTracksFunction(newStream) {
    let videoTrack = newStream.getVideoTracks()[0];
    let audioTrack = newStream.getAudioTracks()[0];
  
    newStream.removeTrack(videoTrack);
    newStream.removeTrack(audioTrack);
  
    // Stream will be empty
    console.log(newStream.getTracks());
  }

// stop only camera
function stopVideoOnly(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live' && track.kind === 'video') {
            track.stop();
        }
    });
}

// stop only mic
function stopAudioOnly(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live' && track.kind === 'audio') {
            track.stop();
        }
    });
}

module.exports ={stopAudioOnly,stopVideoOnly,stopBothVideoAndAudio,removeTracksFunction}