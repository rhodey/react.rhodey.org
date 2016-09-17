!!!
radiowitness-decoding-p25
September 14, 2016
The RadioWitness.io DSP Pipeline Part 2, Decoding P25
In the second entry of this series I walk you step by step through the process of decoding digital bits from an analog RF signal. The fundamentals of *Digital Signal Processing* are all covered in detail including sampling, frequency translation, resampling, baseband filtering, demodulation, and decoding. This is the *"DSP for Software Engineers"* guide I wish I had 18 months ago.
!!!


In the [previous post](/blog/radiowitness-where-to-start) I introduced the [Radio Witness Project](https://radiowitness.io), outlined the contents of this series, and basically laid out my excuse for ditching all prior work and starting from scratch. Decoding P25 took me months to understand but I hope to explain it to you in a few minutes (✿◠‿◠).

> **Project 25** (**P25** or **APCO-25**) is a suite of standards for [digital](https://en.wikipedia.org/wiki/Digital_radio) [radio](https://en.wikipedia.org/wiki/Professional_Mobile_Radio) communications for use by federal, state/province and local [Public safety organizations](https://en.wikipedia.org/wiki/Public_safety_organizations) in [North America](https://en.wikipedia.org/wiki/North_America) to enable them to communicate with other agencies and mutual aid response teams in emergencies.

To put it more simply, the P25 protocol specifies how analog audio from a microphone should be digitally encoded and decoded for transmission over an *RF* (Radio Frequency) signal. The Radio Witness Project is solely about archiving radio broadcasts so we can forget entirely about encoding and transmitting. In general, the process of decoding digital bits from an analog RF signal can be broken down into the following steps:

1. Sampling ([code example](https://github.com/radiowitness/dsp-common/blob/master/src/main/java/org/anhonesteffort/dsp/sample/TunableSamplesSource.java))
2. Frequency Translation ([code example](https://github.com/radiowitness/dsp-common/blob/master/src/main/java/org/anhonesteffort/dsp/filter/ComplexNumberFrequencyTranslatingFilter.java))
3. Resampling ([code example](https://github.com/radiowitness/dsp-common/blob/master/src/main/java/org/anhonesteffort/dsp/filter/rate/ComplexNumberResamplingFilter.java))
4. Baseband Filtering ([code example](https://github.com/radiowitness/dsp-common/blob/master/src/main/java/org/anhonesteffort/dsp/filter/ComplexNumberFirFilter.java))
5. Demodulation ([code example](https://github.com/radiowitness/p25-common/blob/master/src/main/java/org/anhonesteffort/p25/filter/demod/ComplexNumberCqpskDemodulator.java))
5. Decoding ([code example](https://github.com/radiowitness/p25-common/blob/master/src/main/java/org/anhonesteffort/p25/filter/decode/QpskPolarSlicer.java))

## Sampling
Sampling is what software defined radios do for us. We define a *Sample Rate* in units of samples per second and then `N` times every second the SDR will read the electrical signal from its antenna and pass it through an [*ADC* (Analog to Digital Converter)](https://en.wikipedia.org/wiki/Analog-to-digital_converter). The ADC maps electrical signals to their digital equivalent known as *IQ Samples* which are almost always represented by two floats (*I&Q*). These IQ samples are sent to the host computer over USB or Ethernet and that's what we've got to work with.

To make sense of these IQ samples we also have to specify a *Center Frequency*. The RF spectrum is (infinitely?) large, so the center frequency is used to tell the SDR what part of the spectrum we'd like to observe.

* With a center frequency of `850MHz` and sample rate of `2,000,000Sps` we can observe what's going on in the spectrum between `849MHz` and `851MHz`.
* With a center frequency of `852MHz` and sample rate of `4,000,000Sps` we can observe what's going on in the spectrum between `850MHz` and `854MHz`. See how this works?

## Frequency Translation
Software defined radios are physical hardware and thus imperfect, what this means for us is that **the closer our signal of interest is to the SDR center frequency the more it will be distorted**. For example, if we'd like to observe `852,275,000Hz` we should tune our SDR to `852,375,000Hz` and *Frequency Translate* the IQ sample stream by `100KHz`.

If we possessed the perfect SDR frequency translation would still come into play when we need to observe multiple signals concurrently. For example, if we'd like to observe `852MHz` and `853MHz` concurrently we would likely tune our SDR to `852.5MHz`, duplicate the sample stream once, and frequency translate both IQ sample streams by `+/-500KHz`. In summary, **frequency translation is something that happens on the host computer and is used to move a signal of interest from its position relative to the SDR center frequency… to `0Hz`.**

## Resampling
Whenever we refer to a signal in the RF spectrum we need to specify both a target frequency and sample rate. However, usually the sample rate we use to observe the spectrum is not the same exact sample rate used to transmit the target signal. Much like CPUs on a motherboard every SDR has a *Master Clock Rate*, the sample rates supported by your SDR consist exclusively of integer divisors upon the master clock. A `64MHz` master clock will allow rates `32MHz`, `16MHz`, `8MHz`, etc. but definitely not `60MHz`.

**More samples == more processing** so naturally we want to *Resample* to the lowest rate possible, i.e. the original sample rate of the target signal. Resampling is performed by the host computer, increasing the sample rate of a signal is known as *Interpolation* while decreasing the sample rate is known as *Decimation*. The simplest way to resample a signal is to pass it through one or more *[CIC Filters](https://en.wikipedia.org/wiki/Cascaded_integrator%E2%80%93comb_filter)*.

An *Interpolating CIC Filter* ([source code](https://github.com/radiowitness/dsp-common/blob/master/src/main/java/org/anhonesteffort/dsp/filter/rate/ComplexNumberFirstOrderCicInterpolatingFilter.java)) inserts a zero-valued sample once every `N` samples while a *Decimating CIC Filter* ([source code](https://github.com/radiowitness/dsp-common/blob/master/src/main/java/org/anhonesteffort/dsp/filter/rate/ComplexNumberFirstOrderCicDecimatingFilter.java)) throws away one of every `N` samples. For CIC filters `N` must always be an integer, however if we send the output of one interpolating CIC filter to the input of a decimating CIC filter we can resample by fractions, i.e. `(N1/N2)`. Computationally CIC filters are the most efficient resampling process but for some applications they distort the target signal too much to be appropriate, for P25 they do just fine.

## Baseband Filtering
After resampling we're left with an IQ sample stream which:

1. contains the target signal
2. is centered around the target frequency
3. is as close to the target sample rate as possible

However, our sample stream includes more than just the target signal, it also includes small traces of everything else within the RF spectrum, this is called to as *Noise*. For the best possible decode quality we'd operate on a sample stream containing zero noise, *Baseband Filtering* is the process of reducing noise.

This next detail is the hardest to grasp conceptually: **in digital signal processing, all filtering reduces to multiplying arrays of floats**. Recall that what we get out of an SDR is IQ samples, and that IQ samples are just two floats, so our sample stream is really an infinite array of float pairs:

```
[0.5, 0.25], [0.6, 0.9], [0.5, 0.25], [0.6, 0.9], [0.5, 0.25] ...
```

Imagine that `[0.50, 0.25]` is the target signal and `[0.6, 0.9]` is the noise, we can filter out the noise entirely by passing (multiplying) two IQ samples at a time through the following filter:
```
[1.0, 1.0], [0.0, 0.0]
```

See how the `[0.50, 0.25]` samples will be passed through without distortion while the `[0.6, 0.9]` samples will be zeroed out completely? In summary, **a DSP filter is just an array of weights, the index of each weight corresponds to a frequency band in the RF spectrum.**

## Demodulation
After baseband filtering we're left with a sample stream referred to as *Baseband*, all the operations we've performed up to this point have essentially narrowed our focus from the entirety of the RF spectrum to this small chunk containing the target signal. *Demodulation* is the process of reversing the *Modulation* the target transmitter performed on baseband, and while the previous four steps are near identical regardless of the target signal, modulation and demodulation are extremely application specific. To explain this more clearly I think I need an analogy:

> Imagine you and I are standing atop two hills a mile apart and need to communicate a message. First we'd both open our eyes and begin sampling the visible spectrum, then we'd turn our heads until we spotted each other, and finally focus in using binoculars. The view each of us has through our binoculars is baseband, a small chunk of what we could possibly be looking at. Now, to communicate the message we devise a protocol using colored flags, raising a blue flag means `0`, raising red means `1`; done.

The analogy above takes place in the visible spectrum and uses raised flags to modify baseband, P25 takes place in the RF spectrum and uses [*CQPSK* (Continuous Quadrature Phase Shift Keying)](https://en.wikipedia.org/wiki/Phase-shift_keying) to modify baseband. **To communicate information you must modify the spectrum you're working with in some predefined way, modifying the RF spectrum is always called modulation.**

CQPSK is difficult to explain fully, but in summary it is a method for modulating the *[Phase](https://en.wikipedia.org/wiki/Phase_(waves))* of a *[Carrier Wave](https://en.wikipedia.org/wiki/Carrier_wave)* in four distinct ways (thus quadrature): `[+0°, +90°, +180°, +270°]`. The most common way to demodulate PSK is through combination of a *[Costas Loop](https://en.wikipedia.org/wiki/Costas_loop)* and *[Gardner Detector](http://www.nutaq.com/blog/implementation-gardner-symbol-timing-recovery-system-generator)*, I won't get into the specifics but you can find my code implementation [here](https://github.com/radiowitness/p25-common/blob/master/src/main/java/org/anhonesteffort/p25/filter/demod/ComplexNumberCqpskDemodulator.java). After sending our baseband sample stream through a CQPSK demodulating filter the output is a stream of samples representing the four previously mentioned phase changes and **OMG WE ARE SO CLOSE NOW**.

## Decoding
If our target signal was analog audio like walkie talkies or FM radio we'd be done here, demodulated baseband would be sent to a speaker and we'd hear [Rihanna](https://www.youtube.com/watch?v=wfN4PVaOU5Q). But P25 (along with most modern RF signals) is a digital signal, meaning we need to map the demodulated output to a set of digital symbols. The decoding step of P25 is easy ([source code](https://github.com/radiowitness/p25-common/blob/master/src/main/java/org/anhonesteffort/p25/filter/decode/QpskPolarSlicer.java)). With four distinct phase changes each phase change represents `2 bits` of information so our value space is `[0->3]`, whala, digital!

```
[+0° -> 2], [+90° -> 0], [+180° -> 1], [+270° -> 3]
```

## Error Correcting
It's important to understand that decoding RF is always an approximation, the accuracy of which depends largely on the quality of the baseband we've constructed and the demodulation we performed. Often times *[Error Correcting Codes](https://en.wikipedia.org/wiki/Error_detection_and_correction)* are incorporated into the digital protocol to account for imperfections in the transmit and receive signal processing chains. P25 makes significant use of *[Hamming](https://en.wikipedia.org/wiki/Hamming_code)* and *[Reed-Solomon Codes](https://en.wikipedia.org/wiki/Reed%E2%80%93Solomon_error_correction)* for error correction, [they really are a pain](https://github.com/radiowitness/p25-common/blob/master/src/main/java/org/anhonesteffort/p25/ecc/ReedSolomon_63.java).

## Wiring it All Together
Frequency translation, resampling, baseband filtering, demodulating, and decoding all come together in the class [P25Channel.java](https://github.com/radiowitness/p25-common/blob/master/src/main/java/org/anhonesteffort/p25/P25Channel.java). *P25Channel* consumes an array of IQ samples, feeds them through the decoding pipeline, transforms the bit stream into P25 packets, and then hands off the packets in a callback to each of its listeners. After writing this class all the heavy lifting and extreme confusion was over, I finally had [dsp-common](https://github.com/radiowitness/dsp-common) and [p25-common](https://github.com/radiowitness/p25-common), the libraries I almost wish I never had to write.

In part three of this series I'll explain how the most compute heavy part of this pipeline (frequency translation + resampling) was broken out into its own micro-service ([chnlzr-server](https://github.com/radiowitness/chnlzr-server)), and how chnlzr-server makes use of the [LMAX Disruptor](https://lmax-exchange.github.io/disruptor/) which has become so popular in High-Frequency Trading today.
