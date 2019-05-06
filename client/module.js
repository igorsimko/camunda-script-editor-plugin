var cm = require("./lib/codemirror.js")
require("./lib/codemirror/groovy.js")
require("./addon/edit/matchbrackets.js")
require("./addon/hint/show-hint.js")
require("./addon/hint/anyword-hint.js")
require("./addon/edit/closebrackets.js")
require("./addon/dialog/dialog.js")
require("./addon/search/searchcursor.js")
require("./addon/search/search.js")
require("./addon/scroll/annotatescrollbar.js")
require("./addon/search/matchesonscrollbar.js")
require("./addon/search/jump-to-line.js")
require("./addon/selection/active-line.js")
require("./addon/search/match-highlighter.js")

/**
 * A bpmn-js extension service, providing the actual
 * plug-in feature.
 */
function PluginService(eventBus, canvas) {

  let nextId = 1;
  let observers = [];

  eventBus.on('propertiesPanel.attach', function (event) {
    setTimeout(assignOnClick, 50)
    setTimeout(assignOnElementShow, 50)
  });

  eventBus.on('element.click', function (event) {
    initCodeEditor()
    setTimeout(assignOnClick, 50)
    setTimeout(assignOnElementShow, 50)
  });

  function assignOnClick() {
    document.querySelectorAll('.bpp-properties-tab-link > a').forEach(e => {
      e.onclick = function () {
        setTimeout(initCodeEditor, 50);
      }
    });
    document.querySelectorAll('#cam-script-type').forEach(e => {
      e.onchange = function () {
        if (e.value == "script") {
          setTimeout(initCodeEditor, 50);
        }
      }
    });
  }

  function assignOnElementShow() {
    var elements = document.querySelectorAll('div[data-show="script.isScript"], div[data-show="isScript"]')
    if (elements) {
      removeObservers();
      elements.forEach(element => addObserver(element))
    }
  }

  function removeEditor() {
    [...document.getElementsByClassName("CodeMirror")].map(n => n && n.remove());
    [...document.getElementsByClassName("plugin-editor")].map(n => n && n.remove());
    [...document.getElementsByClassName("native-editor")].map(n => n && n.remove());
  }

  function removeObservers() {
    for (var i in observers) {
      var observer = observers.pop();
      if (observer) {
        observer.disconnect();
      }
    }
  }

  function addObserver(element) {
    var observer = new MutationObserver(function (mutations) {

      mutations.forEach(function (mutation) {
        if ((mutation.type === "attributes") && (mutation.attributeName === "class")) {
          if (mutation.target !== null && mutation.target.className === "") {
            setTimeout(initCodeEditor, 100);
            removeObservers();
          }
        }
      })
    });

    observer.observe(element, {
      attributes: true,
      childList: true,
      characterData: true,
      characterDataOldValue: true
    })
    observers.push(observer);
  }

  function getId() {
    return nextId++;
  }

  function initCodeEditor() {
    nextId = 1;
    removeEditor();
    [...document.getElementsByClassName("native-editor")].map(n => n && n.remove());

    document.querySelectorAll('#cam-script-val').forEach(originalTA => {

      if (originalTA === undefined || originalTA.attributes === undefined) {
        return
      }

      var myTextArea = document.createElement('textarea')
      myTextArea.setAttribute('id', 'myTextArea-' + textAreaId)
      myTextArea.setAttribute('class', 'custom-textarea')
      myTextArea.setAttribute('style', 'display:block')

      var textAreaId = getId();

      originalTA.setAttribute('custom-id', textAreaId)
      originalTA.setAttribute("style", "display:none")

      originalTA.parentNode.insertBefore(myTextArea, originalTA)

      console.log(textAreaId)
      console.log(observers.length)

      cm.commands.autocomplete = function (cm) {
        cm.showHint({ hint: cm.hint.anyword });
      }

      var myCodeMirror = cm(function (elt) {
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

      myCodeMirror.on('change', function (cMirror) {
        // get value right from instance
        document.querySelector('#cam-script-val[custom-id="' + cMirror.options.customId + '"]').value = cMirror.getValue();
        document.querySelector('#cam-script-val[custom-id="' + cMirror.options.customId + '"]').click()
      });
    });

  }
}



PluginService.$inject = ['eventBus', 'canvas'];


/**
 * The service and it's dependencies, exposed as a bpmn-js module.
 *
 * --------
 *
 * WARNING: This is an example plug-in.
 *
 * Make sure you rename the plugin and the name it is exposed (PLEASE_CHANGE_ME)
 * to something unique.
 *
 * --------
 *
 */
export default {
  __init__: ['CAMUNDA_SCRIPT_EDITOR'],
  CAMUNDA_SCRIPT_EDITOR: ['type', PluginService]
};
