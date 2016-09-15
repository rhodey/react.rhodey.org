# The RadioWitness.io DSP Pipeline Part 1, Where to Start?
![](/img/radiowitness/view-cities.png)

The [Radio Witness Project](http://radiowitness.io) began in 2015 with the goal of making police radio broadcasts more accessible to journalists. From the very start it was obvious that this would be a lot of work but I really didn’t expect 18 months and three cycles of burnout. I’m not a Radio Engineer, this project is much more *“Digital Signal Processing by Software Engineers”* than it is *“Software by Radio Engineers”* and to me that’s something that feels kinda new. Here’s a bulleted list of words to keep you thirsty for the remainder of this series:

* DSP at millions of samples per second, **with Java**
* Network connected [CIC filter bank](https://en.wikipedia.org/wiki/Cascaded_integrator%E2%80%93comb_filter), with [Netty](http://netty.io/)
* [P25](https://en.wikipedia.org/wiki/Project_25) decoding REST micro-service, with [Dropwizard](http://www.dropwizard.io/)
* Amazon [Kinesis](https://aws.amazon.com/kinesis/), [Lambda](https://aws.amazon.com/lambda/), and pretty [CloudWatch](https://aws.amazon.com/cloudwatch/) metrics

## Project Requirements
I wish I had a fancy PDF to embed here or even a picture of some napkin with vague milestones, but I don’t. For many months all I could say for certain was that I needed to decode police radio using a [Software Defined Radio](https://en.wikipedia.org/wiki/Software-defined_radio) connected to commodity hardware with as little human interaction as possible. My best work comes through heavy iteration and with zero existing DSP knowledge the only question I could ask was “where to start?”. Was there existing DSP software out there I could play with and modify in a way that taught me something?

## Evaluating GNU Radio
It is difficult to think about Software Defined Radio without *[GNU Radio](http://gnuradio.org/)* also popping into mind, and for good reason! GNU Radio has been around since the beginning of the SDR boom and has almost definitely received more development hours than any other open source DSP project. GNU Radio is comprised of a general purpose DSP library and an extremely powerful graphical application called *GRC* (GNU Radio Companion).

![](/img/radiowitness/gnu-radio-companion.png)

Use of GRC is very thoroughly documented in many tutorials all across the internet, if there is an RF signal you want to analyze chances are someone’s already recorded the process on YouTube. GRC tutorials for listening to police radio have existed for years but all of them involve a desktop environment and skilled human operator, nothing that could run by itself on a headless server for months on end. I figured out pretty quickly that GRC was a tool for experimentation and that I’d have to script with the library to create any real applications.

I checked out GNU Radio from source and thus began months of continued frustration. Building the project involves C, C++, and Python source code with *[SWIG](http://www.swig.org/)* taping everything together, the build definitely didn’t succeed first time and there’s no chance I can recall all the little hacks I had to make for it to finally succeed. Eventually I was able to launch GRC and sanity check my build with a few tutorials, but when it came to running the included example Python scripts against the library **nothing worked at all, not even a little**.

## Evaluating OP25
After some time I decided it’d be best to put the official GNU Radio examples out of mind and search elsewhere for examples of use, to my great surprise I found *[OP25](http://op25.osmocom.org/trac/wiki)*.

> OP25 is a not-for-profit project to bring together folks that are interested in implementing APCO P25 using a software-defined radio. Our goal is to build a software-defined analyzer for APCO P25 signals that is available under the GNU Public License (GPL).

[P25](https://en.wikipedia.org/wiki/Project_25) is the most popular protocol for police and first responder radio in the United States, could it be that my work was already near complete? I rushed to find install instructions and step by step began to have GNU Radio build process flashbacks in a very bad way. Long story short I found a magic thread on the [RadioReference.com forums](http://forums.radioreference.com/) that instructed me to checkout a magic revision number on a magic SVN branch and finally I had something.

![](/img/radiowitness/op25.png)

Over the next few weeks I spent a lot of time blindly fiddling with OP25 buttons, sliders, and command line options atop my roof in Oakland, California. Every now and then I’d decode a few seconds of OPD audio but was never able to hit a stable state and my laptop was running very hot without much to show for it. To make OP25 work for me I’d have to decouple the GUI from the P25 decoding pipeline and improve performance significantly.

I still understood very little about what OP25 was doing behind the GUI and toying with the codebase did little to help — honestly I gave up pretty quickly. At that point I was seriously burnt out on GNU Radio and convinced to find something wildly different.

## Evaluating SDRTrunk
[SDRTrunk](https://github.com/DSheirer/sdrtrunk) is a project by a stubborn Java fanatic who, much like myself, appears to be dead set on proving that you don’t have to write C to write performant DSP applications. At that time the project was hosted on Google Code so I checked out the trunk branch, ran the ant build process, and it succeeded first time! I was able to launch the GUI and browse around the features but the only SDR I owned was the [USRP B100](http://files.ettus.com/manual/page_usrp_b100.html) which SDRTrunk did not support. Elated by the simple build process and pure-Java codebase I felt comfortable committing my time to add USRP support to the project, at this point I understood three things about the task at hand:

1. Software defined radios measure radio frequency through *sampling*.
2. Each *sample* can be represented as a pair of floats, *I&Q*.
3. If I could get the floats into SDRTrunk it’d magically handle the rest.

My SDR is a USRP model B100; now discontinued, this was one of the first software defined radios to be offered in a long line of excellent products from Ettus Research. Ettus is professional, the dozens of radios available in their USRP series are all programmable via *“UHD”* the Universal Hardware Driver. UHD is written in C++ and exposes a clean, versioned API which hides all the complexity of device discovery, USB vs Ethernet transport, and other things you’d like to not think about. I spent a couple days trying to wrap the C++ API using the JNI (Java Native Interface) before I discovered [JavaCPP](https://github.com/bytedeco/javacpp).

> JavaCPP provides efficient access to native C++ inside Java, not unlike the way some C/C++ compilers interact with assembly language. No need to invent new languages such as with [SWIG](http://www.swig.org/), [SIP](http://riverbankcomputing.co.uk/software/sip/), [C++/CLI](http://www.ecma-international.org/publications/standards/Ecma-372.htm), [Cython](http://www.cython.org/), or [RPython](https://pypi.python.org/pypi/rpython) as required by[cppyy](http://doc.pypy.org/en/latest/cppyy.html). Instead, it exploits the syntactic and semantic similarities between Java and C++. Under the hood, it uses JNI, so it works with all implementations of Java SE, in addition to [Android](http://www.android.com/), [Avian](https://readytalk.github.io/avian/), and [RoboVM](http://www.robovm.org/) ([instructions](https://github.com/bytedeco/javacpp#instructions-for-android-avian-and-robovm)).

Over the next few months I created the [uhd-java](https://github.com/radiowitness/uhd-java) library and then hooked it into SDRTrunk by example of the SDR drivers already existing in their codebase. Writing uhd-java was a lot of work but integration with SDRTrunk was refreshingly straightforward and required little knowledge of digital signal processing. Finally I had something that built easily, ran as expected, and could be modified and rebuilt without great trouble.

![](/img/radiowitness/sdr-trunk.png)

## Starting From Scratch With dsp-common
Working with SDTrunk taught me **a lot**, I spent a month or two toying with the codebase and this more than anything else became the foundation of my DSP education. However, just like with GNU Radio this was a DSP GUI and library in one project and the library was not easily decoupled. With nowhere else to turn I very reluctantly began work on [dsp-common](https://github.com/radiowitness/dsp-common). If I was to start this over today I’d probably begin with [luaradio](http://luaradio.io/) which at the time did not exist.

Stay tuned for part two of this series ([here it is!](https://medium.com/@rhodey/the-radiowitness-io-dsp-pipeline-part-2-decoding-p25-6157c573d11b#.2bg5ts22s)) in which I’ll introduce you to basic digital signal processing concepts, give an overview of P25 decoding, and explain how [dsp-common](https://github.com/radiowitness/dsp-common) and [p25-common](https://github.com/radiowitness/p25-common) are used by the Radio Witness Project.
