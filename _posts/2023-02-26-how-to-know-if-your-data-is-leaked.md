---
date: 2023-02-26
title: "How to know if your data is leaked?"
datePublished: Sun Feb 26 2023 08:40:49 GMT+0000 (Coordinated Universal Time)
cuid: clel55n0o000509mf2q7x87o1
slug: how-to-know-if-your-data-is-leaked
canonical: https://dotnet.kriebbels.me/when-two-factor-authentication-is-useless
cover: /assets/images/blog/2023-02-26-how-to-know-if-your-data-is-leaked/2023-02-26-how-to-know-if-your-data-is-leaked.cover.jpeg
tags: security, privacy, scam, openid-connect, databreach

---

# Previously on...

I am working with the authentication and authorization protocols OpenIDConnect and OAuth2. The identity providers that my customer uses are Auth0 and ItsMe. Safe to say, the nature of my [assignment](https://dotnet.kriebbels.me/lets-zoom-in-on-my-first-assignment) consists of [private and security-sensitive subjects](https://dotnet.kriebbels.me/oauth2-open-id-connect-accessidtoken).

At the [Tweakers.net Dev Conference 2022](https://tweakers.net/partners/devsummit2022/), I followed some sessions [on how the dutch police gain access to your system](https://tweakers.net/partners/devsummit2022/1730/marjaharm/). [There was also a great session on how a hacker uses social connections](https://tweakers.net/partners/devsummit2022/1686/christiaannieuwlaat/).

At [CloudBrew](https://www.cloudbrew.be/) 2022, [I have seen a technical session on how a hacker will gain access and uses vulnerabilities.](https://www.cloudbrew.be/2022/#session-offensive-azure-security)

# Context

It is important to know if your data has been leaked. The leaked data can and will be misused to gain your trust. [Look at this site, to get a visual overview of leaked data breaches.](https://www.informationisbeautiful.net/visualizations/worlds-biggest-data-breaches-hacks/) Do you rather just like a list? [Check this website then.](https://tech.co/news/data-breaches-updated-list)

* If your personal information is compromised in a data breach, criminals may use that information to [commit identity theft](https://www.vrt.be/vrtnws/nl/2022/11/16/identiteitsfraude-najaar-energie/). This can include opening new credit accounts, making fraudulent purchases, or even applying for a loan or a job in your name.
    
* If your credit card or [bank account information is compromised](https://datanews.knack.be/ict/nieuws/opnieuw-data-en-rekeningnummers-van-belgen-aangeboden-op-hackersforum/article-news-1927711.html?cookie_check=1677400142), criminals may use that information to make unauthorized purchases or withdrawals. This can result in financial losses.
    
* Even if the stolen data doesn't directly lead to identity theft or financial fraud, it can still be used for other nefarious purposes. [For example, criminals may sell your personal information on the dark web or use it for targeted phishing attacks.](https://itdaily.be/nieuws/security/veertig-procent-belgen-slachtoffer-van-phishing/)
    

I will start a new series about scamming and how to protect your data. This will include the following topics:

* Password managers.
    
* Email aliases.
    
* The importance of your fake data.
    
* The importance of Two Factor Authentication.
    
* An OpenIDConnect Provider should use secure storage.
    
* Use an alias phone number.
    
* IoT devices and how to handle them in the network.
    
* A real electronic identity card. What are the benefits?
    

### How to know if your data is leaked?

To know if your data has been leaked, some websites will help you with that.

1. [Have I Been Pwned:](https://haveibeenpwned.com/) This website is a popular option for checking if your email address or other personal data has been involved in a data breach.
    
2. [Firefox Monitor:](https://monitor.firefox.com/) This is a service provided by Mozilla Firefox that allows you to check if your email address has been involved in a data breach.
    
3. [Google Password Checkup](https://passwords.google.com/checkup/): If you use Google Chrome, you can use the Password Checkup feature to check if any of your saved passwords have been compromised in a data breach. The tool will alert you if it detects any compromised passwords.
    
4. [DeHashed](https://dehashed.com/): This website allows you to search a database of leaked passwords to see if your password has been exposed. You can also search for your email address or username to see if they have been involved in a data breach.
    

## Scamming: A never-ending story.

### In this galaxy, but a long ... long time ago...

There was scamming as well. I will list them, give some explanation and link it to the Wikipedia pages if you want to know more.

1. [Snake Oil Salesmen](https://en.wikipedia.org/wiki/Snake_oil):
    
    In the late 19th and early 20th centuries, it was common for travelling salesmen to peddle various "cure-all" tonics and elixirs, often claiming they had medicinal properties that could cure any ailment. Many of these tonics were made from snake oil, which was believed to have anti-inflammatory properties, but most of them were ineffective or even harmful.
    
2. [Pyramid Schemes:](https://en.wikipedia.org/wiki/Pyramid_scheme) While the term "pyramid scheme" is relatively recent, the concept has been around for centuries. The goal is to move up the ranks of the group and earn a share of the money from recruits. However, only a small number of people could ever earn any money, while the rest would lose their investments.
    
3. [Counterfeit Goods](https://en.wikipedia.org/wiki/Counterfeit): The production and sale of counterfeit goods is an ancient practice that dates back to at least the Roman Empire. Merchants would create fake coins or replicate popular goods, passing them off as the real thing to make a profit.
    
4. [The Spanish Prisoner](https://en.wikipedia.org/wiki/Spanish_Prisoner): This scam dates back to the 16th century and involved a letter sent to someone claiming to be a wealthy person held prisoner in Spain. The prisoner promises a large reward to anyone who can help them escape but requires some money upfront to pay bribes or other expenses. Once the victim pays the initial fee, they never hear from the prisoner again.
    

### In the more recent past.

Before the digital age that we know today, we may have forgotten the following scams as well: [Card skimming](https://en.wikipedia.org/wiki/Card_skimming) and [Invoice fraud](https://en.wikipedia.org/wiki/Invoice_fraud).

However, with the widespread adoption of chip-enabled cards and contactless payment methods, card skimming has become less common. Chip cards are more secure than traditional magnetic stripe cards. Contactless payment methods, such as Apple Pay or Google Wallet, also use encryption and tokenization to protect payment data. Many banks and retailers have implemented additional security measures to prevent card skimming, such as adding tamper-evident stickers to card readers or regularly inspecting machines for signs of tampering.

Similarly, many businesses have implemented procedures to verify any changes to payment details before making a payment, to prevent invoice fraud.

# Outro

I am still discovering and trying this out myself. This blog post series will help me to investigate this topic further. I will share my experiences as well while I take action.

I see more traction in the media around this topic. There are still a lot of people in denial. I can not blame them. It is just recently that I am fed up with all those scam emails and sms. It is time that I started to do something about it.

But as I mentioned before, it is a never-ending story... It is a cat-and-mouse game: I am curious about what the next popular way of scamming will be.


