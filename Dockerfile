FROM ruby:3.2

WORKDIR /app

ENV HOME=/tmp
ENV BUNDLE_APP_CONFIG=/usr/local/bundle
ENV BUNDLE_PATH=/usr/local/bundle

COPY Gemfile Gemfile.lock ./

RUN bundle config set path /usr/local/bundle \
    && bundle install
