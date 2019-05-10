
# Camunda script editor plugin
[CodeMirror](https://codemirror.net/) script editor for Camunda modeler.
## Example
<img src="https://github.com/igorsimko/camunda-script-editor-plugin/blob/master/example.png" width="450" height="400" />

## Building the Application

```sh
# checkout a tag
git checkout v1.0.0

# install dependencies
npm install

# build the application to ./client
npm run bundle
```

## Custom CodeMirror config
You can implement custom CodeMirror configuration by changing next piece of code in [module.js](https://github.com/igorsimko/camunda-script-editor-plugin/blob/master/client/module.js). DO NOT remove or change **value** and **customId** properties!
```
var myCodeMirror = CodeMirror(function (elt) {
        myTextArea.parentNode.replaceChild(elt, myTextArea);
      }, {
          value: originalTA !== null ? originalTA.value : "",
          lineNumbers: true,
          mode: "groovy",
          customId: textAreaId,
          theme: "mdn-like",
          extraKeys: { "Ctrl-Space": "autocomplete" },
          hintOptions: { hint: "anyword" },
          matchBrackets: true,
          autoCloseBrackets: true,
          highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
        });
```
## License

MIT
CodeMirror
