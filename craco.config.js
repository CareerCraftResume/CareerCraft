const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Modify source-map-loader configuration
      webpackConfig.module.rules.forEach(rule => {
        if (rule.enforce === 'pre' && rule.use && rule.use[0].loader === 'source-map-loader') {
          rule.exclude = [
            /node_modules\/formik/,
            /node_modules\/yup/,
            /node_modules\/@babel/,
            /node_modules\/react-beautiful-dnd/
          ];
        }
      });

      if (env === 'production') {
        // Configure source maps
        webpackConfig.devtool = 'source-map';
        webpackConfig.ignoreWarnings = [/Failed to parse source map/];

        // Production optimizations
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            minSize: 10000,
            maxSize: 250000,
          },
          runtimeChunk: true,
        };

        // Add compression plugin
        webpackConfig.plugins.push(
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
          })
        );

        // Add bundle analyzer in analyze mode
        if (process.env.ANALYZE) {
          webpackConfig.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              reportFilename: 'bundle-report.html',
            })
          );
        }
      }

      return webpackConfig;
    },
  },
  babel: {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          loose: true,
        },
      ],
    ],
  },
  style: {
    postcss: {
      plugins: [require('autoprefixer')],
    },
  },
};
