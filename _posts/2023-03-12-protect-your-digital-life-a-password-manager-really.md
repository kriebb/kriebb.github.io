---
date: 2023-03-12
title: "Protect Your Digital Life: A Password Manager? Really?"
datePublished: Sun Mar 12 2023 08:05:52 GMT+0000 (Coordinated Universal Time)
cuid: clf542m4j000108jxbrk1g7dw
slug: protect-your-digital-life-a-password-manager-really
canonical: https://dotnet.kriebbels.me/protect-your-digital-life-a-password-manager-really
cover: /assets/images/blog/2023-03-12-protect-your-digital-life-a-password-manager-really/2023-03-12-protect-your-digital-life-a-password-manager-really.cover.jpeg
tags: security, privacy, password-manager, keepass, bitwarden

---

# Previously on...

I started this series [when I got fed up with all those scam emails and sms](https://dotnet.kriebbels.me/how-to-know-if-your-data-is-leaked). It is time to retake my digital data. In my [previous post](https://dotnet.kriebbels.me/when-two-factor-authentication-is-useless), I talked about 2FA and the weak link named "the user".

# Context

Many websites require us to create a login that includes various personal information such as a username, email, phone number, and sometimes even a [national registry number](https://authenticate.lnz.be/FederationSTS/Default.aspx?wa=wsignin1.0&wtrealm=urn%3Asharepoint%3Anzvl.lnz.be&wctx=https%3A//nzvl.lnz.be/_layouts/15/Authenticate.aspx%3FSource%3D%252F&wreply=https%3A//nzvl.lnz.be/_trust/default.aspx). Initially, a lot of people used the same login credentials for multiple websites. As a result, the next step in the evolution of online security was to require passwords with more characters, making it more difficult for hackers to guess them through brute force methods. However, this was not enough, as many websites did not store passwords securely, resulting in data breaches where login credentials were exposed. Criminals could then use these compromised credentials on other websites until they gained access. Therefore, it has become increasingly important to use unique passwords for each website where you have an account. Password managers are software that helps to achieve this.

[I suggest watching Michael McIntyre's humorous video on passwords.](https://www.youtube.com/watch?v=aHaBH4LqGsI)

# Hackers were interested only in our credentials?

Before personal information became a valuable commodity, gaining access to email accounts, online banking systems, and other platforms through stolen login credentials was a valuable goal for hackers.

By obtaining login credentials, hackers can access sensitive information such as financial data, personal communications, and confidential business information. In addition, login credentials can be used to carry out fraudulent activities such as identity theft, bank fraud, and phishing scams.

Moreover, with the rise of e-commerce and other online transactions, the value of personal information has also increased over time. Login credentials, combined with personal information like names, addresses, and social security numbers can be used for more advanced and sophisticated cyber attacks like spear phishing, social engineering attacks, and more.

# Password managers

A password manager is a software application or tool that helps users generate, store, and manage their passwords securely. This eliminates the need for users to remember multiple complex passwords, making it easier to maintain good password hygiene and protect their online accounts from security breaches and hacking attempts. Password managers should encrypt your passwords and store them securely, making it much harder for hackers to access them.

However, there is a downside to this as well. Since your master password is the key to all of your stored passwords, if it is compromised, then all of your passwords are compromised. This is why it is crucial to choose a strong master password and to keep it secure. Because companies will do everything to protect your data... right? Oh, wait... [we all remember how Facebook uses and leaked our data](https://www.businessinsider.com/stolen-data-of-533-million-facebook-users-leaked-online-2021-4?r=US&IR=T)... Erm... Still, a password manager has its uses. It still protects us from criminals that could gain access to other websites and use that sensitive information to do more harm.

There are a lot of sites that give an overview of "password manager"-related data breaches. I started with this article: [Which Password Managers Have Been Hacked? – Best Reviews](https://password-managers.bestreviews.net/faq/which-password-managers-have-been-hacked/)

# Dedicated or browser?

Even if you do not explicitly choose a password manager, modern browsers like Firefox, Edge and Chrome offer to save your passwords. Browser-based password managers often have limited features compared to dedicated password manager apps. For example, they may not offer advanced security features such as two-factor authentication or password sharing.

1. Cross-device syncing: While some browsers may offer cross-device syncing of passwords, this feature may not work as well as dedicated password managers. For example, you may have trouble syncing passwords across multiple devices or browsers.
    
2. Security risks: Browser-based password managers are still vulnerable to security risks, such as phishing attacks and data breaches. In addition, browser extensions can be a target for attackers who want to compromise your passwords.
    

## So what is out there?

Other sites are better equipped to give you answers to the question of what good password managers are. Go visit [passwordmanager.com](https://www.passwordmanager.com/). But while you are here...

I'd like to draw attention to two open-source password managers: [Bitwarden](https://bitwarden.com/) and [Keepass](https://keepass.info/). Both of these options are open source, with Bitwarden providing [a unified solution](https://bitwarden.com/download/) for both Windows and mobile devices, while Keepass offers a more customizable experience, allowing you to pick and choose the features you desire from [a wide array of available plugins.](https://keepass.info/plugins.html)

[Bitwarden can be self-hosted if desired](https://bitwarden.com/blog/new-deployment-option-for-self-hosting-bitwarden/) using the new unified deployment that requires just one docker image. It adds a layer of protection in the event of a breach on their servers. Go ahead an play around with our free Azure credits each month. For the ones that want to make use of their Synology NAS, [there are good reads to find as well.](https://mariushosting.com/how-to-install-bitwarden-on-your-synology-nas/) Do make sure that you take every precaution when you want to host a service and expose it to the internet. Another downside is that you need to update the software as well with the updates they provide.

Though it's worth noting that the service has yet to experience any data breaches and appears to have strong security measures in place. They had [two vulnerabilities](https://www.cvedetails.com/vulnerability-list/vendor_id-22468/Bitwarden.html) that have been addressed. The pull requests are an interesting read: [CVE-2020-15879](https://github.com/bitwarden/server/pull/827) and [CVE-2019-19766](https://github.com/bitwarden/server/issues/589) . [CVE-2020-15879](https://github.com/bitwarden/server/pull/827) was discovered by [HackerOne](https://www.hackerone.com/).

It is cool to note that Bitwarden also has [a public API](https://bitwarden.com/help/public-api/). If you want to integrate Bitwarden's password management and security features into your application or website. Just make sure your integration does not have any security risks...

While there have been [some vulnerabilities](https://www.cvedetails.com/vulnerability-list/vendor_id-12214/Keepass.html) identified in Keepass, the tool's offline nature makes it a less attractive target for hackers seeking large amounts of valuable data to sell to malicious parties.

# Form filling

While it's important to use unique passwords to limit the scope of a potential cyber attack, it's also important to remember that if personal data is stolen, it can be difficult to regain control of that information. Therefore, if possible, it's best to avoid storing personal data with the company or website in question. Instead, consider using the form-filling feature and opting for guest access when possible, to limit the amount of personal data that needs to be shared. There will be another post on the dangers of leaking data...

# Outro

I did some research for this blog post and I am happy with my choice of using Bitwarden. However, the way that Chrome and Edge offer to fill in login prompts, gives a superior user experience than the way that Bitwarden offers. Not that Bitwarden's offers are bad, not at all. I am still in doubt so I use both of them. That is bad practice because my passwords are now out of sync and in two places. I need to make work of that.

The problem is not that I do not use a password manager... The problem is the leak at the companies where my data is stored. By using a password manager I can limit the risk that criminals can do something with my credentials. However, the criminals are not interested in only those credentials... Personal information is also leaked. That is the reason why I get scam emails and sms. I need to do more research on how to protect myself further.

For the persons that are still sceptical about what leaking personal information can do, [listen to this flemish podcast](https://www.standaard.be/cnt/dmf20230309_95135028) (start at minute 20). To quote this [source](https://www.thesun.co.uk/tech/20733191/whatsapp-scam-danger-avoid-how-warning/): `It's the beginning of a con that involves tricking parents into thinking they're` [`speaking to their children`](https://www.thesun.co.uk/tech/17159706/parents-warned-whatsapp-scam-distressed/)`.`


