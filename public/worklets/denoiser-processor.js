class DenoiserProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.enhancedBuffer = [];
    this.port.onmessage = (event) => {
      if (event.data.enhancedFrame) {
        // store enhanced frame for playback
        this.enhancedBuffer.push(...event.data.enhancedFrame);
      }
    };
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    if (input.length > 0) {
      const inputChannel = input[0];
      const outputChannel = output[0];

      // collect input samples
      this.buffer.push(...inputChannel);

      // process if we have 480 samples
      while (this.buffer.length >= 480) {
        const frame = this.buffer.splice(0, 480);
        this.port.postMessage({
          frame
        });
      }

      // play back enhanced frames if available
      for (let i = 0; i < outputChannel.length; i++) {
        if (this.enhancedBuffer.length > 0) {
          outputChannel[i] = this.enhancedBuffer.shift();
        } else {
          outputChannel[i] = 0;
        }
      }
    }

    return true;
  }
}

registerProcessor('denoiser-processor', DenoiserProcessor);
