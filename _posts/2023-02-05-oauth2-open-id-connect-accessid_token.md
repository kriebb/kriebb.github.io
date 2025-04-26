---
date: 2023-02-05
title: "OAuth2 / Open Id Connect / (access|id)_token"
datePublished: Sun Feb 05 2023 10:26:59 GMT+0000 (Coordinated Universal Time)
cuid: cldr8pa53000009mq2e6zdqxn
slug: oauth2-open-id-connect-accessidtoken
cover: /assets/images/blog/oauth2-open-id-connect-accessid_token/2023-02-05-oauth2-open-id-connect-accessid_token.cover.jpeg
tags: security, dotnet, oauth2, openid-connect, access-token

---

# Previously On…

In my previous post, I zoomed in on my assignment. The development is about the creation of a registration of a user, using Auth0 authentication flows, actions,... . My responsibility is the creation of a BFF for the front end using Asp.net 6. I mentioned in that post the usage of id tokens and access tokens.

# Context

Due to the nature of my assignment, it is necessary to understand the Oauth2 authentication flows. I will not create another post about these flows. I used the following materials to understand it:

* [Asp.net 6 Securing Oauth2 and OpenId Connect](https://app.pluralsight.com/library/courses/asp-dot-net-core-6-securing-oauth-2-openid-connect/table-of-contents)
    
* [An Illustrated Guide to OAuth and OpenID Connect](https://www.youtube.com/watch?v=t18YB3xDfXI)
    
* [Understanding identity tokens (](https://www.scottbrady91.com/openid-connect/identity-tokens)[scottbrady91.com](http://scottbrady91.com)[)](https://www.scottbrady91.com/openid-connect/identity-tokens)
    

# Guidelines

[Wesley Cabus](https://wesleycabus.be/) has shared his wisdom with me regarding those guidelines. I want to spread the word about what I learned.

### Tokens should be kept as small as possible

The [OAuth2.0 specification](https://www.ietf.org/rfc/rfc6749.txt) does not define anything on this topic.

However, I want to explain why this is important:

* There are several authentication flows defined in the specification. One of them is regarded as a very insecure one: [Implicit Grantflow](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-implicit-grant-flow). In that flow is the access token part of the URL. An URL in a browser has a limited size. Not due to the [HTTP specification](https://www.ietf.org/rfc/rfc2616.txt), but due to [browsers implementing that specification.](https://www.ietf.org/rfc/rfc2616.txt)
    
* When storing or using the access token with cookies, know that a [cookie is limited in size](https://stackoverflow.com/questions/640938/what-is-the-maximum-size-of-a-web-browsers-cookies-key).
    
* From a security standpoint, know that an access token can be decoded using [jwt.io](http://jwt.io). [Not all access token follow that JWT protocol, but can be opaque as well.](https://medium.com/@piyumimdasanayaka/json-web-token-jwt-vs-opaque-token-984791a3e715) When you add sensitive information in a token (e.g. email), that information can be used in spoofing [attacks](https://www.rapid7.com/fundamentals/spoofing-attacks/). [This technique is used a lot to get access to a victim's computer.](https://www.ncsc.gov.uk/information/how-cyber-attacks-work#:~:text=Un%2Dtargeted%20cyber%20attacks&text=phishing%20%2D%20sending%20emails%20to%20large,order%20to%20exploit%20visiting%20users)
    

Instead of adding data in a token, call the user [info endpoint](https://learn.microsoft.com/en-us/azure/active-directory/develop/userinfo) using the access token to gain personal information.

### Business information should be put in the HTTP request Body

Do not use the access token to transport information. An access token is used to see if the consumer gets access to the API, not for transporting data.

When you work with sensitive data, still use the HTTP Request body.

* To protect yourself from man-in-the-middle attacks: make the body tamperproof. Encode the body using e.g. [JOSE protocol](https://jose.readthedocs.io/en/latest/). Using the JOSE protocol, you can validate the information with the signature provided. E.g. An identity provider that uses this technique is [ItsMe](https://belgianmobileid.github.io/doc/JOSE/).
    
* You can also encrypt the body, so only the receiver can read it. [Read here for more detail](https://karatejb.blogspot.com/2020/02/aspnet-core-encrypt-and-decrypt-request.html).
    

### An id token is a proof that the user is authenticated

When receiving an access token, it means that the consumers have access to an API. This does not mean that the caller is authenticated. That is not part of the OAuth2 protocol. For that, we have OpenID Connect. Receiving an id token is proof that the user says who he is.

* An id token should not have much information. Use the user info endpoint to request the data.
    
* When you supply an id token, you need to supply the challenge or ‘nonce’. Using that, [the API can verify that the id token is not tampered with.](https://curity.io/resources/learn/validating-an-id-token/)
    

### An access token should not be used as an id token

According to the Oauth2 specification, an access token should be handled as just some random characters. Use the endpoints defined in the Oauth2 specification to verify the access token. To work with user information, request it from the user info endpoint or if you have to, use the id token.

In an access token, access only [claims](https://auth0.com/docs/get-started/apis/scopes/openid-connect-scopes#:~:text=OpenID%20Connect%20(OIDC)%20scopes%20are,user%20attributes%20the%20application%20needs.) that the API uses to check if the caller is authorized for accessing the requesting endpoint. E.g. the email claim: only persons from some [domain](http://axa.be) can use this api and/or operation.

### Be aware of what information lives where

What I mean with this title, is that is important to intercept and inspect your network traffic. E.g. HTTP requests that are created in the MVC application's code-behind cannot be intercepted from the browser. HTTP requests that happen in javascript however can be intercepted. Every piece of information that leaks to the browser in a token, body, or cookie can be used for an attack.

# Outro

It is hard to guard these guidelines. I have to be mindful of them. I must not let my guard down. I do see it as a positive note that I challenge my colleagues on this subject. I can only hope that other people will see this also as positive. Security is becoming more important. [Databreaches.net](https://www.databreaches.net/) gives an overview of breaches that have happened.

Do you like the guidelines above? Do you put these in a place where you work? Why or why not? I am curious. You can find me on Twitter and LinkedIn.


