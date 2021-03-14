---
title: Functional Programming in Java 8, Part 2
date: 2021-03-14
tags: functional,programming,java8
author: Kuldeep Yadav
---

This post is in continuation with my [last post](https://coding-saga.com/2021/functional-programming-java8-examples), where we saw an example of builder pattern using Java 8 functional library, in this post I will share few more examples with you and discuss the pros and cons of functional programming.

### Let's start with an example

Suppose you have a list of persons with their name, age and salary, the person object would be like

```java
@Value(staticConstructor = "of")
public class Person {
    String name;
    int age;
    Double salary;
}
```

> @value(staticConstructor = "of") is the lombok annotation to produce static factory method _of_

Now, you have a use case where you may want to find out all the persons who have either age more than 30 or have salary more than 100K but must not be both, how would you do that?

### Simple traditional approach

Simple solution could be the one which I have been doing since my college days (although I didn't know java then only C ;-) )

```java
// solution list will have our persons with criteria
List<Person> solution = new new ArrayList<Person>();

for(Person person : persons) {
	if(person.getAge() >= 30 && person.getSalary() < 100000) {
		solution.add(person);
	}else if(person.getAge < 30 && person.getSalary() >= 100000) {
		solution.add(person);
	}
}
```

> This approach is also called [imperative approach](https://en.wikipedia.org/wiki/Imperative_programming), where we are specifying _how_ our solution should arrive, you may hear this term a lot when reading about functional programming.

### Functional Programming approach

Using Java 8 _[predicate API](https://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html)_ to filter with given criteria.

As you can see in previous solution we have two `if` condition, which in simple terms means that we have two mutually exclusive (set theory) conditions, hence we need to find `xOr` of two conditions.

**_Predicate API_** does't not provide `xOr` operation, though it has `or` and `and` default implementation. So we will extend the `Predicate` API into our own functional interface `Specification`

```java
@FunctionalInterface
public interface Specification<T> extends java.util.function.Predicate<T> {
    default Specification<T> xOR(Specification<T> other) {
        return t -> test(t) ^ other.test(t);
    }
}
```

> We can have default [function definition](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html) inside interfaces !!!

Now we can easily use this new interface to filter while using `stream` over our persons list.

```java
Specification<Person> ageGreaterThanThirty = person -> person.getAge() >= 30;
Specification<Person> salaryMoreThanHundredThousand = person -> person.getSalary() >= 100000;

Specification<Person> xorAgeAndSalary = ageGreaterThanThirty.xOR(salaryMoreThanHundredThousand);

List<Person> solution = persons.stream()
															 .filter(xorAgeAndSalary)
							                 .collect(toList());
```

Isn't it cleaner and readable than the traditional approach? we have no more those `if` and `for` loop statements and also the criteria is now re-usable, if you need similar thing at some other place.

### "Why" Functional Programming

This question often comes to my mind as well and as with everything in programming, there is no straight forward answer to this and due to our brain being used to of doing imperative programming for so many years, It's very difficult sometimes to see how functional programming helps.

Here, I will share few pros of functional programming with you, which might help you to embrace this style of programming.

### Pros of functional programming

Functional programming revolves around the usage of pure functions and immutable objects, so many benefits of both applies to functional programming as well.

- Pure functions let you write deterministic functions.
- Pure functions are easier to test.
- Debugging is easy.
- Parallel and concurrent programming becomes easier.
- Function signature are meaningful and clear.

### Pure Functions

Pure functions are those functions which takes some input and produces an output on the basis of encapsulated algorithm and input parameters, these do not perform any IO, Database Calls, UI interaction or any other side effects.

Due to this definition of pure functions, they are deterministic in nature, that means if that function is called any number of times with same parameters, it would produce the same output every time.

Let's look at some examples

```java
public List<T> sort(List<T> ele, Comparator<T> cmp) {
	// Some sorting algorithm omitted for brevity
	return sortedList;
}

public List<Person> findAllPersonUsing(List<Person> persons, Specification<Person> specification) {
	return persons.stream()
								.filter(xorAgeAndSalary)
							  .collect(toList());
}
```

Both above functions when passed with same arguments, will produce same output, no matter how many times these are called.

What would be impure functions, then?

```java
// Function does not return anything, considered to have side effects
public void changePersonName(Person person) {
	// doing some thing with person object here
}

// Person output will depend on what personRepository will give back
public Person getPersonWithName(String name) {
	return personRepostitory.findPersonWithName(name);
}

// Function output will depend on the user input
public String readUserInput() {
	Scanner s = new Scanner(System.in);
	return s.nextLine();
}
```

First function is interesting one, it does not return anything. In functional programming, these kind of functions are considered having side effects.

Also as per comment, it is changing the state of person object, although this particular example is harmful in any programming style, one must not change parameter state inside function.

This was little simple example to illustrate the point but when you are working with some entity framework i.e hibernate, you may find yourself doing this for some use case.

### Pure functions as expressions

Pure functions are deterministic in nature, so they can be written as algebraic equation or composed together like an expression, for example

```java
Integer x = f(any) // f is pure function which returns integer
Integer y = g(x) // g is also pure function which returns integer
Integer z = x + y
```

Because, `f(any)` and `g(x)` are deterministic functions, we can write above as

```java
Integer y = g(f(any))
Integer z = f(any) + y

Integer z = f(any) + g(f(any))
```

Also, `z` can be replaced with the expression directly wherever it is used but if `f` and `g` were not deterministic in nature it would not have been possible to replace in this manner.

### Testing is easier

With pure functions and immutable objects, testing is easier, because you don't have side effects, you won't be mocking objects and their behaviour to test your function.

### Debugging is easier

Debugging is easy because you just need to follow the function values in stacktrace, you don't need to worry about other parts of applications.

### Parallel and Concurrent programming

Since parallel and concurrent programming involves lot of threads, which might be executing your same function then if you have functions which are mutating states and you are not using immutable objects, then you would receive a panic call in the mid of your vacation, enjoying your time at beautiful beach, saying that everything is blown in production because of your function.

Functional programming have pure functions and immutable objects, thats why you don't have to worrry about multithreaded environment.

### Function signatures are meaningful and clear

Since, we write pure functions with functional programming, most of the time function signature tells you what that function might be doing or you wouldn't care what would be happening inside that function.

### Cons of Functional Programming

Functional programming is not a new concept though, it's roots are as old as the great depression (1930s), however, programming languages like C++, Java etc promoted OOPs and imperative programming since starting and atleast I leant programming from these 2 languages, I generally found functional programming concepts new and little hard to grasp in the begining.

Following are the cons of functional programming

- It's very hard to reason about initially for people, who have been writing programs using imperative approach for many years and often very intimidating.
- Due to its connotations with mathmatical concepts i.e `monads`, `functor`, `combiner` etc, its very hard to comprehend sometimes.
- Real world software application involves IO, Database, UI, Reading/Writing To Files and since functional programming only uses pure functions, you cannot apply pure functional programming to the whole application, you would need to mix your approach.
- Also, fp uses immutable objects, therefore if written carelessly, it would be bad for performance and may eat up lot of memory.
- With immutable objects, you would need to cover lot of update case, in that case you could use the pattern like "Update your copy" but again it would work for simple objects, with nested objects it becomes little hard to follow. Also, unlike Scala, its difficult to in Java, you would end up with lot of `copy` methods inside your class.

> I think, we can overcome some of these cons upto some extent

### Wrapping impure over pure

We can limit the impact of impure part on pure part by wrapping the pure with a thin layer of wrapper around it to perform i.e IO, DB etc. This looks like we are doing the pure functions only. There are quite a few techiniques i.e `monads` `HOF` to do this in fp world, discussing them will be out of scope of this post.

### Learning curve

How much difficult it was to write in C++ or Java when you started the language and adopted the style, I am sure you must have written lot of programs to be confident about `loops`, `statements` `expressions` etc . I think same applies to functional programming as well, the more you do, more you get comfortable with it.

### Mathmatical Connotations

I am telling you this from my personal experience, initially it intimidated me but as I kept doing it, I found none of those concepts are compulsory to get started with fp, yes it is good to learn those if you can understand but it doesn't mean you can't fp without learning those. (This is true for programming as general as well).

### Memory and Performance issues

These issues are always debatable and I think these are mostly due to programmers' mistake not due to some programming style, unless you are processing a very huge number of data and you find that the immutable objects are problem, luckily I haven't encountered such case till now and I will appreciate, if someone can share their experiences about it.

### Function programming decouple state and behaviours

Functional programming prefers you decouple your data and behaviour that means you must have immutable classes with their behvaiours(pure functions) in separate files or modules but this is not mandatory you can have it in same file as well but immutable classes/objects is important point.

This is opposite to what OOPs suggest and might resembles [anemic model](https://www.martinfowler.com/bliki/AnemicDomainModel.html) but it is not.

## Conclusion

Functional programming let you write pure functions which will operate on immutable objects, which are easier to test, debug and maintain and are free from side effects. But you cannot write whole real world application which involves lot of moving part just using functional programming.

It has some learning curve but helps to write clean APIs, I prefer to use it whenever I find the use case for it and mix with imperative style of programming to use best of both versions.

So that's it, you can find the [source code](https://github.com/novicedev7291/fp-patterns) used in both post on my github account.

## References

- [Functional programming simplified, Scala Edition by Alvin Alaxender](https://www.amazon.in/Functional-Programming-Simplified-Alvin-Alexander/dp/1979788782)
- [From object oriented to functional domain modeling by Mario Fusco](https://www.youtube.com/watch?v=K6BmGBzIqW0)
- [Anemic model By Martin Fowler](https://www.martinfowler.com/bliki/AnemicDomainModel.html)
- [Wikipedia](https://en.wikipedia.org)
- [Oracle Docs](https://docs.oracle.com/javase/8/docs)
