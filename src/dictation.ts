declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

let recognition: any = null;
let lastAddedFinalResultIndex = -1;
let isRecognitionRunning = false;
let shouldRestartRecognition = false;

export function startDictation(
  language: string,
  receivedEventsCallback: (message: string) => void
) {
  recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = language;

  recognition.onstart = () => {
    isRecognitionRunning = true;
  };

  recognition.onend = () => {
    isRecognitionRunning = false;
    if (shouldRestartRecognition) {
      recognition.start();
      shouldRestartRecognition = false; 
    }
  };

  recognition.onerror = (error: any) => {
    console.log("Speech Recognition Error: ", error);

    if (error.error === "no-speech") {
      console.log("No speech detected, restarting recognition...");
      restartDictation(); 
    } else {
      isRecognitionRunning = false;
    }
  };

  recognition.onresult = (event: any) => {
    const newMessages: string[] = [];
    Array.from(event.results).forEach((result: any, resultIndex) => {
      if (result.isFinal && resultIndex > lastAddedFinalResultIndex) {
        lastAddedFinalResultIndex = resultIndex;
        newMessages.push(result[0].transcript);
      }
    });

    if (newMessages.length > 0) {
      const transcription = newMessages.join(" ").trim();
      receivedEventsCallback(transcription);
    }
  };

  if (!isRecognitionRunning) {
    recognition.start();
  }
}

export function restartDictation() {
  lastAddedFinalResultIndex = -1;

  if (recognition && isRecognitionRunning) {
    shouldRestartRecognition = true;
    recognition.stop(); 
  } else if (recognition) {
    recognition.start();
  }
}

export function stopDictation() {
  if (recognition && isRecognitionRunning) {
    recognition.stop();
  }
}
