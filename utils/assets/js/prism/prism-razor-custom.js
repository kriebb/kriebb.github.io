(function (Prism) {
    // Extend the Razor syntax definition to better highlight ASP.NET Tag Helpers
    Prism.languages.razor = Prism.languages.extend('markup', {
        'razor-comment': {
            pattern: /@\*[\s\S]*?\*@/,
            alias: 'comment'
        },
        'razor-block': {
            pattern: /(@\{)[\s\S]*?(\})/,
            inside: {
                'razor-punctuation': /[@{}]/,
                rest: Prism.languages.csharp
            },
            alias: 'block'
        },
        'razor-directive': {
            pattern: /^@(page|model|using|inherits|inject|implements|namespace|functions|section|addTagHelper)[\s\S]*$/m,
            alias: 'keyword',
            inside: {
                'directive-name': {
                    pattern: /^@\w+/,
                    alias: 'keyword'
                },
                rest: Prism.languages.csharp
            }
        },
        'razor-expression': {
            pattern: /@[^\s{}*]+/,
            alias: 'variable',
            inside: {
                'razor-punctuation': /@/,
                'expression': {
                    pattern: /[\s\S]+/,
                    inside: Prism.languages.csharp
                }
            }
        },
        'tag-helper-attribute': {
            pattern: /\s+(asp-[a-z\-]+)="[^"]*"/i,
            inside: {
                'tag-helper-name': {
                    pattern: /^(asp-[a-z\-]+)/i,
                    alias: 'attr-name tag-helper'
                },
                'punctuation': /=|"|'/,
                'value': {
                    pattern: /[^"'=<>\s]+/,
                    alias: 'attr-value'
                }
            }
        }
    });

    // Define cshtml as an alias of razor
    Prism.languages.cshtml = Prism.languages.razor;
}(Prism));
