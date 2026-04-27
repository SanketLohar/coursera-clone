import React, { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

const extractVideoId = (urlOrId: string) => {
  if (!urlOrId) return "";
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})|([a-zA-Z0-9_-]{11})/;
  const match = urlOrId.match(regExp);
  if (match) {
    if (match[1]) return match[1];
    if (match[2]) return match[2];
  }
  return urlOrId;
};

const Videolayer = ({ videoId, title }: any) => {
  const parsedId = extractVideoId(videoId);
  const [savedTime, setSavedTime] = useState<number>(0);
  const [showResume, setShowResume] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (parsedId) {
      const storedTime = localStorage.getItem(`courseraClone_videoTime_${parsedId}`);
      if (storedTime && !isNaN(parseFloat(storedTime)) && parseFloat(storedTime) > 5) {
        setSavedTime(parseFloat(storedTime));
        setShowResume(true);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [parsedId]);

  const onReady: YouTubeProps["onReady"] = (event) => {
    setPlayer(event.target);
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    // PLAYING state is 1
    if (event.data === 1) {
      setShowResume(false);
      intervalRef.current = setInterval(() => {
        const currentTime = event.target.getCurrentTime();
        if (parsedId && currentTime) {
          localStorage.setItem(`courseraClone_videoTime_${parsedId}`, currentTime.toString());
        }
      }, 5000); // Save every 5 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // ENDED state is 0
      if (event.data === 0 && parsedId) {
        localStorage.removeItem(`courseraClone_videoTime_${parsedId}`);
      }
    }
  };

  const handleResume = () => {
    if (player && savedTime > 0) {
      player.seekTo(savedTime, true);
      player.playVideo();
      setShowResume(false);
    }
  };

  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
    },
  };

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg relative bg-black">
      {parsedId ? (
        <>
          <YouTube
            videoId={parsedId}
            opts={opts}
            onReady={onReady}
            onStateChange={onStateChange}
            className="w-full h-full absolute inset-0"
            iframeClassName="w-full h-full"
          />
          {showResume && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 p-6 text-center">
              <h3 className="text-white text-xl font-bold mb-4">You left off at {Math.floor(savedTime / 60)}:{Math.floor(savedTime % 60).toString().padStart(2, '0')}</h3>
              <div className="flex gap-4">
                <button
                  onClick={handleResume}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                >
                  Resume Watching
                </button>
                <button
                  onClick={() => setShowResume(false)}
                  className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          Invalid Video ID
        </div>
      )}
    </div>
  );
};

export default Videolayer;
