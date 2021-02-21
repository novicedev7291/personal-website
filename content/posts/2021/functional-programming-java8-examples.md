---
title: Functional Programming in Java 8, with Example(s)
date: 2021-02-15
tags: functional,programming,java8
author: Kuldeep Yadav
---

It has been almost 7 years since Oracle released Java 8, with it, they also released lambda expressions and Functional interfaces, which lets you do functional programming in Java, but it's not very intuitive when compared to languages i.e javascript (functions are not first class citizen in java)

In this post, I will give brief introduction of functional interfaces and lambda expression in Java and try to explain the little strange syntax with one important example.

### Functional Interfaces

Some of the important functional interfaces Java 8 has to offer, which we will discuss in a while.

- `Function<T, R>`
- `Consumer<T>`
- `Supplier<T>`
- `BiFunction<T, U, R>`
- `Predicate<T>`

### Function<T,R>

> Represents a function which accepts one argument and produces a result.

It is very simple and understandable definition, right? But when you go and try to use it you would get confused at first, because as per definition, this represent something like

```java
R someFunction(T param) {
	return r;
}

// Using it would be
R r = someFunction(t);
```

But in your code you would write

```java
Function<Integer> convertIntToStr = t -> "Some String from " + t;

String str = convertIntToStr.apply(1);
```

Got confused, right?

This is because, interfaces and classes are first class citizen in Java, that's why they have provided these **_Functional Interfaces_** and their usage is similar to creating an object and calling functions on that object.

So, what are functional interfaces?

> Functional interface is the interface in Java 8 which has only one abstract method, any interface which qualifies this condition is a functional interface and you can also denote it with `@FunctionalInterface` annotation to explicitly state that, so that compiler can generates error if some try to add another abstract method to it.

If you checkout the implementation of **Function<T,R>,** you would see something like this

```java
@FunctionalInterface
interface Function<T,R> {
	R apply(T t); //only abstract method
	// default method omitted for brevity
}
```

So, our code example above, initialises the object of this interface with _lambda expression which is in this case just a function_

```java
Function<Integer, String> convertIntToStr = t -> "Some String from " + t;

t -> "Some String from " + t

       equivalent to

String someFunction(Integer value) {
			return t -> "Some String from " + t;
}
```

And since `convertIntToStr` is an object of type Function<Integer, String>, we call the apply method on this object to execute our `lambda expression` or `someFunction` and you must have got an idea by now that you provided the implementation for `apply` function using lambda expression, because same statement can be written as **anonymous object declaration**

```java
Function<Integer, String> convertIntToStr = new Function<Integer, String>() {
		@Override
		String apply(Integer t) {
				return "Some String from " + t;
		}
}
```

So, next time think the statement on left to be equivalent to the right

```java
R someFunction(T param) {
	return r;
}
R r = someFunction(t);
```

```java
Function<T, R> someFunction = t -> r;
someFunction.apply(t);
```

All other, interfaces works in similar manner, those represent some other useful functions , Lets see what they have to offer.

### Consumer<T>

> Represents an operation that accepts a single input argument and returns no result.

You can think of _Consumer_ as void function, which takes a parameter and it has an abstract method `void accept(T t)`

### Supplier<T>

> Represent a supplier of results.

You can think of _Supplier_ as a function which doesn't take any argument and return a value and it has an abstract method `T get()`

### BiFunction<T,U,R>

> Represents a function that accepts two arguments and produces a result.

You can think of _BiFunction_ as a function which takes two arguments and return a value and has an abstract method `R apply(T t, U u)`

### Predicate<T>

> Represents a predicate (boolean-valued function) of one argument.

You can think of _Predicate_ as a function which takes an argument and returns a boolean value, it has an abstract method `boolean test(T t)`

> There are more interfaces than mentioned, you can check [docs](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html)

### Why Functional Programming?

Functional programming lets you compose your logic through pure functions in declarative manner avoiding shared state, mutable data and side effects. Let's see this with very simple example.

Suppose we have an item and we need to calculate different taxes on the item's base price, we would write something like this

> I would be using lombok project to generate some boilerplate code in my examples, so please check its documentation for more info.

```java
@Value
class Item {
    String name;
    Double price;
}

class TaxCalculator {
		// I have passed the boolean flags for the taxes needs to be calculated
    public Double calculateTaxablePrice(Item item, boolean excise, boolean vat, boolean cess, boolean gst) {
        Double basePrice = item.getPrice();
        if(excise) basePrice += basePrice * 0.02;
        if(vat) basePrice += basePrice * 0.04;
        if(cess) basePrice += basePrice * 0.01;
        if(gst) basePrice += basePrice * 0.1;
        return basePrice;
    }
}

// And we would call like this
Double newPrice = calculator.calculateTaxablePrice(item, true, false, true, true);
```

