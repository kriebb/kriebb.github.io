---
lang: nl
ref: blog
layout: page
title: "Blog"
permalink: "/blog"
sidebar: false
---

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> - <small>{{ post.date | date: "%B %d, %Y" }}</small>
    </li>
  {% endfor %}
</ul>


