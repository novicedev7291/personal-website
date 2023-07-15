---
title: Python Extension Modules
date: 2023-07-14
tags: python,extension,wrapper
author: Kuldeep Yadav
---
>*Disclaimer:* I am still exploring this space and might have interpreted few
things wrongly here, hence I would advise readers to take it with a pinch of 
salt and explore themselves and don't use the examples in production :-)

Recently in my company, I was asked to analyse a python package which can be 
used to connect with kafka cluster as my team is moving away from tech stack 
which involves languages i.e. Java, C# to languages like python & node.

I have some experience with python as once in my previous company, I used flask
to write an API gateway (not completely, it was just a bad wrapper) and it was
working quite well but then due to maintenance burden of a different tech (which
I only knew at that time), we decided to ditch it completely.

Now coming back to our story, at first I thought, it should be easy as their 
must be some package on pypi, which can be used but there was a catch in my
requirement.

The cluster I had to connect was using `Kerberos` authentication, which to be
honest till date I have not understand completely due to its opaqueness in some
regards and compairing with other authN & authZ patterns i.e. OAuth2, token etc.

Still, I thought there would be some packages available which can be leveraged,
but to my surprise, I could only find 2 packages, `kafka-python` & 
`confluent-kafka`.

It was fine, I just needed one to work, but here comes the challenge,
both packages required SASL feature to be enabled which internally would use
GSS API.

>This is little bit involved as GSS (Generic Security Services API) allows
application to communicate securely using kerberos and requires native library
libkrb5 to be present on client (and its dependencies). These native 
dependencies are available via most package managers i.e. brew, yum, apt etc
to any linux or similar platform. In enterprises, where Microsoft ecosystem is 
ubiquitous, kerberos protocol is used heavily which provides SSO capabilities
and employees only require their system credentials to access any service over
internet. Now this post will become very long if describe the every piece of 
kerberos authentication and at the time of writing this I am not fully 
convinced that I undestand it.

Let's come back to our packages now.

I first gave a try to `kafka-python` as I found an example online demonstrating
producer example using kerberos, but when I tried, it didn't work for me and 
error message were not clear enought what was happening, so I checked the 
package's github issues and I found similar issues posted and in one of the 
issue, the author himself confirmed that he doesn't have much clue about the
SASL implementation as it was patched by community only and doesn't have idea
around how to debug or test it.

Finally, I decided to give up on this and turned towards `confluent-python-kafka`
package, which was also an official package from the `Confluent` (company
behind kafka now).

Now, this package had one big issue, it was not supporting SASL out of the box.
On github, it's README file mentioned that this is a wrapper package on their
existing C/C++ library `librdkafka` and for SASL, simply installing it from
pypi and using in our code, won't work. We would need to install using *source
distribution*, which then link the SASL feature.

Normally, you would expect from any package manager to install the library and
then you can start using it, but in above case we have to do some extra steps.

#### Packages
Languages like java has a concept of bytecode, so every dependency you would 
include in your code would eventually have a jar file hosted on some repository,
and JVM will take care of converting and executing it on any platform, hence 
abstracting away the complexity of creating platform dependent binaries. 

Javascript is also same in that regard but since most js frameworks are using
nodejs, which provides engine to run the js on any machine but also abstracts
the complexity of running your js program on any platform.

Python also uses interpreter Cython to compile and execute the code on any
platform. Since both node and Cython are written in C/C++, its natural to have
the API available so that you can extend the capabilities of these languages.

Python have two types of packages pure python or wrapper packages around native
libraries written in c, c++, rust etc etc. As you might have got the idea that
pure packages are written completely in python and you just install and use them.

Wrapper packages requires more to setup and use because of inherited complexity
of the platform on which it will run. These packages are mostly written in C/C++
and hence require platform specific tools to compile these.

#### My toy example
Before we dive into how these packages are installed and setup, let's understand
the python C/C++ extension API with a small example.

Let's say you have your own module which offers a function sort, which will take
a list and will return the sorted list.
```python
from wildsort import sort

if __name__ == "__main__":
    list = [21, 3, 48, 12, 18,45]
    list = sort(list)
```

Here, I named the module `wildsort` and it will expose the `sort` function, which
will do the sorting and return a new sorted list.

Now this is very simple module with just a simple function but let's see how I
develop this using C API.

First, we need to create the sort function, so I created a `wildsort.c` file and
declare my function as below:
```c
#define PY_SSIZE_T_CLEAN
#include <Python.h>

static PyObject* wildsort_sort(PyObject *self, PyObject *args) {
    return NULL;
}
```
For people who have not written a single line of C, this can be difficult to
understand and I cannot help much here so I would suggest to first write a hello
world in C to relate some of things written above.

Now for those, who knows C, first two lines should be clear atleast from syntax
point of view, since we will be using Python's C API, we need `Python.h`, which
define the contract for whole API. You can ignore the first macro for now. The
function above just return NULL pointer as of now.

After creating the function (this will be our sort function in python code), we
need to create a defination of it to register with our module `wildsort` later.
```c
//...previous code above it will remain here
static PyMethodDef WildsortMethods[] = {
    {"sort", "wildsort_sort", METH_VARARGS, "Sort a number of integers "
    + "but not in performant way"}
}
```

In above code we are using `PyMethodDef` struct to create a method definiton
in our module and here we are mapping the function name going to be in python
`sort` with `wildsort_sort` declared above and defining the parameters type
for the function `METH_VARARGS`, meaning it will take single argument and no
keyword arguments which python offers.

