---
date: 2023-06-17
title: "Dive into Code: Unleashing the DotNet 6 Configuration Management"
seoDescription: "Master DotNet 6 Config Management: Create IConfiguration, use default sources and how to add custom sources like Azure KeyVault and Azure AppConfiguration"
datePublished: 2023-06-17T13:48:43Z
cuid: clj0215vw00020amfb8p0cw9u
slug: dive-into-code-unleashing-the-dotnet-6-configuration-management
cover: /assets/images/blog/dive-into-code-unleashing-the-dotnet-6-configuration-management/2023-06-17-dive-into-code-unleashing-the-dotnet-6-configuration-management.cover.jpeg
tags: dotnet configuration azure management software development growth career cloud
---

## Previously on...

[Previously, in my blog post](https://dotnet.kriebbels.me/configuration-the-tangle-of-layers-sections-and-sources-in-net-6-development) I discussed that Dotnet 6 Configuration allows dynamic reloading of configuration data without application restarts and supported multiple sources such as environment variables, appsettings.json, user secrets, Azure KeyVault, and command line arguments.

I emphasized the significance of proper configuration management and introduced concepts like layered configuration, sections, and different configuration sources like file-based storage, Azure Key Vault for sensitive data, and the Azure App Configuration service for centralized management.

I also mentioned the usage of the `secrets.json` file for sensitive values and gave a glimpse of upcoming topics such as configuration defaults, consuming configuration data, and debugging in Azure deployments.

## Context

By reading my previous post on Dotnet 6 Configuration, I can now tell how to map the theory on the practical side.

This time, the context of this post is rather short. You can read more on the how and the why in my previous post. I explained the IOptions Pattern multiple times and to help myself to give others a better understanding, I write this post.

To work with this code, I strongly suggest checking out a tool called [LINQPad](https://www.linqpad.net/). That is a paid tool, but it is useful to try out snippets of code, like the ones that I offer here in my posts. My go-to tool is the open-source variant of LINQPad called [RoslynPad](https://roslynpad.net/).

Let us dive into it.

## Creating an `IConfiguration` object

Before we continue to discuss what configurations are default loaded, it is interesting to see how I create an `IConfiguration` object.

The code below creates an instance of the `ConfigurationBuilder` class.

```cs
var builder = new ConfigurationBuilder()
.SetBasePath(Directory.GetCurrentDirectory())
.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
.AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true)
.AddEnvironmentVariables()
.AddCommandLine(args);

var configuration = builder.Build();
```


The `ConfigurationBuilder` instance loads an application configuration from various sources: `appsettings.json`, `appsettings.{environment}.json`, environment variables, and command-line arguments.

The `SetBasePath` method sets the base path for configuration files to the current directory. The `AddJsonFile` method loads the `appsettings.json` file, with the optional flag set to true (so it will not throw an exception if the file is missing), and reloadOnChange set to true (so the configuration values will be reloaded when the file changes). The `AddJsonFile` method also loads an environment-specific `appsettings.{environment}.json` file, if it exists. The `{environment}` value is interpolated from the `ASPNETCORE_ENVIRONMENT` or `DOTNET_ENVIRONMENT` environment variable. The `AddEnvironmentVariables` method loads any configuration values that are specified as environment variables. The `AddCommandLine` method loads configuration values from command-line arguments.

It's worth noting that the code I provide sets up configuration manually using `ConfigurationBuilder`. However, both `HostBuilder` (for console apps) and `WebApplicationBuilder` (for ASP.NET Core apps) automatically set up different configuration sources behind the scenes. I don't necessarily need to use `ConfigurationBuilder` directly in my code when using these builders.

Now we got a hands-on feeling of how I can do it manually, I am ready to explore what the HostBuilder already provides.

## Default configuration sources

Only for a typical old-school Console Application, I still need to choose my configuration sources. When I build a web application or a backend service, Dotnet offers us predefined configuration sources and providers.

### For a backend service: `HostBuilder`

The class `HostBuilder` automatically sets the environment to `Production`. This behaviour can be altered by setting the environment variable `DOTNET_ENVIRONMENT`. This is important to read environment-specific files e.g. `appsettings.<dotnet_environment>.json`.

The `HostBuilder` also sets the content root of the application to the base directory of the assembly.

### For WebApplication

Like creating a backend service, when I create an ASP.NET Core web application, the application is configured with preconfigured configuration sources.

This is achieved through the `WebApplicationBuilder`. That class extends the `HostBuilder` to provide additional web-specific features and configurations.

| Builder Type          | Configuration Sources (in priority order)                     |
|-----------------------|---------------------------------------------------------------|
| HostBuilder           | 1. `appsettings.json`<br>2. `appsettings.{Environment}.json`<br>3. Environment variables |
| WebApplicationBuilder | 1. Command-line arguments<br>2. Non-prefixed environment variables<br>3. User secrets (in Development)<br>4. `appsettings.{Environment}.json`<br>5. `appsettings.json` |

### For Testing

Testing and files do not have a good relationship. I can work with different kinds of sources for testing purposes. There is an alternative: [the InMemoryCollection provider](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.configuration.memoryconfigurationbuilderextensions.addinmemorycollection?view=dotnet-plat-ext-7.0). By reusing the `configurationbuilder`, I can add one more configuration source. This allows me to add or override configuration values using the `:` syntax. Because the highest layer always wins, I can override the configuration for my (integration) tests.

Let us explore more on how the syntax works when consuming the configuration.

## Non-default configuration source

By default, the Azure KeyVault and the Azure AppConfiguration Service are not available. Microsoft has Nuget packages and tutorials on how to add those. More on that later.

### Adding a Keyvault

The code shows the addition of the Azure Key vault as a source to a backend service when the `DOTNET_ENVIRONMENT` environment variable equals the value `Production`. Values specified in the `appsettings.json`, `appsettings.Production.json`, and environment variables will be overwritten by the values provided by the Azure Keyvault instance.

```cs
Host.CreateDefaultBuilder(args)
.ConfigureAppConfiguration((context, configBuilder) =>
{
if (context.HostingEnvironment.IsProduction())
{
var builtConfig = configBuilder.Build();
var vaultName = builtConfig["KeyVault:Name"];
var clientId = builtConfig["KeyVault:ClientId"];
var clientSecret = builtConfig["KeyVault:ClientSecret"];
        configBuilder.AddAzureKeyVault(
            $"https://{vaultName}.vault.azure.net/",
            clientId,
            clientSecret);
    }
})
```


### Adding an App Configuration Service

[In this tutorial](https://learn.microsoft.com/en-us/azure/azure-app-configuration/enable-dynamic-configuration-aspnet-core?tabs=core6x), Microsoft provides a comprehensive guide for implementing dynamic configuration updates in an ASP.NET Core app using the App Configuration provider library. The guide emphasizes the importance of setting up the app to respond to changes in the App Configuration store and provides step-by-step instructions to achieve this.


```cs
var builder = WebApplication.CreateBuilder(args);

// Load configuration from Azure App Configuration
builder.Configuration.AddAzureAppConfiguration(options =>
{
options.Connect(connectionString)
.Select("WebApp:MySettings:*", LabelFilter.Null)
.ConfigureRefresh(refreshOptions =>
refreshOptions.Register("WebApp:AzureAppConfiguration:Sentinel", refreshAll: true));
});

var app = builder.Build();

// Use Azure App Configuration middleware for dynamic configuration refresh.
app.UseAzureAppConfiguration();
```


## IConfiguration vs ConfigurationManager

Let me show the example with the Azure KeyVault. Before DotNet 6, when configuring the Azure Key Vault provider, it is necessary to have the URL to the key vault. That is typically something I store in the app settings. However, to use the value to connect to the key vault, I have to have access to the `IConfiguration` object. Note that the application is still configured, so it can be that configuration of the application is not yet complete.

I recommend watching the complete example [on this link](https://learn.microsoft.com/en-us/aspnet/core/security/key-vault-configuration?view=aspnetcore-5.0#use-application-id-and-x509-certificate-for-non-azure-hosted-apps). Below I show the needed statements that illustrate the problem.

```cs
Host.CreateDefaultBuilder(args)
.ConfigureAppConfiguration((context, config) =>
{
var builtConfig = config.Build();
config.AddAzureKeyVault(new ... builtConfig["AzureKeyVault:Url"] ...
})
```


To access the setting `AzureKeyVault:Url`, I need to build the partial configuration result by calling `IConfigurationBuilder.Build`. From there, the required configuration values can be retrieved and used to add the remaining configuration sources.

When the application is finished setting up and ready to start, the framework will call the `IConfigurationBuilder.Build` implicitly to generate the final `IConfigurationRoot` and using that for the final app configuration.

However, the downside of this approach is that `Build()` has to be called twice - once to build the `IConfigurationRoot` uses the first sources and then again to build the `IConfigurationRoot` uses all the sources, including the Azure Key Vault source. This can result in messiness.

.Net 6 solved this by introducing the `ConfigurationManager`, which acts as a `ConfigurationBuilder` and implements the IConfiguration interface. Using the `ConfigurationManager` **comes at a cost tough**. Use it when needed, otherwise, use the built `IConfiguration` object in the program.cs

Andrew Look wrote a good post on this: [Looking inside ConfigurationManager in .NET 6](https://andrewlock.net/exploring-dotnet-6-part-1-looking-inside-configurationmanager-in-dotnet-6/)

## Register the configuration

I will explain how to register the settings using the `AddIOptions` and the `PostConfigure<>` methods. Off course, I mention how to validate your settings using `DataAnnotations`.

The difference between the `AddIOptions` and the `Configure<>` method will be covered as well.

### Dependency Injection

Dotnet 6 has support from the ground up to work with Dependency Inversion. To ensure that is enforced, Dotnet enforces you to work with a dependency container. I need to register all my settings and services in the IServiceCollection. When the application is run, I can inject the services that are registered into the container.

In my previous blog, I wrote that configuration is split into sections for easier management of the applications modules. Using the IServiceCollection and sections, I am inspired to group my configuration sections functional.

Below you will read how I can access those separate sections.

### Segregate the configuration into sections

Below I show a configuration section called `MySettings` in the `appsettings.json` file.

```json
{
"MySettings": {
"Username": "myuser",
"Password": "mypassword",
"MaxConnections": 10
}
}
```


Create a sealed record to hold the configuration data. The record properties must match the names of the configuration keys.

```cs
public class MySettings
{
public string Username { get; set; }
public string Password { get; set; }
public int MaxConnections { get; set; }
}
```


In the code below, I use the `IConfiguration.GetSection()` method to get a reference to the configuration section, and then use the `Bind()` method to bind the configuration data to an instance of the `MySettings` class:

```cs
var section = Configuration.GetSection("MySettings");
var mySettings = new MySettings();
section.Bind(mySettings);
```


After this code executes, the `mySettings` object will contain the values from the `"MySettings"` configuration section.

The `Bind()` method recursively binds nested configuration subsections to nested object classes.

To access that object in a class, I can opt to register it in the dependency container. However, I rather use the IOptions-pattern.

### Configure a section with `.AddOptions<>()`

The `.AddOptions<>()` method combined with the `IOptions<T>` interface provides flexibility and features. `AddOptions` is an extension method on the `IServiceCollection` interface.

The [IOptions-patterns](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-7.0) allow me to configure individual options independently:

I can register multiple options classes for the same section and combine them as needed. While I can do this, I do not have a valid use case at the moment of writing.

```cs
serviceCollecton.AddOptions<MyViewOnSettings>("mysettings");
serviceCollecton.AddOptions<AnotherView>("mysettings");
```


Validation rules and defining default values for options are also a possibility. I use the validation to ensure that my application is started in a valid state on [startup](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.dependencyinjection.optionsbuilderextensions.validateonstart?view=dotnet-plat-ext-7.0). I can achieve this by adding validation to my class by using the [`DataAnnotations`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.dependencyinjection.optionsbuilderdataannotationsextensions?view=dotnet-plat-ext-7.0) namespace and adding validation attributes to the properties of my class.

```cs
serviceCollecton.AddOptions<MyViewOnSettings>("mysettings").ValidateOnStart().ValdiateDataAnnotations();

internal sealed record MyViewOnSettings
{
[Required]
public string Something {get;set;}
}
```


### Override your setting using `.PostConfigure<>`

I can execute post-configuration actions on the options object. That enables me dynamic modifications or custom logic based on the configured options. [I use this in my Integration Tests.](https://github.com/kriebb/MockOpenIdConnectIdpAspnetcore/blob/main/src/WeatherApp.Tests/Controllers/WeatherForecastServerSetupFixture.cs) I noticed that people are putting their Validations inside the PostConfigure method. That has to be from the era before the IOptions pattern existed. Use the DataAnnotations or Use Validation-method with a custom delegate handler.

```cs
public sealed class WeatherForecastServerSetupFixture : WebApplicationFactory<Program>
{
private Func<ITestOutputHelper?> _testoutputhelper = () => null;
protected override void ConfigureWebHost(IWebHostBuilder builder)
{
    builder.ConfigureTestServices(services =>
        {
            services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme,
                options =>
                {
                    // Configuration code would go here
                });
        });
}
``` 


## Difference between `.Configure<>` and `.AddOptions<>`

Behind the scenes, both `Configure<TOptions>()` and `OptionsBuilder<TOptions>.Configure()` methods end up doing the same thing by registering an instance of `ConfigureNamedOptions<TOptions>`.

The `OptionsBuilder<TOptions>.Bind()` method is equivalent to the `Configure<TOptions>(IConfiguration config)` method. While registering multiple implementations for the same service type provides a single instance of the latest registered dependency for that type, the options framework can work with an `IEnumerable<IConfigureOptions<TOptions>>` to provide all registered implementations.

The `Configure<>` method was available in an earlier version of DotNet Core. The `AddOptions<>` way of working came in a later version of DotNet. The `AddOptions<>`-method offers additional methods using the builder pattern, like `ValidateOnStart()` and `ValidateDataAnnotations()`

Read here for more information: [Question: AddOptions<T>() vs. Multiple Configure<T>()](https://github.com/dotnet/extensions/issues/514)

## What's next?

In one of my upcoming posts, I will discuss how to consume the registered configuration from the dependency container.

## Outro

As I made progress at the beginning of my journey with .NET Core 2.1, I came to appreciate the importance of `IConfigurationBuilder`. Through this, I was able to learn how to register and inject configurations into my services, allowing seamless access to settings throughout my application. I naturally divided settings into sections and found it quite effortless to configure them using `.AddOptions<>`. Additionally, I discovered that `.PostConfigure<>` enables me to override settings as needed, making my application flexible and adaptable for my tests!

However, I encountered my fair share of challenges along the way. The differences between `.Configure<>` and `.AddOptions<>` took some time to understand, and I had to understand when to use the DotNet 6 `ConfigurationManager` to embrace the power of instant access to settings instead of usage of `IConfiguration` that needs to be built first.

I performed the all-important `IOptions` startup validation checkup, ensuring the integrity of my configurations! This checkup gave me peace of mind, protecting my application against potential misconfigurations.
