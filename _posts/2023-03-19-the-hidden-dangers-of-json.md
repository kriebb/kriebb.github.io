---
date: 2023-03-19
title: "The Hidden Dangers of JSON"
datePublished: Sun Mar 19 2023 11:17:36 GMT+0000 (Coordinated Universal Time)
cuid: clffb05o2000b09meebgabb7c
slug: the-hidden-dangers-of-json
cover: /assets/images/blog/the-hidden-dangers-of-json/2023-03-19-the-hidden-dangers-of-json.cover.jpeg
tags: owasp, json, security, hacker, dotnet

---

# Previously on...

I will take a brief pause from my series on securing and reclaiming control of personal data. To give a little spoiler, it is about using the tool [SimpleLogin | Open source anonymous email service](https://simplelogin.io/).

In previous posts, I mentioned that a white-hat hacker demonstrated their methods of gaining unauthorized access. This was on Azure Cloudbrew. That person states that hackers behave much like little bunnies, hopping between computers and servers while accumulating tiny bits of crucial information. They discreetly gather details such as client IDs, technologies in use (e.g., JSON, [ASP.NET](http://ASP.NET) Core), and the versions of installed DLLs. Those hackers gradually acquire a better understanding of what they can accomplish. Once armed with enough knowledge, they can orchestrate a full-scale attack.

Let us zoom in on what a hacker can do with a JSON deserialization attack.

# Context

I recently helped a colleague tackle a problem where input validation was missing. There was no distinct separation between layers when processing an HTTP request and initiating a follow-up request.

After reviewing the initial security report and researching the vulnerability online, we have taken the follow actions:

* implemented layer separation,
    
* updated Swagger's JSON serializer to have no type handling,
    
* and added some validation checks.
    

I thought we were making progress, but due to ambiguous requirements, only a "string.IsNullOrEmpty" check was conducted.

The second security report still indicated that the property was transferred from input to output without any validation checks. I did not understand the problem. I researched the vulnerabilities but did not came across this problem. The security team firmly declared that such code would not be permitted in production.

When I sought more information about the security scan and its purpose, the team responded vaguely, saying it was simple and referring to a particular line in the report. However, when I requested specific guidance on addressing the issue and pinpointing the vulnerabilities detected by the tool, the conversation became tense and defensive. I had to remind people that I also find security important. I do not want to discuss if the report is wrong or not. I admitted I didn't fully understand the attack mentioned concerning possible JSON in a string property. This has nothing to do with the importance of validation of the input.

Ultimately, the developers in that meeting determined that using RegEx validation on the properties of the Models that [ASP.NET](http://ASP.NET) Core processes and deserializes was the way to go. At least, we will discover that after the security scan runs again. That will take two days before we know if that will fix the result.

After that meeting, I talked with another coworker. We agreed that simulating the attack was the optimal strategy for better understanding the issue.

# The journey starts

After googling a bit a round, I came to a very intresting magazine called [Pentestmag](https://pentestmag.com/magazines/).

There I have a step-by-step example of how I can recreate the problem. However, they make use of tools that I am not familiar with yet. Let us take a step back. First I need to know what the vulnerability is all about. OWASP seems a good source for that. The vulnerability is listed here: [OWASP Top Ten 2017 | A8:2017-Insecure Deserialization | OWASP Foundation](https://owasp.org/www-project-top-ten/2017/A8_2017-Insecure_Deserialization) to stress the problem, I make a copy from that website for your easy reading:

`The impact of deserialization flaws cannot be overstated. These flaws can lead to remote code execution attacks, one of the most serious attacks possible. The business impact depends on the protection needs of the application and data.`

## OWASP

OWASP have a sheet cheat for all kind of technologies and vulnerabilities. You can find that on this location: [Deserialization - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html).

After reading the sheet cheat, I can not help but figure out that I should just not use JSON at all. The plot thickens when they link to YsoSerial.net. YsoSerial.Net is a tool designed to generate and analyze payloads for .NET applications that are vulnerable to deserialization attacks.

## YsoSerial.Net

For the reader, I will make copy and paste the introduction on what YsoSerial.Net is:

[`ysoserial.net`](http://ysoserial.net) `is a collection of utilities and property-oriented programming "gadget chains" discovered in common .NET libraries that can, under the right conditions, exploit .NET applications performing unsafe deserialization of objects. The main driver program takes a user-specified command and wraps it in the user-specified gadget chain, then serializes these objects to stdout. When an application with the required gadgets on the classpath unsafely deserializes this data, the chain will automatically be invoked and cause the command to be executed on the application host.`

For a person that is just trying to create a sample project about deserialisation hacks, I need to understand first what the text above really means. They talk about gadgets. What have small physical devices have to do with JSON?

### What are the gadgets they talk about?

The term "gadget" is confusing for someone like me. I am not familiar with computer security on that level yet. The word "gadget" is often used to describe small, innovative devices or tools in everyday life. However, the underlying concept of a "gadget" is a versatile, reusable, and adaptable component without injecting any code into memory. A gadget is a small piece of reusable code that can be leveraged to create an exploit. Gadget chaining is then reusing a lot of small pieces, executing after each other. That is used in ROP (Return-Oriented Programming)

### Down the rabbit hole, we go... What is ROP now?

Return-Oriented Programming (ROP) is an advanced exploitation technique used by attackers to bypass security mechanisms, such as non-executable memory protections (e.g., DEP or Data Execution Prevention). ROP allows an attacker to execute arbitrary code without injecting any new code into the target process or system. Instead, ROP relies on reusing existing code sequences, called "gadgets," that are already present in the memory of the target program or system libraries. Hence the word "gadget chaining".

## Getting out of the rabbit hole and into the next.

Let us go back to the magazine and after some good keyword searching using Google, I came to a [blogpost](https://pentestmag.com/insecure-deserialization-with-json-net/) that gives us a beautiful showcase of how dangerous JSON can be. Let me give you a summary before you hop over to see what is happening.

First of all, the author describes insecure deserialization as a critical vulnerability in the OWASP Top 10 list, which can lead to issues like denial-of-service attacks, authentication bypasses, and arbitrary code execution.

In the blog post by Nairuz Abulhul, Nairuz demonstrates exploiting insecure deserialization in a .NET application using JSON. Nairuz uses [Burp Suite](https://portswigger.net/burp). That can be used for manual [fuzzing](https://en.wikipedia.org/wiki/Fuzzing). This means generating error messages to see how the application will react. [I learned about Fuzzing on an innovation day at Xebia | Xpirit](https://www.linkedin.com/posts/michaelcontento_mutation-testing-und-fuzzing-in-c-basta-activity-7025826515657334784-P3Ob?utm_source=share&utm_medium=member_desktop). Big shout out to [(6) Michael Contento | LinkedIn](https://www.linkedin.com/in/michaelcontento/) who introduced me to this topic.

Through testing, Nairuzidentifies that the Bearer token, which is part of the OAuth 2.0 authorization framework, is the vulnerable parameter. To exploit this vulnerability, [ysoserial.net](http://ysoserial.net) is used. As a result, she can do a remote code execution attack, compromising the target machine. To prevent such attacks, the author recommends avoiding serialization if possible, using digital signatures like HMAC to ensure data integrity, and always validating and sanitizing user input before serialization.

### But my code runs in Azure...

One of my thoughts was that Azure is secured in a manner, [that Fort Knox would be jealous](https://www.onmsft.com/news/microsoft-announces-new-azure-security-lab-challenges-researchers-to-hack-azure/) of... After a little bit of searching, I came across a site called [https://cloud.hacktricks.xyz/](https://cloud.hacktricks.xyz/). Once your browse a bit through the site, you notice a section dedicated to [Azure](https://cloud.hacktricks.xyz/pentesting-cloud/azure-pentesting).

Searching for a bit more on this topic, [you find a blog post that explains how to create a file on the Azure WebApp](https://www.alphabot.com/security/blog/2017/net/How-to-configure-Json.NET-to-create-a-vulnerable-web-API.html) by having code executed by the JsonDeserialiser.

# Easy fix?

1. Choose libraries that have built-in security mechanisms to prevent deserialization attacks. [For example, the `System.Text.Json` library in .NET Core is considered safer than `Newtonsoft.Json`](https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/overview), as it doesn't support vulnerable deserialization features by default.
    
2. Binary formatters, like `BinaryFormatter` and `NetDataContractSerializer`, can introduce security risks. Instead, use safer alternatives such as `DataContractJsonSerializer`, `XmlSerializer`, or `System.Text.Json`.
    
3. Restrict deserialization to specific types: If you have to use a library that supports type information during deserialization, restrict the deserialization process to a predefined set of known and safe types. For example, in `Newtonsoft.Json`, you can use the `TypeNameHandling` and `SerializationBinder` settings to control the deserialization process.
    

## Show me code

I deleted the code that was in here. There is a better solution. I mentioned it on the follow up [blogpost](https://dotnet.kriebbels.me/the-hidden-dangers-of-jsons-hunger-silenced).

## Hunger

I am still not satisfied with my search for this vulnerability. It was stated by the security team that it is very important to validate your properties as well. I am not discussing that. But I want to understand what mechanisms are in play to abuse that. One thing that comes to mind is using `JsonConvert.DeserializeObject` method on a string property of the input object.

I am also not convinced yet, that adding validation on your properties using attributes will mitigate the problem. A good read for this would be the following article by Microsoft: [runtime/ThreatModel.md at main · dotnet/runtime · GitHub](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Text.Json/docs/ThreatModel.md)

## Outro

I still need to search for time to play with this. I did not end up playing with creating the source code myself. However, I gained insight into how hackers can misuse JSON and even a security framework like OAuth2 to execute remote code. I have found some examples and sources that are clear enough to set my next baby steps.


