module.exports = {
  "presets": [
    ["@babel/env"]
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "corejs": 3
    }]
  ],
  "env": {
    "test": {
      "presets": [
        [
          "@babel/env", {
            "modules": "commonjs",
            "targets": {
              "node": "current"
            }
          }
        ]
      ]
    }
  }
}