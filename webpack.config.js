module.exports = {
    entry: './main.js', // Specify the entry point
    output: {
        filename: 'bundle.js', // Name of the output bundle
        path: __dirname + '/dist2' // Output directory (create 'dist' folder if it doesn't exist)
    }
};