---
date: 2023-06-10
title: "Safeguard Your Private Data, Programmers: Discover Secret Scanning"
seoDescription: "Utilize Windows Defender, GitLeaks, GitHub Advanced Security; safeguard data. Erase sensitive info via filter-branch, filter-repo, BFG Repo Cleaner"
datePublished: Sat Jun 10 2023 16:33:40 GMT+0000 (Coordinated Universal Time)
cuid: cliq7ubrs00050amlcrpoeeeg
slug: safeguard-your-private-data-programmers-discover-secret-scanning
cover: /assets/images/blog/safeguard-your-private-data-programmers-discover-secret-scanning/2023-06-10-safeguard-your-private-data-programmers-discover-secret-scanning.cover.jpeg
tags: github, git, secrets, gitguardian, gitleaks

---

# Previously on...

In my previous blogs, you may have noticed my growing interest in [security](https://dotnet.kriebbels.me/series/security) and [privacy](https://dotnet.kriebbels.me/series/privacy) topics. Of course, there is my already existing passion for [DevOps](https://dotnet.kriebbels.me/series/devops). However, in my latest blog post, I outlined how [DotNet 6 offers possibilities to store sensitive data outside the committable configuration](https://dotnet.kriebbels.me/configuration-the-tangle-of-layers-sections-and-sources-in-net-6-development): e.g. `appsettings.json`. In this post, I will combine all three topics and discuss possibilities for cleaning the Git history of sensitive information.

# Context

[Let me summarize what I read on the blogpost of GitGuardian and the storage of credentials in the git repository:](https://blog.gitguardian.com/secrets-credentials-api-git/)

Secrets may be stored intentionally for convenience, but they can also be hidden in text files, [Slack](https://slack.com/) messages, and debug application logs, or may simply be forgotten. [Git's design promotes the free distribution of code](https://git-scm.com/about) and that [makes it easy for secrets to be leaked.](https://www.csoonline.com/article/3634784/how-corporate-data-and-secrets-leak-from-github-repositories.html)

Attackers can exploit those leaks to gain access to sensitive information. By this personal services can be targeted. Code reviews will not detect secrets buried in Git's history.

I want to give a real-world scenario where storing a token leads to data leakage, discussed in the following article: [7 Real-Life Data Breaches Caused by Insider Threats | Ekran System](https://www.ekransystem.com/en/blog/real-life-examples-insider-threat-caused-breaches). Let me take the case of [Slack](https://slack.com/).

In December 2022, Slack's security team detected suspicious activity on the company's GitHub account, revealing that a malicious actor had gained unauthorized access to the company's resources by stealing Slack employees' tokens.

The investigation of this cybersecurity incident showed the perpetrators stole Slack's private code repositories which often contain sensitive information. [Slack did not disclose the type of information stolen](https://slack.com/intl/en-gb/blog/news/slack-security-update) or disclosed further information on who the vendor was or what services or products they provided. This decision may be due to several factors, such as preserving the integrity of ongoing investigations, preventing additional harm, or maintaining the confidentiality of affected parties. Publicly revealing certain details could inadvertently aid the perpetrators or heighten the risk of subsequent attacks.

# Protect the remote GIT repository

These days a lot of tooling exists to help you protect your GIT repositories from containing sensitive data. I mention Windows Defender for Azure DevOps, GitLeaks for AWS/Azure and Advanced Security on Github.

## Windows Defender for Azure DevOps

[Microsoft has a product called Windows defender that offers a plugin for Azure Devops](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-devops-introduction)

Defender for DevOps empowers developers prioritize critical code fixes with Pull Request annotations and assign developer ownership by triggering custom workflows.

Enabling it is quite easy. Look at the following page to know more.

[Configure the Microsoft Security DevOps Azure DevOps extension | Microsoft Learn](https://learn.microsoft.com/en-us/azure/defender-for-cloud/azure-devops-extension)

## GitLeaks

I will not discuss the AWS part. I am Azure focussed, so that is what I discuss in this post.

Here you find a summary of the video

%[https://www.youtube.com/watch?v=D3XWjOn87fs] 

As a developer, I do not always have the rights or the power to change the environment to leverage an enterprise tool like Windows Defender.

However, there is a public repository available on GitHub called [GitLeaks](https://github.com/gitleaks/gitleaks). Let me copy and paste their definitions:

> Gitleaks is a SAST tool for **detecting** and **preventing** hardcoded secrets like passwords, api keys, and tokens in git repos. Gitleaks is an **easy-to-use, all-in-one solution** for detecting secrets, past or present, in your code.

[I encourage you to read my blog post where I position SAST in the development lifecycle](https://dotnet.kriebbels.me/enable-developers-to-generate-safe-and-secure-code).

The following blog is a good read as a [Developer's Guide to Using Gitleaks to Detect Hardcoded Secrets](https://www.jit.io/blog/the-developers-guide-to-using-gitleaks-to-detect-hardcoded-secrets).

That blog will discuss Gitleaks. The blog explains that the tool is [ISO-27001](https://www.iso.org/standard/27001) compliant and works on public, private, remote, or local repositories.

Gitleaks has two main commands: detect and protect:

* The detect command scans the repository for potential vulnerabilities and generates a report with a list of potential vulnerabilities.
    
* The protect command creates a hook to prevent commits that introduce security vulnerabilities.
    

### In a development environment

I can set up GitLeaks on my developer computer using `Docker`, `Go` or use `Make` to create my build. The beauty of GitLeaks is that I can set it up as a `precommit`\-hook.

[In one of my previous blog posts, I wrote about Branch Hygiene to ensure I use a good naming strategy.](https://dotnet.kriebbels.me/branching-etiquette)

After configuring my pre-commit hook, I can try to commit a client secret and the following will be the result.

```plaintext
? git commit -m "this commit contains a secret"
Detect hardcoded secrets.................................................Failed
```

### In an Azure Pipeline

By using GitLeaks with Azure DevOps, regularly scanning code using GitLeaks and integrating it into the development pipeline can prevent code merges with potential vulnerabilities and prevent them from moving into production, protecting organizations' valuable data, and reputations.

I can use [Gitleaks as a plugin on Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Foxholenl.Gitleaks). When reading that page, I noticed that the author @[JoostVoskuil](@https://github.com/JoostVoskuil/azure-devops-gitleaks/commits?author=JoostVoskuil) gives credit to a colleague of mine: [Jesse Houwing - Xebia | Xpirit](https://xpirit.com/team/jesse-houwing/).

[Mark Patton gives a good view on how to use GitLeaks in Azure DevOps.](https://markpatton.cloud/2020/09/26/secret-scanning-protecting-your-code-in-azure-devops/)

The post provides instructions for adding the task and configuration with the appropriate parameters, including the path to the repository, report output location, and thresholds for failing a build.

This is a good demonstration of this matter:

%[https://www.youtube.com/watch?v=aSYEHUGHRxE] 

## GitHub Advanced Security: Secret Scanning

GitHub offers what they call [Advanced security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security). One of those features is called "*Secret Scanning*": GitHub scans every public repository for known types of secrets to avoid any misuse of accidentally committed secrets. Secret scanning searches through all Git history on all branches present in your GitHub repository for secrets. Any strings that match patterns provided by secret scanning partners, other service providers, or defined by organizations or users are reported as alerts in the Security tab of repositories.

The secret scanning feature offers alerts for partners that run automatically on public repositories and public `npm` packages to alert service providers about leaked secrets on [GitHub.com](http://GitHub.com). Another part of this feature is the encryption of the identified secrets using symmetric encryption during transmission and rest.

Secret scanning alerts for users are available for free on all public repositories. Organizations using GitHub Enterprise Cloud can enable secret scanning alerts for users on their private as well as internal repositories and public repositories for free with a license for GitHub Advanced Security. An alert is also sent to contributors who committed the secret if they haven't ignored the repository.

When you want to know more about GitHub AdvancedSecurity, Go visit this [blogpost](https://devopsjournal.io/blog/2023/05/23/GitHub-Advanced-Security-Azure-DevOps) about Advanced Security. It is written by my [Xebia | Xpirit](https://xpirit.com) college Rob Bos and he is known as an authority when it comes to Github.

# How to manually undo my mistake

There are multiple strategies to undo a mistake after doing a `git push`. I can opt for removing the file history or replacing text. I listed `filter-branch`, `filter-repo` and `BFG` as possible options. [GitHub offers a page about what to do when you committed a secret and you want to remove it.](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

## First thing first: Retract your secret

If I have leaked a secret and pushed it to a remote repository like GitHub or Azure DevOps, it is imperative that I consider it leaked. I should revoke it immediately.

[GitGuardian has a blog post on this matter](https://blog.gitguardian.com/leaking-secrets-on-github-what-to-do/). [I want to give credit to Rob to bring this to my attention.](https://www.linkedin.com/feed/update/urn:li:activity:7073337423643955200?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7073337423643955200%2C7073382633379909632%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287073382633379909632%2Curn%3Ali%3Aactivity%3A7073337423643955200%29)

If I remove the secret from GIT's history, it may still be accessible by bad actors who may have obtained it earlier. The window of abuse should be as small as possible! I can still rewrite the history and do the cleanup, but security-wise, I need to revoke it first. GitGuardian offers a GitHub page ([link)](https://github.com/GitGuardian/APISecurityBestPractices/blob/master/Leak%20Mitigation%20Checklist.md?ref=blog.gitguardian.com#2-advice-specific-to-a-key) where I can a good overview of where and what I can do to revoke a secret.  
  
Gihub offers a functionality called: "[push protection](https://github.com/settings/security_analysis)". GitHub will not accept the content and will thus not leak it. [This functionality will be available on Azure DevOps as well](https://learn.microsoft.com/en-us/azure/devops/repos/security/configure-github-advanced-security-features?view=azure-devops&tabs=yaml). [I can enable push protection on GitHub for your public repos for free](https://github.com/settings/security_analysis).

## Remove file history

If I have accidentally committed and pushed an `appsettings.json` file containing a `ClientSecret` to a Git repository, it is essential to remove or revoke the `ClientSecret` immediately.

1. First, remove the `ClientSecret` from the `appsettings.json` file of the local repository.
    
2. Commit the changes and push the changes to the remote Git Repository
    

```csharp
git add .
git commit -m "Removed ClientSecret from appsettings"
git push
```

However, the `ClientSecret` still exists in the repository history, and it is accessible through Git commands like [`git log`](https://marketsplash.com/tutorials/git/git-log/) or `git checkout`.

To remove the `ClientSecret` from the Git repository history:

1. Identify the hash of the Git commit that added the `appsettings.json` file with the `ClientSecret`. I can do this by running the `git log` command and finding the commit that added the file.
    
2. Run the following command to remove the file from the commit history:
    

```csharp
git filter-branch --tree-filter 'rm -f appsettings.json' --prune-empty HEAD
```

This command will remove the file from the commit history for all branches.

1. `push --force` will overwrite the remote repository's history
    

```csharp
git push --force
```

The command overwrites the existing commit history for that file. This can lead to loss of data and confusion for other team members.

## Replace text

Luckily, there are other options available, such as replacing text. Read it on the site of [GitGuardian](https://blog.gitguardian.com/rewriting-git-history-cheatsheet/) or read the following summary

1. Download and install `git-filter-repo`
    
2. Create `replacements.txt` with on the left of `==>` , what I want to replace and on the right side of `==>` the text that I want to replace with: `toreplace==>replacewidth.` With a concrete example: `'123abc'==>ENV[‘AUTH_TOKEN’].`
    
    ```plaintext
    ‘eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c’==>ENV[‘AUTH_TOKEN’]
    ```
    
3. Use `git filter-repo --replace-text ../replacements.txt --force` to remove selected lines of code containing sensitive information
    
4. Force Push:
    
    1. Use `git push --all --tags --force` for remote repositories
        

## BFG Repo Cleaner

There is an alternative for the `filter-branch` and `filter-repo` commands that seems quite popular.

The `BFG` is a simpler and faster alternative to `git-filter-branch` for cleansing unwanted data from your Git repository history, such as removing large files or sensitive information like passwords and credentials. While `git-filter-branch` is a powerful tool with capabilities beyond what `BFG` can offer. `BFG` excels in the tasks due to its speed, and simplicity.

The following post [Removing sensitive data from your Git history with BFG - DEV Community](https://dev.to/toureholder/removing-sensitive-data-from-your-git-history-with-bfg-4ni4)

I will give a summary on how to clean sensitive information using the BFG.

Use `--replace-text` to clean strings from your repo history. Each string will be rewritten as `"***REMOVED***"` by default. This is a two-step process.

1. Create a file `passwords.txt`. Add a line for each secret that needs to be removed.
    

```bash
fooPassword1
barPassword2
ey...
```

1. Execute `bfg --replace-text`
    

Execute the command with a reference to passwords.txt and the repository in question, here called `foobar.git`

```bash
$ bfg --replace-text passwords.txt foobar.git
```

# Outro

I had initially used `filter-branch` for my [Dotnet 6 Configuration post](https://dotnet.kriebbels.me/configuration-the-tangle-of-layers-sections-and-sources-in-net-6-development) to erase sensitive info from my history. But, the more I delved into the topic, the more I realised there's a lot more to it than meets the eye. My next move is to put my research to the test and show what commands I used by attaching some before and after screenshots to illustrate the effects.