You might have spotted the problems in above code, let me point out a few below

- If we need to add another tax tomorrow, we would change this method and so have to be the every calling method in client code.
- Client will have to dig into the implementation of function to know, which flag is for which tax, so client can make a mistake and this may not be captured by the unit test also.

So, what can we do? An alternative approach can be to create a `TaxCalculatorBuilder` which will create the `TaxCalculator` object for us, which will have all the flags as state variables and `calculate` function will take only `price`, providing fluent api to the client

```java
TaxCalculator calculator = new TaxCalculatorBuilder()
																.withExcise()
																.withVat()
																.withCess()
																.withGst()
																.build();
// And we would call like this, here calculator object knows which tax to be applied
Double newPrice = calculator.calculateTaxablePrice(item);
```

But, there is an issue with builder as well, you would have to change the builder class everytime a new tax is added. So, how can we solve this problem ?

We can solve this issue using functional interface `Function<T, R>` and we will see in a moment how, but before that let's define each tax as a function which would take one argument and give back result, in new class `TaxRules`

```java
@NoArgsConstructor(access = AccessLevel.PRIVATE)
class TaxRules {
    public static Double excise(Double price) {
        return price + price * 0.02;
    }

    public static Double vat(Double price) {
        return price + price * 0.04;
    }

    public static Double cess(Double price) {
        return price + price * 0.01;
    }

    public static Double gst(Double price) {
        return price + price * 0.1;
    }
}
```

Now, we would write our improved tax calculator as following

```java
class ImprovedTaxCalculator {
    private final List<Function<Double, Double>> taxRules = new ArrayList<>();

    public ImprovedTaxCalculator with(Function<Double, Double> fn) {
        taxRules.add(fn);
        return this;
    }

    public Double calculateTaxablePrice(Double price) {
        Function<Double> fn = taxRules.stream()
                                      .reduce(f -> f, (firstFn, secondFn) -> firstFn.andThen(secondFn))
        return fn.apply(price);

    }
}
```

The **_calculate_** function here is little difficult to understand so let's apply divide and conquer to understand it

- `taxRules` is a list, `.stream()` method call gives us a stream of object in list.
- `reduce()` method takes stream of elements and produce single result.

Let's take an example to understand it

```java
List<Integer> numbers = Arrays.asList(1,2,3,4,5);

Integer sum = numbers.stream()
											.reduce(0, (sum, number) -> sum + number);
```

The **_Integer value 0 is the identity value,_** Its the initial value provided to reduction process and if the value of list is empty then it will be the default value which will be returned.

Second argument is the **_accumulator_** which will add the previous sum to next number from the stream, initially **_sum_** would be 0 here

```jsx
(sum, number) -> sum + number // Lambda expression
```

Lambda expression can also be written as method reference

```jsx
Integer sum = numbers.stream()
											.reduce(0, Integer::sum);
```

Now let's get back to our original example now

```jsx
Function<Double> compositeFn = taxRules.stream()
    .reduce(f -> f, (firstFn, secondFn) -> firstFn.andThen(secondFn));
```

Here, **_first function in taxRules would be our identity_** and **_accumulator_** is a lambda expression returning a new composed **_Function<Double>,_** that first applies its input to **_firstFn_** and then applies the result to **_secondFn_**.

Now, Let's see how client would calculate tax using our improved calculator

```jsx
ImprovedTaxCalculator calculator = new ImprovedTaxCalculator()
                                         .with(price -> TaxRules.excise(price))
                                         .with(price -> TaxRules.cess(price))
                                         .with(price -> TaxRules.gst(price));

Double newPrice = calculator.calculateTaxablePrice(item);
```

If tomorrow, we got a new tax, then we just have to add the new function into `TaxRules` class and client can use it, we don't have to change our calculator.

Also, if you have a case where only one client has to apply some extra tax which doesn't have to be defined in `TaxRules`, then client can very easily do that

```jsx
ImprovedTaxCalculator calculator = new ImprovedTaxCalculator()
                                         .with(price -> TaxRules.excise(price))
                                         .with(price -> TaxRules.cess(price))
                                         .with(price -> TaxRules.gst(price))
																				 .with(price -> price + price * 0.03); //Extra tax

Double newPrice = calculator.calculateTaxablePrice(item);
```

You can see that how functional interface `Function<T,R>` can help us write better reusable code with clean fluent API, which is much better than the builder, we wrote earlier.

For now, I will leave you all with this example, we will see some more examples and functional programming pros and cons in coming posts. So till then **_enjoy....._**
