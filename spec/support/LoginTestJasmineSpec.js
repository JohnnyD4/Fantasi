"use strict";

var Nightmare = require("nightmare");
var nightmare = Nightmare({ show: true });

// describes our function
describe("Fantasi", function() {
// holds our ids in variables
// Initial test using Jasmine
  it("should log you in", function(done) {
    // ID for the login button.
  // var login = "#login";
  // var email = "#exampleInputEmail1";
  // var password = "#exampleInputPassword1";

  nightmare
      .goto("http://localhost:3000/")
      // Click the login button
      .wait(4000)
      // .click('#login')
      // .wait('#exampleInputEmail1')
      // .wait(1000) // wait for the animation
      // .type('#exampleInputEmail1', 'test@aol.com')
      // .wait('#exampleInputPassword1')
      // .type('#exampleInputPassword1', 'test')
      // .wait('button')
      // .click('.btn')
      // .wait('#custom-nav .c-info__title a')
      // // Evaluate the title
      // .evaluate(function () {
      //   return document.querySelector("#zero_click_wrapper .c-info__title a").href;
      // })
      // .end()
      // // Asset the title is as expected
      // .then(function (result) {
      //   console.log(result)
      // })
      // .catch(function(error) {
      //   console.error('Search failed:', error);
      // });
    });
});







      /*, function error(err) {
        throw err;
      });
  }, 30000);*/
  
/*  var login = "#header__sign-in";
  it("should present a link to course catalog after login", function(done) {
    Nightmare({ show: true })
      .goto("https://codecademy.com")
      // Just to be safe.
      .wait(login)
      // Click the login button.
      .click(login)
      // Wait for the login input
      .wait("#user_login")
      // Actually log in
      .type("#user_login", "ResilD")
      .type("#user_password", "dummy*password")
      .click("#user_submit")
      // Evaluate the following selector
      .evaluate(function() {
        return document.querySelector("a[href='/learn/all']");
      })
      // Assert the catalog exists
      .then(function(catalog) {
        expect(catalog).not.toBe(undefined);
        done();
      });
  }, 30000);

  it("should ", function() {
    throw new Error(
      "Failed on purpose, just to make the Mocha output more interesting."
    );
  });*/