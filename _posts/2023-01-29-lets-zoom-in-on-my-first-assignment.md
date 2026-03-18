---
date: 2023-01-29
title: "Let's zoom in on my first assignment"
datePublished: 2023-01-29T19:06:13.000Z
cuid: cldhr61on000209l4ex6g4h8l
slug: lets-zoom-in-on-my-first-assignment
cover: /assets/images/blog/lets-zoom-in-on-my-first-assignment/2023-01-29-lets-zoom-in-on-my-first-assignment.cover.jpeg
tags: software-development consulting rest-api azure-devops identity-management knowledge-sharing
---

## Previously on...

I finished up my previous series about how I started to explore the consultant side of the IT sector.

This blog post starts a new series. Below you can find a bullet list of what is used in this project. The topics on which I'll be blogging are DevOps, Analyses, Development, Acceptance Environments, Documentation and Knowledge sharing. This way, I have some structure on what I can write about next.

Through this, I want to inspire others or have discussions about why other approaches can be more beneficial.

## Context

I help deliver a project that will enable a user to signup into the customer portal using a registration system. The customer asked me to develop two Web App services that are functioning as REST APIs.

When a user signs up, he will have two options:

- Using Auth0 and ItsMe, so the user can be verified using the ItsMe app
- Using personal data with verification sent by SMS or email

## Technology Used

### DevOps

I do not have access to create pipelines and resources in [Azure DevOps](https://azure.microsoft.com/nl-nl/products/devops). However, I do function as a lead for my services so I do work closely with the DevOps persons when problems arise or information is needed.

- All services make use of continuous integration as well as continuous development. The customer describes what branching strategy I should use.
- The entire solution is deployed using [Web App ASE on Azure](https://learn.microsoft.com/en-us/azure/app-service/environment/intro).

### Analysis

This has already been done by the enterprise architect and the business analyst. What I did was help with:

- Clarifications and documents to reflect what is development
- Challenging content of [access tokens](https://oauth.net/2/access-tokens/)
- Challenging REST-call signatures

### Development

The setup of the solution consists of a service-oriented architecture. With some good faith, you can see some resemblance with the microservice-oriented architecture.

- Backend services make use of [Asp.net core version 6.0](https://learn.microsoft.com/en-us/aspnet/core/?view=aspnetcore-6.0) using [Swagger](https://swagger.io/) as documentation
- The user interface makes use of [Asp.net core MVC 6](https://learn.microsoft.com/en-us/aspnet/core/?view=aspnetcore-6.0) and [Swagger](https://swagger.io/)
- The services can only talk to each other when using [Azure API Management](https://azure.microsoft.com/en-us/products/api-management)
- Secrets should be handled with care using [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault/). For local development, [secrets are not checked in the repository](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-7.0&tabs=windows)
- All consumers should identify themselves using [OAuth2](https://www.rfc-editor.org/rfc/rfc6749). Claims are used for authorization. For some legacy services, certificates are used for authorization
- I use validation using [FluentValidation](https://www.nuget.org/packages/FluentValidation.AspNetCore/). An [extension](https://github.com/micro-elements/MicroElements.Swashbuckle.FluentValidation) for integrating FluentValidation with Swagger is used. Attributes are used as little as possible to have clean data transfer objects
- In the core of the REST services, a domain is created. However, I would not call this [domain-driven design](https://en.wikipedia.org/wiki/Domain-driven_design)
- [Separation of concern](https://medium.com/machine-words/separation-of-concerns-1d735b703a60) (and layers) is enforced using mappers
- The package [Polly](https://www.nuget.org/packages/polly/) is used when libraries do not retry on Http Status Code 429
- Exceptions are there when unexpected technical behavior occurs. I made use of [CSharpFunctionalExtensions](https://github.com/vkhorikov/CSharpFunctionalExtensions) NuGet package to have support for validation during the whole flow
- Configuration happens using appsettings.json and using the [IOptionsMonitor](https://learn.microsoft.com/en-us/dotnet/core/extensions/options). [AzureKeyvault extensions](https://www.nuget.org/packages/Azure.Extensions.AspNetCore.Configuration.Secrets/) are enabled
- Classes are marked as [internal and sealed](https://www.youtube.com/watch?v=d76WWAD99Yo) where possible for performance gains
- [Newtonsoft.json is used as little as possible](https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/migrate-from-newtonsoft?pivots=dotnet-7-0). The one that should be used the most is System.Text.Json
- [Dependency Injection is used](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
- Logging is enabled using the native [Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview?tabs=net) library package. For local logging, the NuGet package [NLog](https://nlog-project.org/) is used with [Microsoft](https://github.com/NLog/NLog.Extensions.Logging) Extensions

## Project Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Frontend | ASP.NET Core MVC 6 | User interface |
| Backend | ASP.NET Core 6.0 | REST API services |
| API Documentation | Swagger | API documentation and testing |
| Authentication | OAuth2, Auth0, ItsMe | User identity verification |
| Validation | FluentValidation | Request validation |
| Configuration | IOptionsMonitor, Azure Key Vault | Secure configuration management |
| Resilience | Polly | HTTP retry policies |
| Serialization | System.Text.Json | JSON handling |
| Logging | Application Insights, NLog | Monitoring and diagnostics |
| Cloud Infrastructure | Azure App Service Environment | Hosting environment |
| API Management | Azure API Management | Service communication |

### Acceptance Environments

The business analyst will validate the services using SoapUI and Postman. Whenever an error occurs, extra system tests and/or unit tests are written.

### Documentation

The analysis needs to reflect what is going to be developed, as well as what is developed. However, I make it my mission to put as much of the documentation in Swagger.

### Knowledge Sharing

- Each week, there is one hour that the .NET developers on the project meet to exchange strange issues, nice discoveries, and so on
- Using the [4 eyes principle](https://ec.europa.eu/eurostat/cros/content/four-eyes-principle_en), we can help out each other
- When there is some discussion where the customer does want to have some answer, I do talk to my XPirit colleagues about it. After having the discussion, I write a concise email to the customer with the problem and how we recommend approaching this

## Outro

With this post, I have mentioned a lot of technologies, architectures, and ways of working that I will explain more about in the next posts. Let me know what topic you want to know more about in this context.