Similarly, we need to create module definition in which we will map the method
definition and then link it to the module creation.
```c
static struct PyModuleDef WildsortModuleDef = {
    Py_ModuleDef_HEAD_INIT, "wildsort", NULL, -1, WildsortMethods
}
```
You can read about the some of the params passed above in python C API docs. Now
we will create the function, which will be called to create and initiaze our 
module when python interpreter starts executing our python code.
```c
static PyMODINT_FUNC PyInit_wildsort(void) {
    return PyModule_create(&WildsortModuleDef);
}
```
Here, one thing to note that the function name should always follow naming 
standard `PyInit_*` and `*` should match with your module name defined in
module definition.

Now, you can write the sort implementation in function `wildsort_sort` method or
can delegate it to any external shared library, which will involve some nitty
gritties of converting python objects from and back to data structures in C.

#### Building the package
Now, in main directory of your code, you need to add `setup.py` with below code
```python
from distutils.core import setup

setup(name = "pywildsort",
      version = "0.1.1",
      description = "Wrapper package in C to be used as python package")
```
You must have some of the module installed in your python distribution to run
above script i.e. setuptools etc. Most of these modules comes pre-installed with
latest python distribution and I guess you won't have to install explicitly.

Now, we need to run below steps to build a python package
```sh
python setup.py build
```
>I would suggest you do these steps by creating a virtual env (check python docs)
otherwise you may run into error using just `python` because on some systems i.e.
Mac OS it points to python 2.x version and command may fail. In that case you may
have to explicitly use `python3.x` variant of command and please check if its on
path but I would recommend using virtual environment.

This will build the source code with available C compiler on your machine and 
will produce the object file(s) and other metadata information into `build` 
directory in root directory of your source code.

Now if you need to test the package, you can instead run the below, which will
install the package into your python installation directory with your have run
the setup.py file.
```sh
python setup.py install
```
>Note if you are using virtual env, then it will install inside the virtual
environment installation location.

You can test the package with the code mentioned in the starting or with python
REPL, keeping in mind that you installed with same python version or virtual
environment.

### Back to our confluent-kafka-python package
Above was just to create the native wrapper package for python, in my case, I 
wanted to understand why I would need to install using  the source distribution for 
`confluent-kafka-python` package and not just install and use it, irrespective
of if it is written using C library or pure python.

#### Some python packaging history
The answer was present in to understanding how python packages are build and 
uploaded to pypi and why there are multiple options to install the packages.

In early days python offerred only one type of packaging format and that was
source distribution, I guess this was easiest choice considering the complexity
involving different platforms.

In this distribution your package's source code will be deployed as zip file 
to pypi and basically when user will install it using `pip`, it will be 
downloaded on user's machine and then bascially `python setup.py install` will
be executed like in our example. Package author would run the below command to
create source distribution and upload it to pypi.
```sh
python setup.py sdist
```

Since this process will be slow if there are projects which require many 
packages and then their dependent packages will all be compiled at user's 
machine, a binary distribution concept was introduced, in which the author will
create platform dependent binary distribution for major platforms and deploy it
on pypi. So when an user install it will receive the precompiled files and `pip`
would just link it with current python interpreter.

In python ecosystem, this binary distributon is called `wheel` and this is the
default mechanism for `pip`. So pip checks for the binary distribution matching
your machine OS and platform and if found it would just download it and unzip
and just link the pre-compiled sources.

But when it doesn't find any matching package to your machine requirement, it
will fallback to source distribution and old ways of compiling and linking as
per your machine arch and tools available. In case tools are not available on
machine to compile and link the source then the package installation would fail
and I guess this is another reason why binary distributon makes sense.

You may check the naming convention of wheels available on pypi and python docs,
you will understood why these are named that way.

#### Why confluent-kafka-python require source distribution for kerberos?
Now confluent kafka python package already had a binary distribution available
for my machine but it was mentioned that to enable SASL feature, I would need to
install package using below:
```sh
pip install --no-binary confluent_kafka confluent_kafka
```
The reason for doing this was because the package authors decided to disable 
the SASL feature while creating binary distribution. This makes sense if they
would have thought that not everyone will be using kerberos to authenticate
with kafka and they might have thought that generally the older languages like
c/c++, java etc. only are used in that case to connect to kafka cluster and 
not python and also it was required that the `librdkafka` (their c/c++) lib
and its dependencies should be present on the machine to utilise this feature.

Hence the source distribution was necessity so that pip can link the `librdkafka` 
dynamic library on OS while installing the package with SASL feature enabled and
in your code you can easily use the kerberos authentication.

If you want to learn more about how it all works, you may check the 
[confluent-kafka-python](https://github.com/confluentinc/confluent-kafka-python/)
and if you feel overwhelmed by the source code, then you can check [my above 
example's source code](https://github.com/novicedev7291/pywildsort) in which I
created a shared library `libwildsort` and used it to complete the `wildsort_sort` 
implementation in our example above.

### Conclusion
It was exciting for me to touch base around how extension C API works  and doing
something in c/c++ after very long and I learn few things around python and its
ecosystem. Also, I found that the most famouse python libs are using C API and
major chunk of the packages is written in c, c++, rust etc etc.

I think there are some good use cases of doing this i.e. reusing component already
written in other language stack and already famous, performance but it also makes
the ecosystem complex for user who are not much aware of these things and generally
work in python. Sometimes I have seen the error messages emitted by `pip` are
too cryptic to understand what has gone wrong if you don't know all this.

I have mixed feeling about the whole ecosystem as of now and not sure if this is
good thing but I guess this will be a trade off for easy language syntax and ease
of use for scripting....I don't know!

### References
* [Python extension API docs](https://docs.python.org/3/extending/extending.html#)
* [Python extension C API](https://docs.python.org/3/c-api/index.html)
