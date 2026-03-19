# IT KRIEBBELS - Jekyll Site

Dit is een Jekyll-website die jouw persoonlijke branding en werkervaring presenteert. De site maakt gebruik van een **data-gedreven aanpak** voor de tijdlijn van je werkervaring, waardoor je HTML en content netjes gescheiden houdt.

## Structuuroverzicht

```text
.
├── _config.yml
├── Gemfile
├── _data/
│   └── work_experience.yml    # Hier staat je werkervaring in YAML
├── _layouts/
│   ├── default.html           # Basislayout
│   ├── page.html              # Layout voor standaardpagina's
│   └── ...
├── _includes/
│   ├── head.html
│   └── footer.html
├── assets/
│   ├── css/
│   │   └── style.css          # CSS voor je design
│   └── js/
│       └── main.js
├── index.md                   # Homepage
├── work-experience.md         # Pagina met Liquid-loop die data uit .yml haalt
├── about.md
├── contact.md
└── ...
```

### Belangrijkste onderdelen
- **`_data/work_experience.yml`**: YAML-bestand met al je werkervaring (datum, functie, bullets).  
- **`work-experience.md`**: Maakt gebruik van een Liquid-loop om items uit `_data/work_experience.yml` in een tijdlijnstructuur te tonen.  
- **`style.css`**: Bevat de styling (inclusief `.timeline`, `.timeline-item`, enz.).  
- **`_config.yml`**: Basisinstellingen voor Jekyll en plugins.

---

## Installatie & Commando’s

Zorg dat je [Ruby](https://www.ruby-lang.org/en/downloads/) en [Bundler](https://bundler.io/) geïnstalleerd hebt.

1. **Repo klonen**  
   ```bash
   git clone https://github.com/gebruikersnaam/it-kriebels-site.git
   cd it-kriebels-site
   ```

2. **Gems installeren**  
   ```bash
   bundle install
   ```
   Hiermee installeer je alle Ruby-gems die nodig zijn (zoals `github-pages` en eventuele andere plugins).

3. **Lokale server starten**  
   ```bash
   bundle exec jekyll serve
   ```
   - De site is nu beschikbaar op [http://localhost:4000](http://localhost:4000) (of de poort die in je terminal getoond wordt).

4. **Aanpassingen maken**  
   - **Data wijzigen** in `_data/work_experience.yml` als je nieuwe rollen of projecten wilt toevoegen.  
   - **HTML/Layout** in `work-experience.md` blijft grotendeels hetzelfde; alleen de Liquid-loop verwerkt de YAML.  
   - **Styling** pas je aan in `assets/css/style.css` (bijv. `.timeline`, `.timeline-item`).

5. **Deployen naar GitHub Pages** (optioneel)  
   - Ga naar je repository-instellingen op GitHub.  
   - Schakel GitHub Pages in en kies de juiste branch (bijv. `main` of `gh-pages`) en root.  
   - Na enkele minuten is je site live. De exacte URL vind je in de GitHub Pages-instellingen.

---

## Data-gedreven Tijdlijn

De werkervaring staat in [`_data/work_experience.yml`](./_data/work_experience.yml). Voor elk item vul je in:

```yaml
- date: "04/2017 – Present"
  company: "RecoMatics – Solution Engineer"
  bullets:
    - "Analyzing customer needs..."
    - "Maintaining a SaaS product..."
    - "..."

- date: "08/2014 – 04/2017"
  company: "Qite – Senior Software Developer (C#)"
  bullets:
    - "Developing & maintaining..."
    - "..."
```

In [`work-experience.md`](./work-experience.md) wordt met Liquid de data opgehaald:

```liquid
{% for item in site.data.work_experience %}
<div class="timeline-item">
  <div class="content">
    <div class="date">{{ item.date }}</div>
    <h3>{{ item.company }}</h3>
    <ul>
      {% for bullet in item.bullets %}
      <li>{{ bullet }}</li>
      {% endfor %}
    </ul>
  </div>
</div>
{% endfor %}
```

---

## Styling

- In [`assets/css/style.css`](./assets/css/style.css) vind je de hoofdopmaak.  
- Klassen zoals `.timeline`, `.timeline-item`, en `.content` zorgen voor de verticale tijdlijn.  
- Je kunt bullets en iconen aanpassen in de `::before`-selector of door Font Awesome toe te voegen.

---

## Contact & Vragen

- **E-mail**: [kristof@riebbels.be](mailto:kristof@riebbels.be)  
- **Issues**: Dien een issue in op GitHub als je vragen of problemen hebt.

Veel succes met je website! Als je nog vragen hebt, voel je vrij om contact op te nemen.  

*© 2025 IT KRIEBBELS. All rights reserved.*

---

## Docker Development Preview

If you do not want Ruby or gems on your host, use the Docker preview workflow instead.

This keeps Jekyll running in a container while you edit the repo in VS Code.

### Start the preview

```bash
LOCAL_UID=$(id -u) LOCAL_GID=$(id -g) docker compose up
```

What this does:

- builds a local dev image with the Jekyll toolchain and gems already installed
- serves the site on `http://127.0.0.1:4000`
- enables `--watch` for mounted-file changes
- enables `--future` so scheduled posts are visible locally
- enables LiveReload on port `35729`
- keeps generated preview output inside the container instead of writing Ruby/Jekyll artifacts into your repo

### Open the site

- Site: `http://127.0.0.1:4000`
- LiveReload: `http://127.0.0.1:35729`

### Typical workflow

1. Open this repo in VS Code.
2. Run `LOCAL_UID=$(id -u) LOCAL_GID=$(id -g) docker compose up`.
3. Keep the container running.
4. Edit posts, layouts, includes, Sass, or images.
5. Refresh the browser and inspect the rendered result.

### Stop the preview

```bash
docker compose down
```

### Notes

- Running with `LOCAL_UID` and `LOCAL_GID` avoids root-owned files in the repo during local development.
- If port `4000` is already in use, start it like this instead:

```bash
LOCAL_UID=$(id -u) LOCAL_GID=$(id -g) JEKYLL_PORT=4001 LIVERELOAD_PORT=35730 docker compose up
```
- The first `docker compose up` builds the local image.
- Later restarts reuse that built image, so startup is much faster than reinstalling gems every time.
