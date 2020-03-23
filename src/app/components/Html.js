import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import config from '../../config';

/* eslint-disable react/no-danger */

class Html extends React.Component {
  static propTypes = {
    // url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    ogImage: PropTypes.string.isRequired,
    siteName: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    styles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        cssText: PropTypes.string.isRequired,
      }).isRequired,
    ),
    scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
    app: PropTypes.object, // eslint-disable-line
    children: PropTypes.string.isRequired,
    helmet: PropTypes.object,
    disableStore: PropTypes.bool,
  };

  static defaultProps = {
    styles: [],
    scripts: [],
    disableStore: false,
    helmet: {
      meta: {
        toComponent: () => {},
      }
    },
  };

  render() {
    // eslint-disable-next-line object-curly-newline
    const { disableStore, title, ogImage, description, domain, siteName, url, styles, scripts, app, children, helmet } = this.props;
    return (
      <html className="no-js" lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <title>{title}</title>

          <meta property="og:image" content={ogImage} />
          <meta property="og:site_name" content={siteName} />
          <meta property="og:title" content={title} />
          <meta property="og:type" content="showcase" />
          <meta property="og:url" content={url} />
          <meta property="og:description" content={description} />

          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {scripts.map(script => (
            <link key={script} rel="preload" href={script} as="script" />
          ))}
          <link rel="manifest" href={`${process.env.PUBLIC_URL || ''}/site.webmanifest`} />
          <link rel="apple-touch-icon" href="/icon.png" />
          {styles.map(style => (
            <style
              key={style.id}
              id={style.id}
              dangerouslySetInnerHTML={{ __html: style.cssText }}
            />
          ))}
          {helmet && helmet.meta.toComponent()}
        </head>
        <body>
          <noscript>{`${domain} requires javascript for the full experience`}</noscript>
          <div
            data-application="true"
            dangerouslySetInnerHTML={{ __html: children }}
          />
          {disableStore ? null
            : (
              <script
                data-store="true"
                dangerouslySetInnerHTML={{ __html: `window.a=${serialize(app)}` }}
              />
            )
          }

          {scripts.map(script => (
            <script key={script} src={script} />
          ))}
          {config.analytics.googleTrackingId && (
            <script
              dangerouslySetInnerHTML={{
                __html:
                  'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;'
                  + `ga('create','${
                    config.analytics.googleTrackingId
                  }','auto');ga('send','pageview')`,
              }}
            />
          )}
          {config.analytics.googleTrackingId && (
            <script
              src="https://www.google-analytics.com/analytics.js"
              async
              defer
            />
          )}
        </body>
      </html>
    );
  }
}

export default Html;
