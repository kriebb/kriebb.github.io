---
layout: resume
title: "CV"
permalink: "/cv/"
description: "Kristof Riebbels' professionele CV - Expertise in .NET ontwikkeling, software architectuur en veilige codeerpraktijken."
sidebar: true
toc: true
lang: nl
ref: resume
pageid: resume

---

Hieronder staan enkele voorbeelden van mijn persoonlijke en open-source projecten:


## Professioneel Profiel

Senior .NET Ontwikkelaar met meer dan 17 jaar ervaring in veilige en onderhoudbare oplossingen. Gepassioneerd door clean code, SOLID principes en test-driven development. Ervaren in het ontwerpen en implementeren van cloud-gebaseerde (Azure) systemen.

Belangrijkste sterke punten:
- .NET Core/C# applicatieontwikkeling
- Software architectuur en ontwerppatronen
- Test-driven development en kwaliteitsborging
- Authenticatie/beveiliging implementatie (OIDC)
- Mentoring en Agile methodologieën

## Kerncompetenties
{% include resume.html section="core_competences" %}

## Projecten en Voorbeelden

{% include projects.html %}

Voor meer projecten, bezoek mijn [GitHub profiel](https://github.com/kriebb).

## Vaardigheden en Expertise
{% include resume.html section="development_and_programming" %}

## Opleiding en Afstudeerproject
{% for edu_item in site.data.resume[site.active_lang].education %}
- {{ edu_item }}
{% endfor %}

## Certificeringen
<div class="certification-container">
    {% include certification-logos.html %}
</div>

## {{ site.data.i18n[site.active_lang].resume.languages }}
{% for lang_item in site.data.resume[site.active_lang].languages %}
- {{ lang_item }}
{% endfor %}

## Interesses en Hobby's
{% for interest in site.data.resume[site.active_lang].interests_and_hobbies %}
- {{ interest }}
{% endfor %}

## Praat Met Mij Over
{% for topic in site.data.resume[site.active_lang].talk_to_me_about %}
- {{ topic }}
{% endfor %}