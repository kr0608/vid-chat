'use client'

import { useSocket } from "@/context/SocketContext"
import VideoContainer from "./VideoContainer";
import { useCallback, useEffect, useState } from "react";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

const VideoCall = () => {
    const {localStream, peer, isCallEnded, ongoingCall, handleHangup } = useSocket()
    const [isMicOn, setIsMicOn] = useState(true)
    const [isVidOn, setIsVidOn] = useState(true)

    console.log("peer>>>>", peer?.stream)

    useEffect(() => {
        if(localStream) {
            const videoTrack = localStream.getVideoTracks()[0]
            setIsVidOn(videoTrack.enabled)
            const audioTrack = localStream.getAudioTracks()[0]
            setIsMicOn(audioTrack.enabled)
        }
    }, [localStream])

    const toogleCamera = useCallback(() => {
        if(localStream) {
            const videoTrack = localStream.getVideoTracks()[0]
            videoTrack.enabled = !videoTrack.enabled
            setIsVidOn(videoTrack.enabled)
        }
    }, [localStream])

    const toogleMic = useCallback(() => {
        if(localStream) {
            const audioTrack = localStream.getAudioTracks()[0]
            audioTrack.enabled = !audioTrack.enabled
            setIsMicOn(audioTrack.enabled)
        }
    }, [localStream])

    const isOnCall = localStream && peer && ongoingCall ? true: false

    if(isCallEnded){
        return <div className="mt-5 text-rose-500 text-center">Call Ended</div>
    }

    if(!localStream && !peer) return;

    return( <div>
        <div className="mt-4 relative">
          {localStream && <VideoContainer stream={localStream} isLocalStream={true} isOnCall={isOnCall} />}
          {peer && peer.stream && <VideoContainer stream={peer.stream} isLocalStream={false} isOnCall={isOnCall} />}
        </div>
        <div className="mt-8 flex item-center justify-center">
            <button onClick={toogleMic}>
                   {isMicOn && <MdMicOff size={28}/>}
                   {isMicOn && <MdMic size={28}/>}
                </button>
            <button className="px-4 py-2 bg-rose-500 text-white rounded mx-4" onClick={() => handleHangup({ongoingCall: ongoingCall ? ongoingCall : undefined, isEmitHangup: true })}>
                End call
            </button>
            <button onClick={toogleCamera}>
                {isVidOn && <MdVideocamOff  size={28}/>}
                {isVidOn && <MdVideocam size={28}/>}
            </button>

        </div>
    </div>);
}

export default VideoCall; 