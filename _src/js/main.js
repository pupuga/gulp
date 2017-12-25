require('test');
alert ('main-1');
alert ('main-2');
alert ('main-3');
alert ('main-4');
alert ('main-5');
function f() {
  {
    let x;
    {
      // this is ok since it's a block scoped name
      const x = "sneaky";
      // error, was just defined with `const` above
      x = "foo";
    }
    // this is ok since it was declared with `let`
    x = "bar";

  }
} 