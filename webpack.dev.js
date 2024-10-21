// const webpack = require('webpack');
// const path = require('path');
// const { merge } = require('webpack-merge');
// const common = require('./webpack.common.js');

// const port = 3000;
// let publicUrl = `ws://localhost:${port}/ws`;

// if (process.env.GITPOD_WORKSPACE_URL) {
//   const [, host] = process.env.GITPOD_WORKSPACE_URL.split('://');
//   publicUrl = `wss://${port}-${host}/ws`;
// } else if (process.env.CODESPACE_NAME) {
//   publicUrl = `wss://${process.env.CODESPACE_NAME}-${port}.app.github.dev/ws`;
// }

// module.exports = merge(common, {
//   mode: 'development',
//   devtool: 'cheap-module-source-map',
//   devServer: {
//     port,
//     hot: true,
//     allowedHosts: "all",
//     historyApiFallback: true,
//     static: {
//       directory: path.resolve(__dirname, "dist"),
//     },
//     client: {
//       webSocketURL: publicUrl
//     },
//   },
//   plugins: [
//     new webpack.HotModuleReplacementPlugin()
//   ]
// });
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// For any other routes, serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});