const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
    return {
        entry: "./js/main.js",

        output: {
            filename: "phoneBook.js",
            path: path.resolve(__dirname, "../public"),
            publicPath: ""
        },

        devServer: {
            hot: true,
            open: true,
            inline: true,
            proxy: {
                "/api": "http://localhost:3000"
            }
        },

        devtool: "source-map",

        target: argv.mode === "development" ? "web" : "es5",

        resolve: {
            alias: {
                "vue$": "vue/dist/vue.runtime.esm.js"
            }
        },

        module: {
            rules: [{
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }, {
                test: /\.(png|jpg|gif|svg|ttf|eot|woff|woff2)$/,
                use: "file-loader?name=[path][name].[ext]?[contenthash]"
            }, {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }, {
                test: /\.vue$/,
                use: "vue-loader"
            }]
        },

        plugins: [
            new CleanWebpackPlugin(),

            new MiniCssExtractPlugin({
                filename: "styles.css"
            }),

            new VueLoaderPlugin(),

            new HtmlWebpackPlugin({
                title: "Телефонная книга",
                template: "./html/index.html"
            })
        ]
    }
};