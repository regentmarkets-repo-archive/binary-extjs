

/* =============================== globals.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/**
 * @namespace The global gadgets namespace
 * @type {Object}
 */
gadgets = window['gadgets'] || {};

/**
 * @namespace The global shindig namespace, used for shindig specific extensions and data
 * @type {Object}
 */
shindig = window['shindig'] || {};

/**
 * @namespace The global osapi namespace, used for opensocial API specific extensions
 * @type {Object}
 */
osapi = window['osapi'] || {};




/* =============================== taming.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/**
 * @namespace The global safeJSON namespace
 * @type {Object}
 */
var safeJSON = window['safeJSON'];

/**
 * @namespace The global tamings___ namespace
 * @type {Array.<Function>}
 */
var tamings___ = window['tamings___'] || [];

/**
 * @namespace The global bridge___ namespace
 * @type {Object}
 */
var bridge___;

/**
 * @namespace The global caja___ namespace
 * @type {Object}
 */
var caja___ = window['caja___'];

/**
 * @namespace The global ___ namespace
 * @type {Object}
 */
var ___ = window['___'];




/* =============================== constants.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// Based on <http://www.w3.org/TR/2000/ REC-DOM-Level-2-Core-20001113/
// core.html#ID-1950641247>.
var DOM_ELEMENT_NODE = 1;
var DOM_ATTRIBUTE_NODE = 2;
var DOM_TEXT_NODE = 3;
var DOM_CDATA_SECTION_NODE = 4;
var DOM_ENTITY_REFERENCE_NODE = 5;
var DOM_ENTITY_NODE = 6;
var DOM_PROCESSING_INSTRUCTION_NODE = 7;
var DOM_COMMENT_NODE = 8;
var DOM_DOCUMENT_NODE = 9;
var DOM_DOCUMENT_TYPE_NODE = 10;
var DOM_DOCUMENT_FRAGMENT_NODE = 11;
var DOM_NOTATION_NODE = 12;



/* =============================== config.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview Provides unified configuration for all features.
 *
 *
 * <p>This is a custom shindig library that has not yet been submitted for
 * standardization. It is designed to make developing of features for the
 * opensocial / gadgets platforms easier and is intended as a supplemental
 * tool to Shindig's standardized feature loading mechanism.
 *
 * <p>Usage:
 * First, you must register a component that needs configuration:
 * <pre>
 *   var config = {
 *     name : gadgets.config.NonEmptyStringValidator,
 *     url : new gadgets.config.RegExValidator(/.+%mySpecialValue%.+/)
 *   };
 *   gadgets.config.register("my-feature", config, myCallback);
 * </pre>
 *
 * <p>This will register a component named "my-feature" that expects input config
 * containing a "name" field with a value that is a non-empty string, and a
 * "url" field with a value that matches the given regular expression.
 *
 * <p>When gadgets.config.init is invoked by the container, it will automatically
 * validate your registered configuration and will throw an exception if
 * the provided configuration does not match what was required.
 *
 * <p>Your callback will be invoked by passing all configuration data passed to
 * gadgets.config.init, which allows you to optionally inspect configuration
 * from other features, if present.
 *
 * <p>Note that the container may optionally bypass configuration validation for
 * performance reasons. This does not mean that you should duplicate validation
 * code, it simply means that validation will likely only be performed in debug
 * builds, and you should assume that production builds always have valid
 * configuration.
 */

if (!window['gadgets']['config']) {
gadgets.config = function() {
  var ___jsl;
  var components = {};
  var configuration = {};
  var initialized = false;

  function foldConfig(origConfig, updConfig) {
    for (var key in updConfig) {
      if (!updConfig.hasOwnProperty(key)) {
        continue;
      }
      if (typeof origConfig[key] === 'object' &&
          typeof updConfig[key] === 'object') {
        // Both have the same key with an object value. Recurse.
        foldConfig(origConfig[key], updConfig[key]);
      } else {
        // If updConfig has a new key, or a value of different type
        // than the original config for the same key, or isn't an object
        // type, then simply replace the value for the key.
        origConfig[key] = updConfig[key];
      }
    }
  }

  function getLoadingScript() {
    var jsPath = (configuration['core.io'] || {})['jsPath'] || null,
        candidates = [],
        n = 0;

    // Attempt to retrieve config augmentation from latest script node.
    var scripts = document.scripts || document.getElementsByTagName('script');
    if (!scripts || scripts.length == 0) {
      return candidates;
    }

    for (var i = 0; i < scripts.length; ++i) {
      var src = scripts[i].src,
          found = jsPath != null && src && src.indexOf(jsPath) || -1;
      if (found != -1 && /.*[.]js.*[?&]c=[01](#|&|$).*/.test(src.substring(found + jsPath.length))) {
        candidates[n++] = scripts[i];
      }
    }
    if (!candidates.length) {
      var tag = scripts[scripts.length - 1];
      if (tag.src) {
        candidates[0] = tag;
      }
    }
    return candidates;
  }

  function getInnerText(scriptNode) {
    var scriptText = '';
    if (scriptNode.nodeType == DOM_TEXT_NODE || scriptNode.nodeType == DOM_CDATA_SECTION_NODE) {
      scriptText = scriptNode.nodeValue;
    } else if (scriptNode.innerText) {
      scriptText = scriptNode.innerText;
    } else if (scriptNode.innerHTML) {
      scriptText = scriptNode.innerHTML;
    } else if (scriptNode.firstChild) {
      var content = [];
      for (var child = scriptNode.firstChild; child; child = child.nextSibling) {
        content.push(getInnerText(child));
      }
      scriptText = content.join('');
    }
    return scriptText;
  }

  function parseConfig(configText) {
    var config;
    try {
      config = (new Function('return (' + configText + '\n)'))();
    } catch (e) { }
    if (typeof config === 'object') {
      return config;
    }
    try {
      config = (new Function('return ({' + configText + '\n})'))();
    } catch (e) { }
    return typeof config === 'object' ? config : {};
  }

  function augmentConfig(baseConfig) {
    var scripts = getLoadingScript();
    if (!scripts.length) {
      return;
    }
    for (var i = 0; i < scripts.length; i++) {
      var scriptText = getInnerText(scripts[i]);
      var configAugment = parseConfig(scriptText);
      if (___jsl['f'] && ___jsl['f'].length == 1) {
        // Single-feature load on current request.
        // Augmentation adds to just this feature's config if
        // "short-form" syntax is used ie. skipping top-level feature key.
        var feature = ___jsl['f'][0];
        if (!configAugment[feature]) {
          var newConfig = {};
          newConfig[___jsl['f'][0]] = configAugment;
          configAugment = newConfig;
        }
      }
      foldConfig(baseConfig, configAugment);

      var globalConfig = window['___cfg'];
      if (globalConfig) {
        foldConfig(baseConfig, globalConfig);
      }
    }
  }

  /**
   * Iterates through all registered components.
   * @param {function(string,Object)} processor The processor method.
   */
  function forAllComponents(processor) {
    for (var name in components) {
      if (components.hasOwnProperty(name)) {
        var componentList = components[name];
        for (var i = 0, j = componentList.length; i < j; ++i) {
          processor(name, componentList[i]);
        }
      }
    }
  }

  return {
    /**
     * Registers a configurable component and its configuration parameters.
     * Multiple callbacks may be registered for a single component if needed.
     *
     * @param {string} component The name of the component to register. Should
     *     be the same as the fully qualified name of the <Require> feature or
     *     the name of a fully qualified javascript object reference
     *     (e.g. "gadgets.io").
     * @param {Object=} opt_validators Mapping of option name to validation
     *     functions that take the form function(data) {return isValid(data);}.
     * @param {function(Object)=} opt_callback A function to be invoked when a
     *     configuration is registered. If passed, this function will be invoked
     *     immediately after a call to init has been made. Do not assume that
     *     dependent libraries have been configured until after init is
     *     complete. If you rely on this, it is better to defer calling
     *     dependent libraries until you can be sure that configuration is
     *     complete. Takes the form function(config), where config will be
     *     all registered config data for all components. This allows your
     *     component to read configuration from other components.
     * @param {boolean=} opt_callOnUpdate Whether the callback shall be call
     *     on gadgets.config.update() as well.
     * @member gadgets.config
     * @name register
     * @function
     */
    register: function(component, opt_validators, opt_callback,
        opt_callOnUpdate) {
      var registered = components[component];
      if (!registered) {
        registered = [];
        components[component] = registered;
      }

      registered.push({
        validators: opt_validators || {},
        callback: opt_callback,
        callOnUpdate: opt_callOnUpdate
      });

      if (initialized && opt_callback) {
          opt_callback(configuration);
      }
    },

    /**
     * Retrieves configuration data on demand.
     *
     * @param {string=} opt_component The component to fetch. If not provided
     *     all configuration will be returned.
     * @return {Object} The requested configuration, or an empty object if no
     *     configuration has been registered for that component.
     * @member gadgets.config
     * @name get
     * @function
     */
    get: function(opt_component) {
      if (opt_component) {
        return configuration[opt_component] || {};
      }
      return configuration;
    },

    /**
     * Initializes the configuration.
     *
     * @param {Object} config The full set of configuration data.
     * @param {boolean=} opt_noValidation True if you want to skip validation.
     * @throws {Error} If there is a configuration error.
     * @member gadgets.config
     * @name init
     * @function
     */
    init: function(config, opt_noValidation) {
      ___jsl = window['___jsl'] || {};
      foldConfig(configuration, config);
      augmentConfig(configuration);
      var inlineOverride = window['___config'] || {};
      foldConfig(configuration, inlineOverride);
      forAllComponents(function(name, component) {
        var conf = configuration[name];
        if (conf && !opt_noValidation) {
          var validators = component.validators;
          for (var v in validators) {
            if (validators.hasOwnProperty(v)) {
              if (!validators[v](conf[v])) {
                throw new Error('Invalid config value "' + conf[v] +
                    '" for parameter "' + v + '" in component "' +
                    name + '"');
              }
            }
          }
        }

        if (component.callback) {
          component.callback(configuration);
        }
      });
      initialized = true;
    },

    /**
     * Method largely for dev and debugging purposes that
     * replaces or manually updates feature config.
     * @param {Object} updateConfig Config object, with keys for features.
     * @param {boolean} opt_replace true to replace all configuration.
     */
    update: function(updateConfig, opt_replace) {
      // Iterate before changing updateConfig and configuration.
      var callbacks = [];
      forAllComponents(function(name, component) {
        if (updateConfig.hasOwnProperty(name) ||
            (opt_replace && configuration && configuration[name])) {
          if (component.callback && component.callOnUpdate) {
            callbacks.push(component.callback);
          }
        }
      });
      configuration = opt_replace ? {} : configuration || {};
      foldConfig(configuration, updateConfig);
      for (var i = 0, j = callbacks.length; i < j; ++i) {
        callbacks[i](configuration);
      }
    },

    /**
     * For testing
     */
    clear: function() {
      gadgets.warn('This method is for testing.');
      var undef;
      ___jsl = undef;
      configuration = {};
      initialized = false;
    }
  };
}();
} // ! end double inclusion guard




/* =============================== log.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview Support for basic logging capability for gadgets.
 *
 * This functionality replaces alert(msg) and window.console.log(msg).
 *
 * <p>Currently only works on browsers with a console (WebKit based browsers,
 * Firefox with Firebug extension, or Opera).
 *
 * <p>API is designed to be equivalent to existing console.log | warn | error
 * logging APIs supported by Firebug and WebKit based browsers. The only
 * addition is the ability to call gadgets.setLogLevel().
 */

/**
 * @static
 * @namespace Support for basic logging capability for gadgets.
 * @name gadgets.log
 */

gadgets.log = (function() {
  /** @const */
  var info_ = 1;
  /** @const */
  var warning_ = 2;
  /** @const */
  var error_ = 3;
  /** @const */
  var none_ = 4;

/**
 * Log an informational message
 * @param {Object} message - the message to log.
 * @member gadgets
  * @name log
  * @function
  */
  var log = function(message) {
    logAtLevel(info_, message);
  };

  /**
 * Log a warning
 * @param {Object} message - the message to log.
 * @static
 */
  gadgets.warn = function(message) {
    logAtLevel(warning_, message);
  };

  /**
 * Log an error
 * @param {Object} message - The message to log.
 * @static
 */
  gadgets.error = function(message) {
    logAtLevel(error_, message);
  };

  /**
 * Sets the log level threshold.
 * @param {number} logLevel - New log level threshold.
 * @static
 * @member gadgets.log
 * @name setLogLevel
 */
  gadgets.setLogLevel = function(logLevel) {
    logLevelThreshold_ = logLevel;
  };

  /**
 * Logs a log message if output console is available, and log threshold is met.
 * @param {number} level - the level to log with. Optional, defaults to gadgets.log.INFO.
 * @param {Object} message - The message to log.
 * @private
 */
  function logAtLevel(level, message) {
    if(typeof _console === 'undefined') {
      //Purposely set to null if there is no console that way we don't come
      //back in here
      _console = window.console ? window.console :
        window.opera ? window.opera.postError : null;
    }
    if (level < logLevelThreshold_ || !_console) {
      return;
    }

    if (level === warning_ && _console.warn) {
      _console.warn(message);
    } else if (level === error_ && _console.error) {
      _console.error(message);
    } else if (_console.log) {
      _console.log(message);
    }
  };

  /**
 * Log level for informational logging.
 * @static
 * @const
 * @member gadgets.log
 * @name INFO
 */
  log['INFO'] = info_;

  /**
 * Log level for warning logging.
 * @static
 * @const
 * @member gadgets.log
 * @name WARNING
 */
  log['WARNING'] = warning_;

  /**
 * Log level for no logging
 * @static
 * @const
 * @member gadgets.log
 * @name NONE
 */
  log['NONE'] = none_;

  /**
 * Current log level threshold.
 * @type {number}
 * @private
 */
  var logLevelThreshold_ = info_;



  /**
 * Console to log to
 * @private
 * @static
 */
  var _console;

  return log;
})();




/* =============================== taming.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @class
 * Tame and expose core gadgets.* API to cajoled gadgets
 */
tamings___.push(function(imports) {
  caja___.whitelistFuncs([
    [gadgets, 'log'],
    [gadgets, 'warn'],
    [gadgets, 'error'],
    [gadgets, 'setLogLevel']
  ]);
  caja___.whitelistProps([
    [gadgets.log, 'INFO'],
    [gadgets.log, 'WARNING'],
    [gadgets.log, 'ERROR'],
    [gadgets.log, 'NONE']
  ]);
});




/* =============================== urlparams.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview General purpose utilities that gadgets can use.
 */


/**
 * @class Provides a thin method for parsing url parameters.
 */
gadgets.util = gadgets.util || {};

(function() {
  var parameters = null;

  /**
   * Parses URL parameters into an object.
   * @param {string} url - the url parameters to parse.
   * @return {Array.<string>} The parameters as an array.
   */
  function parseUrlParams(url) {
    // Get settings from url, 'hash' takes precedence over 'search' component
    // don't use document.location.hash due to browser differences.
    var query;
    var queryIdx = url.indexOf('?');
    var hashIdx = url.indexOf('#');
    if (hashIdx === -1) {
      query = url.substr(queryIdx + 1);
    } else {
      // essentially replaces "#" with "&"
      query = [url.substr(queryIdx + 1, hashIdx - queryIdx - 1), '&',
               url.substr(hashIdx + 1)].join('');
    }
    return query.split('&');
  }

  /**
   * Gets the URL parameters.
   *
   * @param {string=} opt_url Optional URL whose parameters to parse.
   *                         Defaults to window's current URL.
   * @return {Object} Parameters passed into the query string.
   * @private Implementation detail.
   */
  gadgets.util.getUrlParameters = function(opt_url) {
    var no_opt_url = typeof opt_url === 'undefined';
    if (parameters !== null && no_opt_url) {
      // "parameters" is a cache of current window params only.
      return parameters;
    }
    var parsed = {};
    var pairs = parseUrlParams(opt_url || document.location.href);
    var unesc = window.decodeURIComponent ? decodeURIComponent : unescape;
    for (var i = 0, j = pairs.length; i < j; ++i) {
      var pos = pairs[i].indexOf('=');
      if (pos === -1) {
        continue;
      }
      var argName = pairs[i].substring(0, pos);
      var value = pairs[i].substring(pos + 1);
      // difference to IG_Prefs, is that args doesn't replace spaces in
      // argname. Unclear on if it should do:
      // argname = argname.replace(/\+/g, " ");
      value = value.replace(/\+/g, ' ');
      try {
        parsed[argName] = unesc(value);
      } catch (e) {
        // Undecodable/invalid value; ignore.
      }
    }
    if (no_opt_url) {
      // Cache current-window params in parameters var.
      parameters = parsed;
    }
    return parsed;
  };
})();

// Initialize url parameters so that hash data is pulled in before it can be
// altered by a click.
gadgets.util.getUrlParameters();




/* =============================== taming.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @class
 * Tame and expose core gadgets.* API to cajoled gadgets
 */
tamings___.push(function(imports) {
  caja___.whitelistFuncs([
    [gadgets.util, 'getUrlParameters']
  ]);
});




/* =============================== validators.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Defines default validators in a separate file from the rest of the config
// system, to enable its separability from these.

(function() {
  /**
    * Ensures that data is one of a fixed set of items.
    * Also supports argument sytax: EnumValidator("Dog", "Cat", "Fish");
    *
    * @param {Array.<string>} list The list of valid values.
    */
  gadgets.config.EnumValidator = function(list) {
    var listItems = [];
    if (arguments.length > 1) {
      for (var i = 0, arg; (arg = arguments[i]); ++i) {
        listItems.push(arg);
      }
    } else {
      listItems = list;
    }
    return function(data) {
      for (var i = 0, test; (test = listItems[i]); ++i) {
        if (data === listItems[i]) {
          return true;
        }
      }
      return false;
    };
  };

  /**
   * Tests the value against a regular expression.
   * @member gadgets.config
   */
  gadgets.config.RegExValidator = function(re) {
    return function(data) {
      return re.test(data);
    };
  };

  /**
   * Validates that a value was provided.
   * @param {*} data
   */
  gadgets.config.ExistsValidator = function(data) {
    return typeof data !== 'undefined';
  };

  /**
   * Validates that a value is a non-empty string.
   * @param {*} data
   */
  gadgets.config.NonEmptyStringValidator = function(data) {
    return typeof data === 'string' && data.length > 0;
  };

  /**
   * Validates that the value is a boolean.
   * @param {*} data
   */
  gadgets.config.BooleanValidator = function(data) {
    return typeof data === 'boolean';
  };

  /**
   * Similar to the ECMAScript 4 virtual typing system, ensures that
   * whatever object was passed in is "like" the existing object.
   * Doesn't actually do type validation though, but instead relies
   * on other validators.
   *
   * This can be used recursively as well to validate sub-objects.
   *
   * @example
   *
   *  var validator = new gadgets.config.LikeValidator(
   *    "booleanField" : gadgets.config.BooleanValidator,
   *    "regexField" : new gadgets.config.RegExValidator(/foo.+/);
   *  );
   *
   *
   * @param {Object} test The object to test against.
   */
  gadgets.config.LikeValidator = function(test) {
    return function(data) {
      for (var member in test) {
        if (test.hasOwnProperty(member)) {
          var t = test[member];
          if (!t(data[member])) {
            return false;
          }
        }
      }
      return true;
    };
  };
})();




/* =============================== base.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview General purpose utilities that gadgets can use.
 */


/**
 * @class Provides general-purpose utility functions.
 */
gadgets.util = gadgets.util || {};


/**
 * Creates a closure that is suitable for passing as a callback.
 * Any number of arguments
 * may be passed to the callback;
 * they will be received in the order they are passed in.
 *
 * @param {Object} scope The execution scope; may be null if there is no
 *     need to associate a specific instance of an object with this
 *     callback.
 * @param {function(Object,Object)} callback The callback to invoke when
 *     this is run; any arguments passed in will be passed after your initial
 *     arguments.
 * @param {Object} var_args Initial arguments to be passed to the callback.
 * @return {function()} a callback function.
 */
gadgets.util.makeClosure = function(scope, callback, var_args) {
  // arguments isn't a real array, so we copy it into one.
  var baseArgs = [];
  for (var i = 2, j = arguments.length; i < j; ++i) {
    baseArgs.push(arguments[i]);
  }
  return function() {
    // append new arguments.
    var tmpArgs = baseArgs.slice();
    for (var i = 0, j = arguments.length; i < j; ++i) {
      tmpArgs.push(arguments[i]);
    }
    return callback.apply(scope, tmpArgs);
  };
};


/**
 * Utility function for generating an "enum" from an array.
 *
 * @param {Array.<string>} values The values to generate.
 * @return {Object.<string,string>} An object with member fields to handle
 *   the enum.
 */
gadgets.util.makeEnum = function(values) {
  var i, v, obj = {};
  for (i = 0; (v = values[i]); ++i) {
    obj[v] = v;
  }
  return obj;
};

/**
 * Check if need to poll for Ajax ready state change to avoid browsers memory leak.
 * The default implementation will check for IE7 browsers.
 *
 * @return true if we need to add polling to handle ready state change and false otherwise.
 */
gadgets.util.shouldPollXhrReadyStateChange = function() {
  if (document.all && !document.querySelector) {
    return true;
  }
  return false;
}




/* =============================== taming.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @class
 * Tame and expose core gadgets.* API to cajoled gadgets
 */
tamings___.push(function(imports) {
  caja___.whitelistFuncs([
    [gadgets.util, 'makeClosure'],
    [gadgets.util, 'makeEnum'],
    [gadgets.util, 'shouldPollXhrReadyStateChange']
  ]);
});




/* =============================== dom.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview General purpose utilities that gadgets can use.
 */


/**
 * @class Provides general-purpose utility functions.
 */
gadgets.util = gadgets.util || {};

(function() {

  var XHTML_SPEC = 'http://www.w3.org/1999/xhtml';

  function attachAttributes(elem, opt_attribs) {
    var attribs = opt_attribs || {};
    for (var attrib in attribs) {
      if (attribs.hasOwnProperty(attrib)) {
        elem[attrib] = attribs[attrib];
      }
    }
  }

  function stringifyElement(tagName, opt_attribs) {
    var arr = ['<', tagName];
    var attribs = opt_attribs || {};
    for (var attrib in attribs) {
      if (attribs.hasOwnProperty(attrib)) {
        arr.push(' ');
        arr.push(attrib);
        arr.push('="');
        arr.push(gadgets.util.escapeString(attribs[attrib]));
        arr.push('"');
      }
    }
    arr.push('></');
    arr.push(tagName);
    arr.push('>');
    return arr.join('');
  }

  /**
   * Creates an HTML or XHTML element.
   * @param {string} tagName The type of element to construct.
   * @return {Element} The newly constructed element.
   */
  gadgets.util.createElement = function(tagName) {
    var element;
    if ((!document.body) || document.body.namespaceURI) {
      try {
        element = document.createElementNS(XHTML_SPEC, tagName);
      } catch (nonXmlDomException) {
      }
    }
    return element || document.createElement(tagName);
  };

  /**
   * Creates an HTML or XHTML iframe element with attributes.
   * @param {Object=} opt_attribs Optional set of attributes to attach. The
   * only working attributes are spelled the same way in XHTML attribute
   * naming (most strict, all-lower-case), HTML attribute naming (less strict,
   * case-insensitive), and JavaScript property naming (some properties named
   * incompatibly with XHTML/HTML).
   * @return {Element} The DOM node representing body.
   */
  gadgets.util.createIframeElement = function(opt_attribs) {
    var frame = gadgets.util.createElement('iframe');
    try {
      // TODO: provide automatic mapping to only set the needed
      // and JS-HTML-XHTML compatible subset through stringifyElement (just
      // 'name' and 'id', AFAIK). The values of the attributes will be
      // stringified should the stringifyElement code path be taken (IE)
      var tagString = stringifyElement('iframe', opt_attribs);
      var ieFrame = gadgets.util.createElement(tagString);
      if (ieFrame &&
          ((!frame) ||
           ((ieFrame.tagName == frame.tagName) &&
            (ieFrame.namespaceURI == frame.namespaceURI)))) {
        frame = ieFrame;
      }
    } catch (nonStandardCallFailed) {
    }
    attachAttributes(frame, opt_attribs);
    return frame;
  };

  /**
   * Gets the HTML or XHTML body element.
   * @return {Element} The DOM node representing body.
   */
  gadgets.util.getBodyElement = function() {
    if (document.body) {
      return document.body;
    }
    try {
      var xbodies = document.getElementsByTagNameNS(XHTML_SPEC, 'body');
      if (xbodies && (xbodies.length == 1)) {
        return xbodies[0];
      }
    } catch (nonXmlDomException) {
    }
    return document.documentElement || document;
  };

})();




/* =============================== event.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview General purpose utilities that gadgets can use.
 */

gadgets.util = gadgets.util || {};

/**
 * Attach an event listener to given DOM element (Not a gadget standard)
 *
 * @param {Object} elem  DOM element on which to attach event.
 * @param {string} eventName  Event type to listen for.
 * @param {function()} callback  Invoked when specified event occurs.
 * @param {boolean} useCapture  If true, initiates capture.
 */
gadgets.util.attachBrowserEvent = function(elem, eventName, callback, useCapture) {
  if (typeof elem.addEventListener != 'undefined') {
    elem.addEventListener(eventName, callback, useCapture);
  } else if (typeof elem.attachEvent != 'undefined') {
    elem.attachEvent('on' + eventName, callback);
  } else {
    gadgets.warn('cannot attachBrowserEvent: ' + eventName);
  }
};

/**
 * Remove event listener. (Shindig internal implementation only)
 *
 * @param {Object} elem  DOM element from which to remove event.
 * @param {string} eventName  Event type to remove.
 * @param {function()} callback  Listener to remove.
 * @param {boolean} useCapture  Specifies whether listener being removed was added with
 *                              capture enabled.
 */
gadgets.util.removeBrowserEvent = function(elem, eventName, callback, useCapture) {
  if (elem.removeEventListener) {
    elem.removeEventListener(eventName, callback, useCapture);
  } else if (elem.detachEvent) {
    elem.detachEvent('on' + eventName, callback);
  } else {
    gadgets.warn('cannot removeBrowserEvent: ' + eventName);
  }
};





/* =============================== onload.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview General purpose utilities that gadgets can use.
 */


/**
 * @class Provides general-purpose utility functions for onload.
 */
gadgets.util = gadgets.util || {};

(function() {

  var onLoadHandlers = [];

  /**
   * Registers an onload handler.
   * @param {function()} callback The handler to run.
   */
  gadgets.util.registerOnLoadHandler = function(callback) {
    onLoadHandlers.push(callback);
  };

  /**
   * Runs all functions registered via registerOnLoadHandler.
   * @private Only to be used by the container, not gadgets.
   */
  gadgets.util.runOnLoadHandlers = function() {
    gadgets.util.registerOnLoadHandler = function(cb) {
      cb();
    };

    if (onLoadHandlers) {
      for (var i = 0, j = onLoadHandlers.length; i < j; ++i) {
        try {
          onLoadHandlers[i]();
        } catch (ex) {
          gadgets.warn("Could not fire onloadhandler "+ ex.message);
        }
      }
      onLoadHandlers = undefined;  // No need to hold these references anymore.
    }
  };

  (function() {
    // If a script is statically inserted into the dom, use events
    // to call runOnLoadHandlers.
    // Try to attach to DOMContentLoaded if using a modern browser.
    gadgets.util.attachBrowserEvent(document,
            "DOMContentLoaded",
            gadgets.util.runOnLoadHandlers,
            false);
    // Always attach to window.onload as a fallback. We can safely ignore
    // any repeated calls to runOnLoadHandlers.
    var oldWindowOnload = window.onload;
    window.onload = function() {
      oldWindowOnload && oldWindowOnload();
      gadgets.util.runOnLoadHandlers();
    };
    // If a script is dynamically inserted into the page, the DOMContentLoaded
    // event will be fired before runOnLoadHandlers can be attached
    // to the event. In this case, find the script that loads the core libary
    // and attach runOnLoadHandlers to the script's onload event.
    var libParam = "";
    if (window && window.location && window.location.href) {
      libParam = gadgets.util.getUrlParameters(window.location.href).libs;
    }

    var regex = /(?:js\/)([^&|\.]+)/g;
    var match = regex.exec(libParam);

    if (match) {
      var url = decodeURIComponent(match[1]);
      var scripts = document.getElementsByTagName("script") || [];
      for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        var src = script.src;
        if (src && url && src.indexOf(url) !== -1) {
          // save a reference to the function that is already hooked up
          // to the event
          var oldonload = script.onload;
          script.onload = function() {
            oldonload && oldonload();
            gadgets.util.runOnLoadHandlers();
          };
        }
      }
    }
  })();
})();





/* =============================== taming.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @class
 * Tame and expose core gadgets.* API to cajoled gadgets
 */
tamings___.push(function(imports) {
  caja___.whitelistFuncs([
    [gadgets.util, 'registerOnLoadHandler']
  ]);
});





/* =============================== string.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview General purpose utilities that gadgets can use.
 */


/**
 * @class Provides a thin method for parsing url parameters.
 */
gadgets.util = gadgets.util || {};

(function() {

  /**
   * @enum {boolean}
   * @const
   * @private
   * Maps code points to the value to replace them with.
   * If the value is "false", the character is removed entirely, otherwise
   * it will be replaced with an html entity.
   */
  var escapeCodePoints = {
    // nul; most browsers truncate because they use c strings under the covers.
    0 : false,
    // new line
    10 : true,
    // carriage return
    13 : true,
    // double quote
    34 : true,
    // single quote
    39 : true,
    // less than
    60 : true,
    // greater than
    62 : true,
    // backslash
    92 : true,
    // line separator
    8232 : true,
    // paragraph separator
    8233 : true,
    // fullwidth quotation mark
    65282 : true,
    // fullwidth apostrophe
    65287 : true,
    // fullwidth less-than sign
    65308 : true,
    // fullwidth greater-than sign
    65310 : true,
    // fullwidth reverse solidus
    65340 : true
  };

  /**
   * Regular expression callback that returns strings from unicode code points.
   *
   * @param {Array} match Ignored.
   * @param {number} value The codepoint value to convert.
   * @return {string} The character corresponding to value.
   */
  function unescapeEntity(match, value) {
    // TODO: b0rked for UTF-16 and can easily be convinced to generate
    // truncating NULs or completely invalid non-Unicode characters. Here's a
    // fixed version (it handles entities for valid codepoints from U+0001 ...
    // U+10FFFD, except for the non-character codepoints U+...FFFE and
    // U+...FFFF; isolated UTF-16 surrogate pairs are supported for
    // compatibility with previous versions of escapeString, 0 generates the
    // empty string rather than a possibly-truncating '\0', and all other inputs
    // generate U+FFFD (the replacement character, standard practice for
    // non-signalling Unicode codecs like this one)
    //     return (
    //         (value > 0) &&
    //         (value <= 0x10fffd) &&
    //         ((value & 0xffff) < 0xfffe)) ?
    //       ((value <= 0xffff) ?
    //         String.fromCharCode(value) :
    //         String.fromCharCode(
    //           ((value - 0x10000) >> 10) | 0xd800,
    //           ((value - 0x10000) & 0x3ff) | 0xdc00)) :
    //       ((value === 0) ? '' : '\ufffd');
    return String.fromCharCode(value);
  }

  /**
   * Escapes the input using html entities to make it safer.
   *
   * If the input is a string, uses gadgets.util.escapeString.
   * If it is an array, calls escape on each of the array elements
   * if it is an object, will only escape all the mapped keys and values if
   * the opt_escapeObjects flag is set. This operation involves creating an
   * entirely new object so only set the flag when the input is a simple
   * string to string map.
   * Otherwise, does not attempt to modify the input.
   *
   * @param {Object} input The object to escape.
   * @param {boolean=} opt_escapeObjects Whether to escape objects.
   * @return {Object} The escaped object.
   * @private Only to be used by the container, not gadgets.
   */
  gadgets.util.escape = function(input, opt_escapeObjects) {
    if (!input) {
      return input;
    } else if (typeof input === 'string') {
      return gadgets.util.escapeString(input);
    } else if (typeof input === 'array') {
      for (var i = 0, j = input.length; i < j; ++i) {
        input[i] = gadgets.util.escape(input[i]);
      }
    } else if (typeof input === 'object' && opt_escapeObjects) {
      var newObject = {};
      for (var field in input) {
        if (input.hasOwnProperty(field)) {
          newObject[gadgets.util.escapeString(field)] =
              gadgets.util.escape(input[field], true);
        }
      }
      return newObject;
    }
    return input;
  };

  /**
   * Escapes the input using html entities to make it safer.
   *
   * Currently not in the spec -- future proposals may change
   * how this is handled.
   *
   * @param {string} str The string to escape.
   * @return {string} The escaped string.
   */
  gadgets.util.escapeString = function(str) {
    if (!str) return str;
    var out = [], ch, shouldEscape;
    for (var i = 0, j = str.length; i < j; ++i) {
      ch = str.charCodeAt(i);
      shouldEscape = escapeCodePoints[ch];
      if (shouldEscape === true) {
        out.push('&#', ch, ';');
      } else if (shouldEscape !== false) {
        // undefined or null are OK.
        out.push(str.charAt(i));
      }
    }
    return out.join('');
  };

  /**
   * Reverses escapeString
   *
   * @param {string} str The string to unescape.
   * @return {string}
   */
  gadgets.util.unescapeString = function(str) {
    if (!str) return str;
    return str.replace(/&#([0-9]+);/g, unescapeEntity);
  };

})();




/* =============================== taming.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @class
 * Tame and expose core gadgets.* API to cajoled gadgets
 */
tamings___.push(function(imports) {
  caja___.whitelistFuncs([
    [gadgets.util, 'escape'],
    [gadgets.util, 'escapeString'],
    [gadgets.util, 'unescapeString']
  ]);
});




/* =============================== util.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview General purpose utilities that gadgets can use.
 */


/**
 * @class Provides general-purpose utility functions.
 */
gadgets.util = gadgets.util || {};

(function() {

  var features = {},
      services = {},
      undef,
      isDebug;

  /**
   * Checks injected feature script to see if it's debug mode.
   */
  function checkIsDebug(config) {
    var coreio = config['core.io'],
        jsPath = coreio && coreio.jsPath,
        scripts = document.getElementsByTagName('script');

    for (var i = 0; jsPath && i < scripts.length; i++) {
      var src = scripts[i].src;
      if (src && src.indexOf(jsPath) > -1) {
        return isDebug = gadgets.util.getUrlParameters(src).debug == '1';
      }
    }
    isDebug = false;
  }

  /**
   * Initializes feature parameters.
   */
  function init(config) {
    features = config['core.util'] || {};
  }

  if (gadgets.config) {
    gadgets.config.register('core.util', null, init);
    gadgets.config.register('core.io', undef, checkIsDebug, checkIsDebug);
  }

  /**
   * Gets the feature parameters.
   *
   * @param {string} feature The feature to get parameters for.
   * @return {Object} The parameters for the given feature, or null.
   */
  gadgets.util.getFeatureParameters = function(feature) {
    return typeof features[feature] === 'undefined' ? null : features[feature];
  };

  /**
   * Returns whether the current feature is supported.
   *
   * @param {string} feature The feature to test for.
   * @return {boolean} True if the feature is supported.
   */
  gadgets.util.hasFeature = function(feature) {
    return typeof features[feature] !== 'undefined';
  };

  /**
   * Returns the list of services supported by the server
   * serving this gadget.
   *
   * @return {Object} List of Services that enumerate their methods.
   */
  gadgets.util.getServices = function() {
    return services;
  };

  /**
   * @return {boolean} If gadget is being rendered in debug mode.
   */
  gadgets.util.isDebug = function() {
    return isDebug;
  };
})();




/* =============================== taming.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @class
 * Tame and expose core gadgets.* API to cajoled gadgets
 */
tamings___.push(function(imports) {
  caja___.whitelistFuncs([
    [gadgets.util, 'getFeatureParameters'],
    [gadgets.util, 'hasFeature']
  ]);
});




/* =============================== json-native.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview
 * The global object gadgets.json contains two methods.
 *
 * gadgets.json.stringify(value) takes a JavaScript value and produces a JSON
 * text. The value must not be cyclical.
 *
 * gadgets.json.parse(text) takes a JSON text and produces a JavaScript value.
 * It will return false if there is an error.
 */

/**
 * @static
 * @class Provides operations for translating objects to and from JSON.
 * @name gadgets.json
 */

/**
 * Just wrap native JSON calls when available.
 */
if (window.JSON && window.JSON.parse && window.JSON.stringify) {
  // HTML5 implementation, or already defined.
  // Not a direct alias as the opensocial specification disagrees with the HTML5 JSON spec.
  // JSON says to throw on parse errors and to support filtering functions. OS does not.
  gadgets.json = (function() {
    var endsWith___ = /___$/;

    function getOrigValue(key, value) {
      var origValue = this[key];
      return origValue;
    }

    return {
      /* documented below */
      parse: function(str) {
        try {
          return window.JSON.parse(str);
        } catch (e) {
          return false;
        }
      },
      /* documented below */
      stringify: function(obj) {
        var orig = window.JSON.stringify;
        function patchedStringify(val) {
          return orig.call(this, val, getOrigValue);
        }
        var stringifyFn = (Array.prototype.toJSON && orig([{x:1}]) === "\"[{\\\"x\\\": 1}]\"") ?
            patchedStringify : orig;
        try {
          return stringifyFn(obj, function(k,v) {
            return !endsWith___.test(k) ? v : void 0;
          });
        } catch (e) {
          return null;
        }
      }
    };
  })();
}




/* =============================== json-jsimpl.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview
 * The global object gadgets.json contains two methods.
 *
 * gadgets.json.stringify(value) takes a JavaScript value and produces a JSON
 * text. The value must not be cyclical.
 *
 * gadgets.json.parse(text) takes a JSON text and produces a JavaScript value.
 * It will return false if there is an error.
 */

/**
 * @static
 * @class Provides operations for translating objects to and from JSON.
 * @name gadgets.json
 */

/**
 * JavaScript-based implementation when window.JSON is not present.
 * Port of the public domain JSON library by Douglas Crockford.
 * See: http://www.json.org/json2.js
 */
if (!(window.JSON && window.JSON.parse && window.JSON.stringify)) {
  /**
   * Port of the public domain JSON library by Douglas Crockford.
   * See: http://www.json.org/json2.js
   */
  gadgets.json = function() {

    /**
     * Formats integers to 2 digits.
     * @param {number} n number to format.
     * @return {string} the formatted number.
     * @private
     */
    function f(n) {
      return n < 10 ? '0' + n : n;
    }

    Date.prototype.toJSON = function() {
      return [this.getUTCFullYear(), '-',
        f(this.getUTCMonth() + 1), '-',
        f(this.getUTCDate()), 'T',
        f(this.getUTCHours()), ':',
        f(this.getUTCMinutes()), ':',
        f(this.getUTCSeconds()), 'Z'].join('');
    };

    // table of character substitutions
    /**
     * @const
     * @enum {string}
     */
    var m = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"' : '\\"',
      '\\': '\\\\'
    };

    /**
     * Converts a json object into a string.
     * @param {*} value
     * @return {string}
     * @member gadgets.json
     */
    function stringify(value) {
      var a,          // The array holding the partial texts.
          i,          // The loop counter.
          k,          // The member key.
          l,          // Length.
          r = /[\"\\\x00-\x1f\x7f-\x9f]/g,
          v;          // The member value.

      switch (typeof value) {
        case 'string':
          // If the string contains no control characters, no quote characters, and no
          // backslash characters, then we can safely slap some quotes around it.
          // Otherwise we must also replace the offending characters with safe ones.
          return r.test(value) ?
              '"' + value.replace(r, function(a) {
                var c = m[a];
                if (c) {
                  return c;
                }
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) +
                   (c % 16).toString(16);
              }) + '"' : '"' + value + '"';
        case 'number':
          // JSON numbers must be finite. Encode non-finite numbers as null.
          return isFinite(value) ? String(value) : 'null';
        case 'boolean':
        case 'null':
          return String(value);
        case 'object':
          // Due to a specification blunder in ECMAScript,
          // typeof null is 'object', so watch out for that case.
          if (!value) {
            return 'null';
          }
          // toJSON check removed; re-implement when it doesn't break other libs.
          a = [];
          if (typeof value.length === 'number' &&
              !value.propertyIsEnumerable('length')) {
            // The object is an array. Stringify every element. Use null as a
            // placeholder for non-JSON values.
            l = value.length;
            for (i = 0; i < l; i += 1) {
              a.push(stringify(value[i]) || 'null');
            }
            // Join all of the elements together and wrap them in brackets.
            return '[' + a.join(',') + ']';
          }
          // Otherwise, iterate through all of the keys in the object.
          for (k in value) {
            if (/___$/.test(k))
              continue;
            if (value.hasOwnProperty(k)) {
              if (typeof k === 'string') {
                v = stringify(value[k]);
                if (v) {
                  a.push(stringify(k) + ':' + v);
                }
              }
            }
          }
          // Join all of the member texts together and wrap them in braces.
          return '{' + a.join(',') + '}';
      }
      return '';
    }

    return {
      stringify: stringify,
      parse: function(text) {
        // Parsing happens in three stages. In the first stage, we run the text against
        // regular expressions that look for non-JSON patterns. We are especially
        // concerned with '()' and 'new' because they can cause invocation, and '='
        // because it can cause mutation. But just to be safe, we want to reject all
        // unexpected forms.

        // We split the first stage into 4 regexp operations in order to work around
        // crippling inefficiencies in IE's and Safari's regexp engines. First we
        // replace all backslash pairs with '@' (a non-JSON character). Second, we
        // replace all simple value tokens with ']' characters. Third, we delete all
        // open brackets that follow a colon or comma or that begin the text. Finally,
        // we look to see that the remaining characters are only whitespace or ']' or
        // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/b-u]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
          return eval('(' + text + ')');
        }
        // If the text is not JSON parseable, then return false.

        return false;
      }
    };
  }();
}




/* =============================== json-flatten.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Flatten an object to a stringified values. Useful for dealing with
 * json->querystring transformations. Note: not in official specification yet
 *
 * @param {Object} obj
 * @return {Object} object with only string values.
 */
gadgets.json.flatten = function(obj) {
  var flat = {};

  if (obj === null || typeof obj == 'undefined') return flat;

  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      var value = obj[k];
      if (null === value || typeof value == 'undefined') {
        continue;
      }
      flat[k] = (typeof value === 'string') ? value : gadgets.json.stringify(value);
    }
  }
  return flat;
};




/* =============================== taming.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @class
 * Tame and expose core gadgets.* API to cajoled gadgets
 */
tamings___.push(function(imports) {
  caja___.tamesTo(gadgets.json.stringify, caja___.getJSON().stringify);
  caja___.tamesTo(gadgets.json.parse, caja___.getJSON().parse);
});




/* =============================== prefs.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview
 *
 * Provides access to user prefs, module dimensions, and messages.
 *
 * <p>Clients can access their preferences by constructing an instance of
 * gadgets.Prefs and passing in their module id.  Example:
 *
 * <pre>
 *   var prefs = new gadgets.Prefs();
 *   var name = prefs.getString("name");
 *   var lang = prefs.getLang();
 * </pre>
 *
 * <p>Modules with type=url can also use this library to parse arguments passed
 * by URL, but this is not the common case:
 *
 *   &lt;script src="http://apache.org/shindig/prefs.js"&gt;&lt;/script&gt;
 *   &lt;script&gt;
 *   gadgets.Prefs.parseUrl();
 *   var prefs = new gadgets.Prefs();
 *   var name = prefs.getString("name");
 *   &lt;/script&gt;
 */

(function() {

  var instance = null;
  var prefs = {};
  var esc = gadgets.util.escapeString;
  var messages = {};
  var defaultPrefs = {};
  var language = 'en';
  var country = 'US';
  var moduleId = 0;

  /**
 * Parses all parameters from the url and stores them
 * for later use when creating a new gadgets.Prefs object.
 */
  function parseUrl() {
    var params = gadgets.util.getUrlParameters();
    for (var i in params) {
      if (params.hasOwnProperty(i)) {
        if (i.indexOf('up_') === 0 && i.length > 3) {
          prefs[i.substr(3)] = String(params[i]);
        } else if (i === 'country') {
          country = params[i];
        } else if (i === 'lang') {
          language = params[i];
        } else if (i === 'mid') {
          moduleId = params[i];
        }
      }
    }
  }

  /**
 * Sets default pref values for values left unspecified in the
 * rendering call, but with default_value provided in the spec.
 */
  function mergeDefaults() {
    for (var name in defaultPrefs) {
      if (typeof prefs[name] === 'undefined') {
        prefs[name] = defaultPrefs[name];
      }
    }
  }

  /**
 * @class
 * Provides access to user preferences, module dimensions, and messages.
 *
 * Clients can access their preferences by constructing an instance of
 * gadgets.Prefs and passing in their module id.  Example:
 *
<pre>var prefs = new gadgets.Prefs();
var name = prefs.getString("name");
var lang = prefs.getLang();</pre>
 *
 * Note: this is actually a singleton. All prefs are linked. If you're wondering
 * why this is a singleton and not just a collection of package functions, the
 * simple answer is that it's how the spec is written. The spec is written this
 * way for legacy compatibility with igoogle.
 */
  gadgets.Prefs = function() {
    if (!instance) {
      parseUrl();
      mergeDefaults();
      instance = this;
    }
    return instance;
  };

  /**
 * Sets internal values
 * @return {boolean} True if the prefs is modified.
 */
  gadgets.Prefs.setInternal_ = function(key, value) {
    var wasModified = false;
    if (typeof key === 'string') {
      if (!prefs.hasOwnProperty(key) || prefs[key] !== value) {
        wasModified = true;
      }
      prefs[key] = value;
    } else {
      for (var k in key) {
        if (key.hasOwnProperty(k)) {
          var v = key[k];
          if (!prefs.hasOwnProperty(k) || prefs[k] !== v) {
            wasModified = true;
          }
          prefs[k] = v;
        }
      }
    }
    return wasModified;
  };

  /**
 * Initializes message bundles.
 */
  gadgets.Prefs.setMessages_ = function(msgs) {
    messages = msgs;
  };

  /**
 * Initializes default user prefs values.
 */
  gadgets.Prefs.setDefaultPrefs_ = function(defprefs) {
    defaultPrefs = defprefs;
  };

  /**
 * Retrieves a preference as a string.
 * Returned value will be html entity escaped.
 *
 * @param {string} key The preference to fetch.
 * @return {string} The preference; if not set, an empty string.
 */
  gadgets.Prefs.prototype.getString = function(key) {
    if (key === '.lang') { key = 'lang'; }
    return prefs[key] ? esc(prefs[key]) : '';
  };

  /*
 * Indicates not to escape string values when retrieving them.
 * This is an internal detail used by _IG_Prefs for backward compatibility.
 */
  gadgets.Prefs.prototype.setDontEscape_ = function() {
    esc = function(k) { return k; };
  };

  /**
 * Retrieves a preference as an integer.
 * @param {string} key The preference to fetch.
 * @return {number} The preference; if not set, 0.
 */
  gadgets.Prefs.prototype.getInt = function(key) {
    var val = parseInt(prefs[key], 10);
    return isNaN(val) ? 0 : val;
  };

  /**
 * Retrieves a preference as a floating-point value.
 * @param {string} key The preference to fetch.
 * @return {number} The preference; if not set, 0.
 */
  gadgets.Prefs.prototype.getFloat = function(key) {
    var val = parseFloat(prefs[key]);
    return isNaN(val) ? 0 : val;
  };

  /**
 * Retrieves a preference as a boolean.
 * @param {string} key The preference to fetch.
 * @return {boolean} The preference; if not set, false.
 */
  gadgets.Prefs.prototype.getBool = function(key) {
    var val = prefs[key];
    if (val) {
      return val === 'true' || val === true || !!parseInt(val, 10);
    }
    return false;
  };

  /**
 * Stores a preference.
 * To use this call,
 * the gadget must require the feature setprefs.
 *
 * <p class="note">
 * <b>Note:</b>
 * If the gadget needs to store an Array it should use setArray instead of
 * this call.
 * </p>
 *
 * @param {string} key The pref to store.
 * @param {Object} val The values to store.
 */
  gadgets.Prefs.prototype.set = function(key, value) {
    throw new Error('setprefs feature required to make this call.');
  };

  /**
 * Retrieves a preference as an array.
 * UserPref values that were not declared as lists are treated as
 * one-element arrays.
 *
 * @param {string} key The preference to fetch.
 * @return {Array.<string>} The preference; if not set, an empty array.
 */
  gadgets.Prefs.prototype.getArray = function(key) {
    var val = prefs[key];
    if (val) {
      var arr = val.split('|');
      // Decode pipe characters.
      for (var i = 0, j = arr.length; i < j; ++i) {
        arr[i] = esc(arr[i].replace(/%7C/g, '|'));
      }
      return arr;
    }
    return [];
  };

  /**
 * Stores an array preference.
 * To use this call,
 * the gadget must require the feature setprefs.
 *
 * @param {string} key The pref to store.
 * @param {Array} val The values to store.
 */
  gadgets.Prefs.prototype.setArray = function(key, val) {
    throw new Error('setprefs feature required to make this call.');
  };

  /**
 * Fetches an unformatted message.
 * @param {string} key The message to fetch.
 * @return {string} The message.
 */
  gadgets.Prefs.prototype.getMsg = function(key) {
    return messages[key] || '';
  };

  /**
 * Gets the current country, returned as ISO 3166-1 alpha-2 code.
 *
 * @return {string} The country for this module instance.
 */
  gadgets.Prefs.prototype.getCountry = function() {
    return country;
  };

  /**
 * Gets the current language the gadget should use when rendering, returned as a
 * ISO 639-1 language code.
 *
 * @return {string} The language for this module instance.
 */
  gadgets.Prefs.prototype.getLang = function() {
    return language;
  };

  /**
 * Gets the module id for the current instance.
 *
 * @return {string | number} The module id for this module instance.
 */
  gadgets.Prefs.prototype.getModuleId = function() {
    return moduleId;
  };

})();




/* =============================== taming.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @class
 * Tame and expose core gadgets.* API to cajoled gadgets
 */
tamings___.push(function(imports) {
  caja___.whitelistCtors([
    [gadgets, 'Prefs', Object]
  ]);
  caja___.whitelistMeths([
    [gadgets.Prefs, 'getArray'],
    [gadgets.Prefs, 'getBool'],
    [gadgets.Prefs, 'getCountry'],
    [gadgets.Prefs, 'getFloat'],
    [gadgets.Prefs, 'getInt'],
    [gadgets.Prefs, 'getLang'],
    [gadgets.Prefs, 'getMsg'],
    [gadgets.Prefs, 'getString'],
    [gadgets.Prefs, 'set'],
    [gadgets.Prefs, 'setArray']
  ]);
});




/* =============================== wpm.transport.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

gadgets.rpctx = gadgets.rpctx || {};

/**
 * Transport for browsers that support native messaging (various implementations
 * of the HTML5 postMessage method). Officially defined at
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html.
 *
 * postMessage is a native implementation of XDC. A page registers that
 * it would like to receive messages by listening the the "message" event
 * on the window (document in DPM) object. In turn, another page can
 * raise that event by calling window.postMessage (document.postMessage
 * in DPM) with a string representing the message and a string
 * indicating on which domain the receiving page must be to receive
 * the message. The target page will then have its "message" event raised
 * if the domain matches and can, in turn, check the origin of the message
 * and process the data contained within.
 *
 *   wpm: postMessage on the window object.
 *      - Internet Explorer 8+
 *      - Safari 4+
 *      - Chrome 2+
 *      - Webkit nightlies
 *      - Firefox 3+
 *      - Opera 9+
 */
if (!gadgets.rpctx.wpm) {  // make lib resilient to double-inclusion

  gadgets.rpctx.wpm = function() {
    var process, ready;
    var forceSecure = true;

    function attachBrowserEvent(eventName, callback, useCapture) {
      if (typeof window.addEventListener != 'undefined') {
        window.addEventListener(eventName, callback, useCapture);
      } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('on' + eventName, callback);
      }
    }

    function removeBrowserEvent(eventName, callback, useCapture) {
      if (window.removeEventListener) {
        window.removeEventListener(eventName, callback, useCapture);
      } else if (window.detachEvent) {
        window.detachEvent('on' + eventName, callback);
      }
    }

    function onmessage(packet) {
      var rpc = gadgets.json.parse(packet.data);
      if (!rpc || !rpc['f']) {
        return;
      }

      // for security, check origin against expected value
      var origin = gadgets.rpc.getTargetOrigin(rpc['f']);

      // Opera's "message" event does not have an "origin" property (at least,
      // it doesn't in version 9.64;  presumably, it will in version 10).  If
      // event.origin does not exist, use event.domain.  The other difference is that
      // while event.origin looks like <scheme>://<hostname>:<port>, event.domain
      // consists only of <hostname>.
      if (forceSecure && (typeof packet.origin !== 'undefined'
          ? packet.origin !== origin
          : packet.domain !== /^.+:\/\/([^:]+).*/.exec(origin)[1])) {
        return;
      }
      process(rpc, packet.origin);
    }

    return {
      getCode: function() {
        return 'wpm';
      },

      isParentVerifiable: function() {
        return true;
      },

      init: function(processFn, readyFn) {
        function configure(config) {
          var cfg = config ? config['rpc'] : {};
          if (String(cfg['disableForceSecure']) === 'true') {
            forceSecure = false;
          }
        }
        gadgets.config.register('rpc', null, configure);

        process = processFn;
        ready = readyFn;

        // Set up native postMessage handler.
        attachBrowserEvent('message', onmessage, false);

        ready('..', true);  // Immediately ready to send to parent.
        return true;
      },

      setup: function(receiverId, token) {
        // Indicate that we're ready to send to the given receiver.
        ready(receiverId, true);
        return true;
      },

      call: function(targetId, from, rpc) {
        // targetOrigin = canonicalized relay URL
        var origin = gadgets.rpc.getTargetOrigin(targetId);
        var targetWin = gadgets.rpc._getTargetWin(targetId);
        if (origin) {
          // Some browsers (IE, Opera) have an implementation of postMessage that is
          // synchronous, although HTML5 specifies that it should be asynchronous.  In
          // order to make all browsers behave consistently, we wrap all postMessage
          // calls in a setTimeout with a timeout of 0.
          window.setTimeout(function() {
              targetWin.postMessage(gadgets.json.stringify(rpc), origin); }, 0);
        } else {
          gadgets.error('No relay set (used as window.postMessage targetOrigin)' +
              ', cannot send cross-domain message');
        }
        return true;
      }
    };
  }();

} // !end of double-inclusion guard




/* =============================== flash.transport.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

gadgets.rpctx = gadgets.rpctx || {};

/**
 * Transport for browsers that utilizes a small Flash bridge and
 * Flash's ExternalInterface methods to transport messages securely,
 * and with guarantees provided on sender identity. This largely emulates wpm.
 *
 *   flash: postMessage on the window object.
 *        - Internet Explorer 6/7
 *        - In theory, any browser supporting Flash 8 and above,
 *          though embed code is tailored to IE only to reduce size.
 *        + (window.postMessage takes precedence where available)
 */
if (!gadgets.rpctx.flash) {  // make lib resilient to double-inclusion

  gadgets.rpctx.flash = function() {
    var swfId = '___xpcswf';
    var swfUrl = null;
    var usingFlash = false;
    var processFn = null;
    var readyFn = null;
    var relayHandle = null;

    var LOADER_TIMEOUT_MS = 100;
    var MAX_LOADER_RETRIES = 50;

    var pendingHandshakes = [];
    var flushHandshakesHandle = null;
    var FLUSH_HANDSHAKES_TIMEOUT_MS = 500;

    var setupHandle = null;
    var setupAttempts = 0;

    var SWF_CHANNEL_READY = '_scr';
    var SWF_CONFIRMED_PARENT = '_pnt';
    var READY_TIMEOUT_MS = 100;
    var MAX_READY_RETRIES = 50;
    var readyAttempts = 0;
    var readyHandle = null;
    var readyMsgs = {};

    var myLoc = window.location.protocol + '//' + window.location.host;
    var JSL_NS = '___jsl';
    var METHODS_NS = '_fm';
    var bucketNs;

    function setupMethodBucket() {
      window[JSL_NS] = window[JSL_NS] || {};
      var container = window[JSL_NS];
      var bucket = container[METHODS_NS] = {};
      bucketNs = JSL_NS + '.' + METHODS_NS;
      return bucket;
    }

    var methodBucket = setupMethodBucket();

    function exportMethod(method, requestedName) {
      var exported = function() {
        method.apply({}, arguments);
      };
      methodBucket[requestedName] = methodBucket[requestedName] || exported;
      return bucketNs + '.' + requestedName;
    }

    function getChannelId(receiverId) {
      return receiverId === '..' ? gadgets.rpc.RPC_ID : receiverId;
    }

    function getRoleId(targetId) {
      return targetId === '..' ? 'INNER' : 'OUTER';
    }

    function init(config) {
      if (usingFlash) {
        swfUrl = config['rpc']['commSwf'] || '//xpc.googleusercontent.com/gadgets/xpc.swf';
      }
    }
    gadgets.config.register('rpc', null, init);

    function relayLoader() {
      if (relayHandle === null && document.body && swfUrl) {
        var theSwf = swfUrl + '?cb=' + Math.random() + '&origin=' + myLoc + '&jsl=1';

        var containerDiv = document.createElement('div');
        containerDiv.style.height = '1px';
        containerDiv.style.width = '1px';
        var html = '<object height="1" width="1" id="' + swfId +
            '" type="application/x-shockwave-flash">' +
            '<param name="allowScriptAccess" value="always"></param>' +
            '<param name="movie" value="' + theSwf + '"></param>' +
            '<embed type="application/x-shockwave-flash" allowScriptAccess="always" ' +
            'src="' + theSwf + '" height="1" width="1"></embed>' +
            '</object>';

        document.body.appendChild(containerDiv);
        containerDiv.innerHTML = html;

        relayHandle = containerDiv.firstChild;
      }
      ++setupAttempts;
      if (setupHandle !== null &&
          (relayHandle !== null || setupAttempts >= MAX_LOADER_RETRIES)) {
        window.clearTimeout(setupHandle);
      } else {
        // Either document.body doesn't yet exist or config doesn't.
        // In either case the relay handle isn't set up properly yet, and
        // so should be retried.
        setupHandle = window.setTimeout(relayLoader, LOADER_TIMEOUT_MS);
      }
    }

    function childReadyPoller() {
      // Attempt sending a message to parent indicating that child is ready
      // to receive messages. This only occurs after the SWF indicates that
      // its setup() method has been successfully called and completed, and
      // only in child context.
      if (readyMsgs['..']) return;
      sendChannelReady('..');
      readyAttempts++;
      if (readyAttempts >= MAX_READY_RETRIES && readyHandle !== null) {
        window.clearTimeout(readyHandle);
        readyHandle = null;
      } else {
        // Try again later. The handle will be cleared during receipt of
        // the setup ACK.
        readyHandle = window.setTimeout(childReadyPoller, READY_TIMEOUT_MS);
      }
    }

    function flushHandshakes() {
      if (relayHandle !== null && relayHandle['setup']) {
        while (pendingHandshakes.length > 0) {
          var shake = pendingHandshakes.shift();
          var targetId = shake.targetId;
          relayHandle['setup'](shake.token, getChannelId(targetId), getRoleId(targetId));
        }
        if (flushHandshakesHandle !== null) {
          window.clearTimeout(flushHandshakesHandle);
          flushHandshakesHandle = null;
        }
      } else if (flushHandshakesHandle === null && pendingHandshakes.length > 0) {
        flushHandshakesHandle = window.setTimeout(flushHandshakes, FLUSH_HANDSHAKES_TIMEOUT_MS);
      }
    }

    function ready() {
      flushHandshakes();
      if (setupHandle !== null) {
        window.clearTimeout(setupHandle);
      }
      setupHandle = null;
    }
    exportMethod(ready, 'ready');

    function setupDone() {
      // Called by SWF only for role_id = "INNER" ie when initializing to parent.
      // Instantiates a polling handshake mechanism which ensures that any enqueued
      // messages remain so until each side is ready to send.
      if (!readyMsgs['..'] && readyHandle === null) {
        readyHandle = window.setTimeout(childReadyPoller, READY_TIMEOUT_MS);
      }
    }
    exportMethod(setupDone, 'setupDone');

    function call(targetId, from, rpc) {
      var targetOrigin = gadgets.rpc.getTargetOrigin(targetId);
      var rpcKey = gadgets.rpc.getAuthToken(targetId);
      var handleKey = 'sendMessage_' + getChannelId(targetId) + '_' + rpcKey + '_' + getRoleId(targetId);
      var messageHandler = relayHandle[handleKey];
      messageHandler.call(relayHandle, gadgets.json.stringify(rpc), targetOrigin);
      return true;
    }

    function receiveMessage(message, fromOrigin, toOrigin) {
      var jsonMsg = gadgets.json.parse(message);
      var channelReady = jsonMsg[SWF_CHANNEL_READY];
      if (channelReady) {
        // Special message indicating that a ready message has been received, indicating
        // the sender is now prepared to receive messages. This type of message is instigated
        // by child context in polling fashion, and is responded-to by parent context(s).
        // If readyHandle is non-null, then it should first be cleared.
        // This method is OK to call twice, if it occurs in a race.
        readyFn(channelReady, true);
        readyMsgs[channelReady] = true;
        if (channelReady !== '..') {
          // Child-to-parent: immediately signal that parent is ready.
          // Now that we know that child can receive messages, it's enough to send once.
          sendChannelReady(channelReady, true);
        }
        return;
      }
      window.setTimeout(function() { processFn(jsonMsg, fromOrigin); }, 0);
    }
    exportMethod(receiveMessage, 'receiveMessage');

    function sendChannelReady(receiverId, opt_isParentConfirmation) {
      var myId = gadgets.rpc.RPC_ID;
      var readyAck = {};
      readyAck[SWF_CHANNEL_READY] = opt_isParentConfirmation ? '..' : myId;
      readyAck[SWF_CONFIRMED_PARENT] = myId;
      call(receiverId, myId, readyAck);
    }

    return {
      // "core" transport methods
      getCode: function() {
        return 'flash';
      },

      isParentVerifiable: function() {
        return true;
      },

      init: function(processIn, readyIn) {
        processFn = processIn;
        readyFn = readyIn;
        usingFlash = true;
        return true;
      },

      setup: function(receiverId, token) {
        // Perform all setup, including embedding of relay SWF (a one-time
        // per Window operation), in this method. We cannot assume document.body
        // exists however, since child-to-parent setup is often done in head.
        // Thus we simply enqueue a setup pair and attempt to complete them all.
        // If body already exists then this enqueueing will immediately flush;
        // otherwise polling will occur until the SWF has completed loading, at
        // which point all connections will complete their handshake.
        pendingHandshakes.push({ token: token, targetId: receiverId });
        if (relayHandle === null && setupHandle === null) {
          setupHandle = window.setTimeout(relayLoader, LOADER_TIMEOUT_MS);
        }
        // Lets try to flush any registered handshakes
        flushHandshakes();
        return true;
      },

      call: call,

      // Methods called by relay SWF. Should be considered private.
      _receiveMessage: receiveMessage,
      _ready: ready,
      _setupDone: setupDone
    };
  }();

} // !end of double-inclusion guard




/* =============================== fe.transport.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

gadgets.rpctx = gadgets.rpctx || {};

/*
 * For Gecko-based browsers, the security model allows a child to call a
 * function on the frameElement of the iframe, even if the child is in
 * a different domain. This method is dubbed "frameElement" (fe).
 *
 * The ability to add and call such functions on the frameElement allows
 * a bidirectional channel to be setup via the adding of simple function
 * references on the frameElement object itself. In this implementation,
 * when the container sets up the authentication information for that gadget
 * (by calling setAuth(...)) it as well adds a special function on the
 * gadget's iframe. This function can then be used by the gadget to send
 * messages to the container. In turn, when the gadget tries to send a
 * message, it checks to see if this function has its own function stored
 * that can be used by the container to call the gadget. If not, the
 * function is created and subsequently used by the container.
 * Note that as a result, FE can only be used by a container to call a
 * particular gadget *after* that gadget has called the container at
 * least once via FE.
 *
 *   fe: Gecko-specific frameElement trick.
 *      - Firefox 1+
 */
if (!gadgets.rpctx.frameElement) {  // make lib resilient to double-inclusion

  gadgets.rpctx.frameElement = function() {
    // Consts for FrameElement.
    var FE_G2C_CHANNEL = '__g2c_rpc';
    var FE_C2G_CHANNEL = '__c2g_rpc';
    var process;
    var ready;

    function callFrameElement(targetId, from, rpc) {
      try {
        if (from !== '..') {
          // Call from gadget to the container.
          var fe = window.frameElement;

          if (typeof fe[FE_G2C_CHANNEL] === 'function') {
            // Complete the setup of the FE channel if need be.
            if (typeof fe[FE_G2C_CHANNEL][FE_C2G_CHANNEL] !== 'function') {
              fe[FE_G2C_CHANNEL][FE_C2G_CHANNEL] = function(args) {
                process(gadgets.json.parse(args));
              };
            }

            // Conduct the RPC call.
            fe[FE_G2C_CHANNEL](gadgets.json.stringify(rpc));
            return true;
          }
        } else {
          // Call from container to gadget[targetId].
          var frame = document.getElementById(targetId);

          if (typeof frame[FE_G2C_CHANNEL] === 'function' &&
              typeof frame[FE_G2C_CHANNEL][FE_C2G_CHANNEL] === 'function') {

            // Conduct the RPC call.
            frame[FE_G2C_CHANNEL][FE_C2G_CHANNEL](gadgets.json.stringify(rpc));
            return true;
          }
        }
      } catch (e) {
      }
      return false;
    }

    return {
      getCode: function() {
        return 'fe';
      },

      isParentVerifiable: function() {
        return false;
      },

      init: function(processFn, readyFn) {
        // No global setup.
        process = processFn;
        ready = readyFn;
        return true;
      },

      setup: function(receiverId, token) {
        // Indicate OK to call to container. This will be true
        // by the end of this method.
        if (receiverId !== '..') {
          try {
            var frame = document.getElementById(receiverId);
            frame[FE_G2C_CHANNEL] = function(args) {
              process(gadgets.json.parse(args));
            };
          } catch (e) {
            return false;
          }
        }
        if (receiverId === '..') {
          ready('..', true);
          var ackFn = function() {
            window.setTimeout(function() {
              gadgets.rpc.call(receiverId, gadgets.rpc.ACK);
            }, 500);
          };
          // Setup to container always happens before onload.
          // If it didn't, the correct fix would be in gadgets.util.
          gadgets.util.registerOnLoadHandler(ackFn);
        }
        return true;
      },

      call: function(targetId, from, rpc) {
        return callFrameElement(targetId, from, rpc);
      }

    };
  }();

} // !end of double-inclusion guard




/* =============================== nix.transport.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

gadgets.rpctx = gadgets.rpctx || {};

/**
 * For Internet Explorer before version 8, the security model allows anyone
 * parent to set the value of the "opener" property on another window,
 * with only the receiving window able to read it.
 * This method is dubbed "Native IE XDC" (NIX).
 *
 * This method works by placing a handler object in the "opener" property
 * of a gadget when the container sets up the authentication information
 * for that gadget (by calling setAuthToken(...)). At that point, a NIX
 * wrapper is created and placed into the gadget by calling
 * theframe.contentWindow.opener = wrapper. Note that as a result, NIX can
 * only be used by a container to call a particular gadget *after* that
 * gadget has called the container at least once via NIX.
 *
 * The NIX wrappers in this RPC implementation are instances of a VBScript
 * class that is created when this implementation loads. The reason for
 * using a VBScript class stems from the fact that any object can be passed
 * into the opener property.
 * While this is a good thing, as it lets us pass functions and setup a true
 * bidirectional channel via callbacks, it opens a potential security hole
 * by which the other page can get ahold of the "window" or "document"
 * objects in the parent page and in turn wreak havok. This is due to the
 * fact that any JS object useful for establishing such a bidirectional
 * channel (such as a function) can be used to access a function
 * (eg. obj.toString, or a function itself) created in a specific context,
 * in particular the global context of the sender. Suppose container
 * domain C passes object obj to gadget on domain G. Then the gadget can
 * access C's global context using:
 * var parentWindow = (new obj.toString.constructor("return window;"))();
 * Nulling out all of obj's properties doesn't fix this, since IE helpfully
 * restores them to their original values if you do something like:
 * delete obj.toString; delete obj.toString;
 * Thus, we wrap the necessary functions and information inside a VBScript
 * object. VBScript objects in IE, like DOM objects, are in fact COM
 * wrappers when used in JavaScript, so we can safely pass them around
 * without worrying about a breach of context while at the same time
 * allowing them to act as a pass-through mechanism for information
 * and function calls. The implementation details of this VBScript wrapper
 * can be found in the setupChannel() method below.
 *
 *   nix: Internet Explorer-specific window.opener trick.
 *     - Internet Explorer 6
 *     - Internet Explorer 7
 */
if (!gadgets.rpctx.nix) {  // make lib resilient to double-inclusion

gadgets.rpctx.nix = function() {
  // Consts for NIX. VBScript doesn't
  // allow items to start with _ for some reason,
  // so we need to make these names quite unique, as
  // they will go into the global namespace.
  var NIX_WRAPPER = 'GRPC____NIXVBS_wrapper';
  var NIX_GET_WRAPPER = 'GRPC____NIXVBS_get_wrapper';
  var NIX_HANDLE_MESSAGE = 'GRPC____NIXVBS_handle_message';
  var NIX_CREATE_CHANNEL = 'GRPC____NIXVBS_create_channel';
  var MAX_NIX_SEARCHES = 10;
  var NIX_SEARCH_PERIOD = 500;

  // JavaScript reference to the NIX VBScript wrappers.
  // Gadgets will have but a single channel under
  // nix_channels['..'] while containers will have a channel
  // per gadget stored under the gadget's ID.
  var nix_channels = {};

  // Store the ready signal method for use on handshake complete.
  var ready;
  var numHandlerSearches = 0;

  // Search for NIX handler to parent. Tries MAX_NIX_SEARCHES times every
  // NIX_SEARCH_PERIOD milliseconds.
  function conductHandlerSearch() {
    // Call from gadget to the container.
    var handler = nix_channels['..'];
    if (handler) {
      return;
    }

    if (++numHandlerSearches > MAX_NIX_SEARCHES) {
      // Handshake failed. Will fall back.
      gadgets.warn('Nix transport setup failed, falling back...');
      ready('..', false);
      return;
    }

    // If the gadget has yet to retrieve a reference to
    // the NIX handler, try to do so now. We don't do a
    // typeof(window.opener.GetAuthToken) check here
    // because it means accessing that field on the COM object, which,
    // being an internal function reference, is not allowed.
    // "in" works because it merely checks for the prescence of
    // the key, rather than actually accessing the object's property.
    // This is just a sanity check, not a validity check.
    if (!handler && window.opener && 'GetAuthToken' in window.opener) {
      handler = window.opener;

      // Create the channel to the parent/container.
      // First verify that it knows our auth token to ensure it's not
      // an impostor.
      if (handler.GetAuthToken() == gadgets.rpc.getAuthToken('..')) {
        // Auth match - pass it back along with our wrapper to finish.
        // own wrapper and our authentication token for co-verification.
        var token = gadgets.rpc.getAuthToken('..');
        handler.CreateChannel(window[NIX_GET_WRAPPER]('..', token),
                              token);
        // Set channel handler
        nix_channels['..'] = handler;
        window.opener = null;

        // Signal success and readiness to send to parent.
        // Container-to-gadget bit flipped in CreateChannel.
        ready('..', true);
        return;
      }
    }

    // Try again.
    window.setTimeout(function() { conductHandlerSearch(); },
                      NIX_SEARCH_PERIOD);
  }

  return {
    getCode: function() {
      return 'nix';
    },

    isParentVerifiable: function() {
      return false;
    },

    init: function(processFn, readyFn) {
      ready = readyFn;

      // Ensure VBScript wrapper code is in the page and that the
      // global Javascript handlers have been set.
      // VBScript methods return a type of 'unknown' when
      // checked via the typeof operator in IE. Fortunately
      // for us, this only applies to COM objects, so we
      // won't see this for a real Javascript object.
      if (typeof window[NIX_GET_WRAPPER] !== 'unknown') {
        window[NIX_HANDLE_MESSAGE] = function(data) {
          window.setTimeout(
              function() { processFn(gadgets.json.parse(data)); }, 0);
        };

        window[NIX_CREATE_CHANNEL] = function(name, channel, token) {
          // Verify the authentication token of the gadget trying
          // to create a channel for us.
          if (gadgets.rpc.getAuthToken(name) === token) {
            nix_channels[name] = channel;
            ready(name, true);
          }
        };

        // Inject the VBScript code needed.
        var vbscript =
          // We create a class to act as a wrapper for
          // a Javascript call, to prevent a break in of
          // the context.
          'Class ' + NIX_WRAPPER + '\n '

          // An internal member for keeping track of the
          // name of the document (container or gadget)
          // for which this wrapper is intended. For
          // those wrappers created by gadgets, this is not
          // used (although it is set to "..")
          + 'Private m_Intended\n'

          // Stores the auth token used to communicate with
          // the gadget. The GetChannelCreator method returns
          // an object that returns this auth token. Upon matching
          // that with its own, the gadget uses the object
          // to actually establish the communication channel.
          + 'Private m_Auth\n'

          // Method for internally setting the value
          // of the m_Intended property.
          + 'Public Sub SetIntendedName(name)\n '
          + 'If isEmpty(m_Intended) Then\n'
          + 'm_Intended = name\n'
          + 'End If\n'
          + 'End Sub\n'

          // Method for internally setting the value of the m_Auth property.
          + 'Public Sub SetAuth(auth)\n '
          + 'If isEmpty(m_Auth) Then\n'
          + 'm_Auth = auth\n'
          + 'End If\n'
          + 'End Sub\n'

          // A wrapper method which actually causes a
          // message to be sent to the other context.
          + 'Public Sub SendMessage(data)\n '
          + NIX_HANDLE_MESSAGE + '(data)\n'
          + 'End Sub\n'

          // Returns the auth token to the gadget, so it can
          // confirm a match before initiating the connection
          + 'Public Function GetAuthToken()\n '
          + 'GetAuthToken = m_Auth\n'
          + 'End Function\n'

          // Method for setting up the container->gadget
          // channel. Not strictly needed in the gadget's
          // wrapper, but no reason to get rid of it. Note here
          // that we pass the intended name to the NIX_CREATE_CHANNEL
          // method so that it can save the channel in the proper place
          // *and* verify the channel via the authentication token passed
          // here.
          + 'Public Sub CreateChannel(channel, auth)\n '
          + 'Call ' + NIX_CREATE_CHANNEL + '(m_Intended, channel, auth)\n'
          + 'End Sub\n'
          + 'End Class\n'

          // Function to get a reference to the wrapper.
          + 'Function ' + NIX_GET_WRAPPER + '(name, auth)\n'
          + 'Dim wrap\n'
          + 'Set wrap = New ' + NIX_WRAPPER + '\n'
          + 'wrap.SetIntendedName name\n'
          + 'wrap.SetAuth auth\n'
          + 'Set ' + NIX_GET_WRAPPER + ' = wrap\n'
          + 'End Function';

        try {
          window.execScript(vbscript, 'vbscript');
        } catch (e) {
          return false;
        }
      }
      return true;
    },

    setup: function(receiverId, token) {
      if (receiverId === '..') {
        conductHandlerSearch();
        return true;
      }
      try {
        var frame = document.getElementById(receiverId);
        var wrapper = window[NIX_GET_WRAPPER](receiverId, token);
        frame.contentWindow.opener = wrapper;
      } catch (e) {
        return false;
      }
      return true;
    },

    call: function(targetId, from, rpc) {
      try {
        // If we have a handler, call it.
        if (nix_channels[targetId]) {
          nix_channels[targetId].SendMessage(gadgets.json.stringify(rpc));
        }
      } catch (e) {
        return false;
      }
      return true;
    }
  };
}();

} // !end of double-inclusion guard




/* =============================== rmr.transport.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

gadgets.rpctx = gadgets.rpctx || {};

/*
 * For older WebKit-based browsers, the security model does not allow for any
 * known "native" hacks for conducting cross browser communication. However,
 * a variation of the IFPC (see below) can be used, entitled "RMR". RMR is
 * a technique that uses the resize event of the iframe to indicate that a
 * message was sent (instead of the much slower/performance heavy polling
 * technique used when a defined relay page is not avaliable). Simply put,
 * RMR uses the same "pass the message by the URL hash" trick that IFPC
 * uses to send a message, but instead of having an active relay page that
 * runs a piece of code when it is loaded, RMR merely changes the URL
 * of the relay page (which does not even have to exist on the domain)
 * and then notifies the other party by resizing the relay iframe. RMR
 * exploits the fact that iframes in the dom of page A can be resized
 * by page A while the onresize event will be fired in the DOM of page B,
 * thus providing a single bit channel indicating "message sent to you".
 * This method has the added benefit that the relay need not be active,
 * nor even exist: a 404 suffices just as well. Note that the technique
 * doesn't actually strictly require WebKit; it just so happens that these
 * browsers have no known alternatives (but are very ill-used right now).
 * The technique's implementation accounts for timing issues through
 * a packet-ack'ing protocol, so should work on just about any browser.
 * This may be of value in scenarios where neither wpm nor Flash are
 * available for some reason.
 *
 *   rmr: Resizing trick, works particularly well on WebKit.
 *      - Safari 2+
 *      - Chrome 1
 */
if (!gadgets.rpctx.rmr) {  // make lib resilient to double-inclusion

  gadgets.rpctx.rmr = function() {
    // Consts for RMR, including time in ms RMR uses to poll for
    // its relay frame to be created, and the max # of polls it does.
    var RMR_SEARCH_TIMEOUT = 500;
    var RMR_MAX_POLLS = 10;

    // JavaScript references to the channel objects used by RMR.
    // Gadgets will have but a single channel under
    // rmr_channels['..'] while containers will have a channel
    // per gadget stored under the gadget's ID.
    var rmr_channels = {};

    var parentParam = gadgets.util.getUrlParameters()['parent'];

    var process;
    var ready;

    /**
   * Append an RMR relay frame to the document. This allows the receiver
   * to start receiving messages.
   *
   * @param {Node} channelFrame Relay frame to add to the DOM body.
   * @param {string} relayUri Base URI for the frame.
   * @param {string} data to pass along to the frame.
   * @param {string=} opt_frameId ID of frame for which relay is being appended (optional).
   */
    function appendRmrFrame(channelFrame, relayUri, data, opt_frameId) {
      var appendFn = function() {
        // Append the iframe.
        document.body.appendChild(channelFrame);

        // Set the src of the iframe to 'about:blank' first and then set it
        // to the relay URI. This prevents the iframe from maintaining a src
        // to the 'old' relay URI if the page is returned to from another.
        // In other words, this fixes the bfcache issue that causes the iframe's
        // src property to not be updated despite us assigning it a new value here.
        channelFrame.src = 'about:blank';
        if (opt_frameId) {
          // Process the initial sent payload (typically sent by container to
          // child/gadget) only when the relay frame has finished loading. We
          // do this to ensure that, in processRmrData(...), the ACK sent due
          // to processing can actually be sent. Before this time, the frame's
          // contentWindow is null, making it impossible to do so.
          channelFrame.onload = function() {
            processRmrData(opt_frameId);
          };
        }
        channelFrame.src = relayUri + '#' + data;
      };

      if (document.body) {
        appendFn();
      } else {
        // Common gadget case: attaching header during in-gadget handshake,
        // when we may still be in script in head. Attach onload.
        gadgets.util.registerOnLoadHandler(function() { appendFn(); });
      }
    }

    /**
   * Sets up the RMR transport frame for the given frameId. For gadgets
   * calling containers, the frameId should be '..'.
   *
   * @param {string} frameId The ID of the frame.
   */
    function setupRmr(frameId) {
      if (typeof rmr_channels[frameId] === 'object') {
        // Sanity check. Already done.
        return;
      }

      var channelFrame = document.createElement('iframe');
      var frameStyle = channelFrame.style;
      frameStyle.position = 'absolute';
      frameStyle.top = '0px';
      frameStyle.border = '0';
      frameStyle.opacity = '0';

      // The width here is important as RMR
      // makes use of the resize handler for the frame.
      // Do not modify unless you test thoroughly!
      frameStyle.width = '10px';
      frameStyle.height = '1px';
      channelFrame.id = 'rmrtransport-' + frameId;
      channelFrame.name = channelFrame.id;

      // Use the explicitly set relay, if one exists. Otherwise,
      // Construct one using the parent parameter plus robots.txt
      // as a synthetic relay. This works since browsers using RMR
      // treat 404s as legitimate for the purposes of cross domain
      // communication.
      var relayUri = gadgets.rpc.getRelayUrl(frameId);
      var relayOrigin = gadgets.rpc.getOrigin(parentParam);
      if (!relayUri) {
        relayUri = relayOrigin + '/robots.txt';
      }

      rmr_channels[frameId] = {
        frame: channelFrame,
        receiveWindow: null,
        relayUri: relayUri,
        relayOrigin: relayOrigin,
        searchCounter: 0,
        width: 10,

        // Waiting means "waiting for acknowledgement to be received."
        // Acknowledgement always comes as a special ACK
        // message having been received. This message is received
        // during handshake in different ways by the container and
        // gadget, and by normal RMR message passing once the handshake
        // is complete.
        waiting: true,
        queue: [],

        // Number of non-ACK messages that have been sent to the recipient
        // and have been acknowledged.
        sendId: 0,

        // Number of messages received and processed from the sender.
        // This is the number that accompanies every ACK to tell the
        // sender to clear its queue.
        recvId: 0,

        // Token sent to target to verify domain.
        // TODO: switch to shindig.random()
        verifySendToken: String(Math.random()),

        // Token received from target during handshake. Stored in
        // order to send back to the caller for verification.
        verifyRecvToken: null,
        originVerified: false
      };

      if (frameId !== '..') {
        // Container always appends a relay to the gadget, before
        // the gadget appends its own relay back to container. The
        // gadget, in the meantime, refuses to attach the container
        // relay until it finds this one. Thus, the container knows
        // for certain that gadget to container communication is set
        // up by the time it finds its own relay. In addition to
        // establishing a reliable handshake protocol, this also
        // makes it possible for the gadget to send an initial batch
        // of messages to the container ASAP.
        appendRmrFrame(channelFrame, relayUri, getRmrData(frameId));
      }

      // Start searching for our own frame on the other page.
      conductRmrSearch(frameId);
    }

    /**
   * Searches for a relay frame, created by the sender referenced by
   * frameId, with which this context receives messages. Once
   * found with proper permissions, attaches a resize handler which
   * signals messages to be sent.
   *
   * @param {string} frameId Frame ID of the prospective sender.
   */
    function conductRmrSearch(frameId) {
      var channelWindow = null;

      // Increment the search counter.
      rmr_channels[frameId].searchCounter++;

      try {
        var targetWin = gadgets.rpc._getTargetWin(frameId);
        if (frameId === '..') {
          // We are a gadget.
          channelWindow = targetWin.frames['rmrtransport-' + gadgets.rpc.RPC_ID];
        } else {
          // We are a container.
          channelWindow = targetWin.frames['rmrtransport-..'];
        }
      } catch (e) {
        // Just in case; may happen when relay is set to about:blank or unset.
        // Catching exceptions here ensures that the timeout to continue the
        // search below continues to work.
      }

      var status = false;

      if (channelWindow) {
        // We have a valid reference to "our" RMR transport frame.
        // Register the proper event handlers.
        status = registerRmrChannel(frameId, channelWindow);
      }

      if (!status) {
        // Not found yet. Continue searching, but only if the counter
        // has not reached the threshold.
        if (rmr_channels[frameId].searchCounter > RMR_MAX_POLLS) {
          // If we reach this point, then RMR has failed and we
          // fall back to IFPC.
          return;
        }

        window.setTimeout(function() {
          conductRmrSearch(frameId);
        }, RMR_SEARCH_TIMEOUT);
      }
    }

    /**
   * Attempts to conduct an RPC call to the specified
   * target with the specified data via the RMR
   * method. If this method fails, the system attempts again
   * using the known default of IFPC.
   *
   * @param {string} targetId Module Id of the RPC service provider.
   * @param {string} serviceName Name of the service to call.
   * @param {string} from Module Id of the calling provider.
   * @param {Object} rpc The RPC data for this call.
   */
    function callRmr(targetId, serviceName, from, rpc) {
      var handler = null;

      if (from !== '..') {
        // Call from gadget to the container.
        handler = rmr_channels['..'];
      } else {
        // Call from container to the gadget.
        handler = rmr_channels[targetId];
      }

      if (handler) {
        // Queue the current message if not ACK.
        // ACK is always sent through getRmrData(...).
        if (serviceName !== gadgets.rpc.ACK) {
          handler.queue.push(rpc);
        }

        if (handler.waiting ||
            (handler.queue.length === 0 &&
            !(serviceName === gadgets.rpc.ACK && rpc && rpc['ackAlone'] === true))) {
          // If we are awaiting a response from any previously-sent messages,
          // or if we don't have anything new to send, just return.
          // Note that we don't short-return if we're ACKing just-received
          // messages.
          return true;
        }

        if (handler.queue.length > 0) {
          handler.waiting = true;
        }

        var url = handler.relayUri + '#' + getRmrData(targetId);

        try {
          // Update the URL with the message.
          handler.frame.contentWindow.location = url;

          // Resize the frame.
          var newWidth = handler.width == 10 ? 20 : 10;
          handler.frame.style.width = newWidth + 'px';
          handler.width = newWidth;

          // Done!
        } catch (e) {
          // Something about location-setting or resizing failed.
          // This should never happen, but if it does, fall back to
          // the default transport.
          return false;
        }
      }

      return true;
    }

    /**
   * Returns as a string the data to be appended to an RMR relay frame,
   * constructed from the current request queue plus an ACK message indicating
   * the currently latest-processed message ID.
   *
   * @param {string} toFrameId Frame whose sendable queued data to retrieve.
   */
    function getRmrData(toFrameId) {
      var channel = rmr_channels[toFrameId];
      var rmrData = {id: channel.sendId};
      if (channel) {
        rmrData['d'] = Array.prototype.slice.call(channel.queue, 0);
        var ackPacket = { 's': gadgets.rpc.ACK, 'id': channel.recvId };
        if (!channel.originVerified) {
          ackPacket['sendToken'] = channel.verifySendToken;
        }
        if (channel.verifyRecvToken) {
          ackPacket['recvToken'] = channel.verifyRecvToken;
        }
        rmrData['d'].push(ackPacket);
      }
      return gadgets.json.stringify(rmrData);
    }

    /**
   * Retrieve data from the channel keyed by the given frameId,
   * processing it as a batch. All processed data is assumed to have been
   * generated by getRmrData(...), pairing that method with this.
   *
   * @param {string} fromFrameId Frame from which data is being retrieved.
   */
    function processRmrData(fromFrameId) {
      var channel = rmr_channels[fromFrameId];
      var data = channel.receiveWindow.location.hash.substring(1);

      // Decode the RPC object array.
      var rpcObj = gadgets.json.parse(decodeURIComponent(data)) || {};
      var rpcArray = rpcObj['d'] || [];

      var nonAckReceived = false;
      var noLongerWaiting = false;

      var numBypassed = 0;
      var numToBypass = (channel.recvId - rpcObj['id']);
      for (var i = 0; i < rpcArray.length; ++i) {
        var rpc = rpcArray[i];

        // If we receive an ACK message, then mark the current
        // handler as no longer waiting and send out the next
        // queued message.
        if (rpc['s'] === gadgets.rpc.ACK) {
          // ACK received - whether this came from a handshake or
          // an active call, in either case it indicates readiness to
          // send messages to the from frame.
          ready(fromFrameId, true);

          // Store sendToken if challenge was passed.
          // This will cause the token to be sent back to the sender
          // to prove origin verification.
          channel.verifyRecvToken = rpc['sendToken'];

          // If a recvToken came back, check to see if it matches the
          // sendToken originally sent as a challenge. If so, mark
          // origin as having been verified.
          if (!channel.originVerified && rpc['recvToken'] &&
              String(rpc['recvToken']) == String(channel.verifySendToken)) {
            channel.originVerified = true;
          }

          if (channel.waiting) {
            noLongerWaiting = true;
          }

          channel.waiting = false;
          var newlyAcked = Math.max(0, rpc['id'] - channel.sendId);
          channel.queue.splice(0, newlyAcked);
          channel.sendId = Math.max(channel.sendId, rpc['id'] || 0);
          continue;
        }

        // If we get here, we've received > 0 non-ACK messages to
        // process. Indicate this bit for later.
        nonAckReceived = true;

        // Bypass any messages already received.
        if (++numBypassed <= numToBypass) {
          continue;
        }

        ++channel.recvId;

        // Send along the origin if it's been verified during handshake.
        // In either case, dispatch the message.
        process(rpc, channel.originVerified ? channel.relayOrigin : undefined);
      }

      // Send an ACK indicating that we got/processed the message(s).
      // Do so if we've received a message to process or if we were waiting
      // before but a received ACK has cleared our waiting bit, and we have
      // more messages to send. Performing this operation causes additional
      // messages to be sent.
      if (nonAckReceived ||
          (noLongerWaiting && channel.queue.length > 0)) {
        var from = (fromFrameId === '..') ? gadgets.rpc.RPC_ID : '..';
        callRmr(fromFrameId, gadgets.rpc.ACK, from, {'ackAlone': nonAckReceived});
      }
    }

    /**
   * Registers the RMR channel handler for the given frameId and associated
   * channel window.
   *
   * @param {string} frameId The ID of the frame for which this channel is being
   *   registered.
   * @param {Object} channelWindow The window of the receive frame for this
   *   channel, if any.
   *
   * @return {boolean} True if the frame was setup successfully, false
   *   otherwise.
   */
    function registerRmrChannel(frameId, channelWindow) {
      var channel = rmr_channels[frameId];

      // Verify that the channel is ready for receiving.
      try {
        var canAccess = false;

        // Check to see if the document is in the window. For Chrome, this
        // will return 'false' if the channelWindow is inaccessible by this
        // piece of JavaScript code, meaning that the URL of the channelWindow's
        // parent iframe has not yet changed from 'about:blank'. We do this
        // check this way because any true *access* on the channelWindow object
        // will raise a security exception, which, despite the try-catch, still
        // gets reported to the debugger (it does not break execution, the try
        // handles that problem, but it is still reported, which is bad form).
        // This check always succeeds in Safari 3.1 regardless of the state of
        // the window.
        canAccess = 'document' in channelWindow;

        if (!canAccess) {
          return false;
        }

        // Check to see if the document is an object. For Safari 3.1, this will
        // return undefined if the page is still inaccessible. Unfortunately, this
        // *will* raise a security issue in the debugger.
        // TODO Find a way around this problem.
        canAccess = typeof channelWindow['document'] == 'object';

        if (!canAccess) {
          return false;
        }

        // Once we get here, we know we can access the document (and anything else)
        // on the window object. Therefore, we check to see if the location is
        // still about:blank (this takes care of the Safari 3.2 case).
        var loc = channelWindow.location.href;

        // Check if this is about:blank for Safari.
        if (loc === 'about:blank') {
          return false;
        }
      } catch (ex) {
        // For some reason, the iframe still points to about:blank. We try
        // again in a bit.
        return false;
      }

      // Save a reference to the receive window.
      channel.receiveWindow = channelWindow;

      // Register the onresize handler.
      function onresize() {
        processRmrData(frameId);
      };

      if (typeof channelWindow.attachEvent === 'undefined') {
        channelWindow.onresize = onresize;
      } else {
        channelWindow.attachEvent('onresize', onresize);
      }

      if (frameId === '..') {
        // Gadget to container. Signal to the container that the gadget
        // is ready to receive messages by attaching the g -> c relay.
        // As a nice optimization, pass along any gadget to container
        // queued messages that have backed up since then. ACK is enqueued in
        // getRmrData to ensure that the container's waiting flag is set to false
        // (this happens in the below code run on the container side).
        appendRmrFrame(channel.frame, channel.relayUri, getRmrData(frameId), frameId);
      } else {
        // Process messages that the gadget sent in its initial relay payload.
        // We can do this immediately because the container has already appended
        // and loaded a relay frame that can be used to ACK the messages the gadget
        // sent. In the preceding if-block, however, the processRmrData(...) call
        // must wait. That's because appendRmrFrame may not actually append the
        // frame - in the context of a gadget, this code may be running in the
        // head element, so it cannot be appended to body. As a result, the
        // gadget cannot ACK the container for messages it received.
        processRmrData(frameId);
      }

      return true;
    }

    return {
      getCode: function() {
        return 'rmr';
      },

      isParentVerifiable: function() {
        return true;
      },

      init: function(processFn, readyFn) {
        // No global setup.
        process = processFn;
        ready = readyFn;
        return true;
      },

      setup: function(receiverId, token) {
        try {
          setupRmr(receiverId);
        } catch (e) {
          gadgets.warn('Caught exception setting up RMR: ' + e);
          return false;
        }
        return true;
      },

      call: function(targetId, from, rpc) {
        return callRmr(targetId, rpc['s'], from, rpc);
      }
    };
  }();

} // !end of double-inclusion guard




/* =============================== ifpc.transport.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

gadgets.rpctx = gadgets.rpctx || {};

/*
 * For all others, we have a fallback mechanism known as "ifpc". IFPC
 * exploits the fact that while same-origin policy prohibits a frame from
 * accessing members on a window not in the same domain, that frame can,
 * however, navigate the window heirarchy (via parent). This is exploited by
 * having a page on domain A that wants to talk to domain B create an iframe
 * on domain B pointing to a special relay file and with a message encoded
 * after the hash (#). This relay, in turn, finds the page on domain B, and
 * can call a receipt function with the message given to it. The relay URL
 * used by each caller is set via the gadgets.rpc.setRelayUrl(..) and
 * *must* be called before the call method is used.
 *
 *   ifpc: Iframe-based method, utilizing a relay page, to send a message.
 *      - No known major browsers still use this method, but it remains
 *        useful as a catch-all fallback for the time being.
 */
if (!gadgets.rpctx.ifpc) {  // make lib resilient to double-inclusion

  gadgets.rpctx.ifpc = function() {
    var iframePool = [];
    var callId = 0;
    var ready;

    var URL_LIMIT = 2000;
    var messagesIn = {};

    /**
   * Encodes arguments for the legacy IFPC wire format.
   *
   * @param {Object} args
   * @return {string} the encoded args.
   */
    function encodeLegacyData(args) {
      var argsEscaped = [];
      for (var i = 0, j = args.length; i < j; ++i) {
        argsEscaped.push(encodeURIComponent(gadgets.json.stringify(args[i])));
      }
      return argsEscaped.join('&');
    }

    /**
   * Helper function to emit an invisible IFrame.
   * @param {string} src SRC attribute of the IFrame to emit.
   * @private
   */
    function emitInvisibleIframe(src) {
      var iframe;
      // Recycle IFrames
      for (var i = iframePool.length - 1; i >= 0; --i) {
        var ifr = iframePool[i];
        try {
          if (ifr && (ifr.recyclable || ifr.readyState === 'complete')) {
            ifr.parentNode.removeChild(ifr);
            if (window.ActiveXObject) {
              // For MSIE, delete any iframes that are no longer being used. MSIE
              // cannot reuse the IFRAME because a navigational click sound will
              // be triggered when we set the SRC attribute.
              // Other browsers scan the pool for a free iframe to reuse.
              iframePool[i] = ifr = null;
              iframePool.splice(i, 1);
            } else {
              ifr.recyclable = false;
              iframe = ifr;
              break;
            }
          }
        } catch (e) {
          // Ignore; IE7 throws an exception when trying to read readyState and
          // readyState isn't set.
        }
      }
      // Create IFrame if necessary
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.style.border = iframe.style.width = iframe.style.height = '0px';
        iframe.style.visibility = 'hidden';
        iframe.style.position = 'absolute';
        iframe.onload = function() { this.recyclable = true; };
        iframePool.push(iframe);
      }
      iframe.src = src;
      window.setTimeout(function() { document.body.appendChild(iframe); }, 0);
    }

    function isMessageComplete(arr, total) {
      for (var i = total - 1; i >= 0; --i) {
        if (typeof arr[i] === 'undefined') {
          return false;
        }
      }
      return true;
    }

    return {
      getCode: function() {
        return 'ifpc';
      },

      isParentVerifiable: function() {
        return true;
      },

      init: function(processFn, readyFn) {
        // No global setup.
        ready = readyFn;
        ready('..', true);  // Ready immediately.
        return true;
      },

      setup: function(receiverId, token) {
        // Indicate readiness to send to receiver.
        ready(receiverId, true);
        return true;
      },

      call: function(targetId, from, rpc) {
        // Retrieve the relay file used by IFPC. Note that
        // this must be set before the call, and so we conduct
        // an extra check to ensure it is not blank.
        var relay = gadgets.rpc.getRelayUrl(targetId);
        ++callId;

        if (!relay) {
          gadgets.warn('No relay file assigned for IFPC');
          return false;
        }

        // The RPC mechanism supports two formats for IFPC (legacy and current).
        var src = null,
            queueOut = [];
        if (rpc['l']) {
          // Use legacy protocol.
          // Format: #iframe_id&callId&num_packets&packet_num&block_of_data
          var callArgs = rpc['a'];
          src = [relay, '#', encodeLegacyData([from, callId, 1, 0,
            encodeLegacyData([from, rpc['s'], '', '', from].concat(
                callArgs))])].join('');
          queueOut.push(src);
        } else {
          // Format: #targetId & sourceId@callId & packetNum & packetId & packetData
          src = [relay, '#', targetId, '&', from, '@', callId, '&'].join('');
          var message = encodeURIComponent(gadgets.json.stringify(rpc)),
              payloadLength = URL_LIMIT - src.length,
              numPackets = Math.ceil(message.length / payloadLength),
              packetIdx = 0,
              part;
          while (message.length > 0) {
            part = message.substring(0, payloadLength);
            message = message.substring(payloadLength);
            queueOut.push([src, numPackets, '&', packetIdx, '&', part].join(''));
            packetIdx += 1;
          }
        }

        // Conduct the IFPC call by creating the Iframe with
        // the relay URL and appended message.
        do {
          emitInvisibleIframe(queueOut.shift());
        } while (queueOut.length > 0);
        return true;
      },

      /** Process message from invisible iframe, merging message parts if necessary. */
      _receiveMessage: function(fragment, process) {
        var from = fragment[1],   // in the form of "<from>@<callid>"
            numPackets = parseInt(fragment[2], 10),
            packetIdx = parseInt(fragment[3], 10),
            payload = fragment[fragment.length - 1],
            completed = numPackets === 1;

        // if message is multi-part, store parts in the proper order
        if (numPackets > 1) {
          if (!messagesIn[from]) {
            messagesIn[from] = [];
          }
          messagesIn[from][packetIdx] = payload;
          // check if all parts have been sent
          if (isMessageComplete(messagesIn[from], numPackets)) {
            payload = messagesIn[from].join('');
            delete messagesIn[from];
            completed = true;
          }
        }

        // complete message sent
        if (completed) {
          process(gadgets.json.parse(decodeURIComponent(payload)));
        }
      }
    };
  }();

} // !end of double inclusion guard




/* =============================== rpc.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Remote procedure call library for gadget-to-container,
 * container-to-gadget, and gadget-to-gadget (thru container) communication.
 */

/**
 * gadgets.rpc Transports
 *
 * All transports are stored in object gadgets.rpctx, and are provided
 * to the core gadgets.rpc library by various build rules.
 *
 * Transports used by core gadgets.rpc code to actually pass messages.
 * Each transport implements the same interface exposing hooks that
 * the core library calls at strategic points to set up and use
 * the transport.
 *
 * The methods each transport must implement are:
 * + getCode(): returns a string identifying the transport. For debugging.
 * + isParentVerifiable(): indicates (via boolean) whether the method
 *     has the property that its relay URL verifies for certain the
 *     receiver's protocol://host:port.
 * + init(processFn, readyFn): Performs any global initialization needed. Called
 *     before any other gadgets.rpc methods are invoked. processFn is
 *     the function in gadgets.rpc used to process an rpc packet. readyFn is
 *     a function that must be called when the transport is ready to send
 *     and receive messages bidirectionally. Returns
 *     true if successful, false otherwise.
 * + setup(receiverId, token): Performs per-receiver initialization, if any.
 *     receiverId will be '..' for gadget-to-container. Returns true if
 *     successful, false otherwise.
 * + call(targetId, from, rpc): Invoked to send an actual
 *     message to the given targetId, with the given serviceName, from
 *     the sender identified by 'from'. Payload is an rpc packet. Returns
 *     true if successful, false otherwise.
 */

if (!window['gadgets']['rpc']) { // make lib resilient to double-inclusion

  /**
   * @static
   * @namespace Provides operations for making rpc calls.
   * @name gadgets.rpc
   */
  gadgets.rpc = function() {
    /**
     * @const
     * @private
     */
    var CALLBACK_NAME = '__cb';

    /**
     * @const
     * @private
     */
    var DEFAULT_NAME = '';

    /** Exported constant, for use by transports only.
     * @const
     * @type {string}
     * @member gadgets.rpc
     */
    var ACK = '__ack';

    /**
     * Timeout and number of attempts made to setup a transport receiver.
     * @const
     * @private
     */
    var SETUP_FRAME_TIMEOUT = 500;

    /**
     * @const
     * @private
     */
    var SETUP_FRAME_MAX_TRIES = 10;

    /**
     * @const
     * @private
     */
    var ID_ORIGIN_DELIMITER = '|';

    /**
     * @const
     * @private
     */
    var RPC_KEY_CALLBACK = 'callback';

    /**
     * @const
     * @private
     */
    var RPC_KEY_ORIGIN = 'origin';
    var RPC_KEY_REFERRER = 'referer';

    var services = {};
    var relayUrl = {};
    var useLegacyProtocol = {};
    var authToken = {};
    var callId = 0;
    var callbacks = {};
    var setup = {};
    var sameDomain = {};
    var params = {};
    var receiverTx = {};
    var earlyRpcQueue = {};
    var passReferrerDirection = null;
    var passReferrerContents = null;

    // isGadget =~ isChild for the purposes of rpc (used only in setup).
    var isChild = !!gadgets.util.getUrlParameters().parent &&
      (window.top !== window.self);

    // Set the current rpc ID from window.name immediately, to prevent
    // shadowing of window.name by a "var name" declaration, or similar.
    var rpcId = window.name;

    var securityCallback = function() {};
    var arbitrator = null;
    var LOAD_TIMEOUT = 0;
    var FRAME_PHISH = 1;
    var FORGED_MSG = 2;

    // Fallback transport is simply a dummy impl that emits no errors
    // and logs info on calls it receives, to avoid undesired side-effects
    // from falling back to IFPC or some other transport.
    var console = window['console'];
    var clog = console && console.log ? function(msg) { console.log(msg); } : function(){};
    var fallbackTransport = (function() {
      function logFn(name) {
        return function() {
          clog(name + ': call ignored');
        };
      }
      return {
        'getCode': function() { return 'noop'; },
        // Not really, but prevents transport assignment to IFPC.
        'isParentVerifiable': function() { return true; },
        'init': logFn('init'),
        'setup': logFn('setup'),
        'call': logFn('call')
      };
    })();

    // Load the authentication token for speaking to the container
    // from the gadget's parameters, or default to '0' if not found.
    if (gadgets.util) {
      params = gadgets.util.getUrlParameters();
    }

    /**
     * Return a transport representing the best available cross-domain
     * message-passing mechanism available to the browser.
     *
     * <p>Transports are selected on a cascading basis determined by browser
     * capability and other checks. The order of preference is:
     * <ol>
     * <li> wpm: Uses window.postMessage standard.
     * <li> dpm: Uses document.postMessage, similar to wpm but pre-standard.
     * <li> nix: Uses IE-specific browser hacks.
     * <li> rmr: Signals message passing using relay file's onresize handler.
     * <li> fe: Uses FF2-specific window.frameElement hack.
     * <li> ifpc: Sends messages via active load of a relay file.
     * </ol>
     * <p>See each transport's commentary/documentation for details.
     * @return {Object}
     * @member gadgets.rpc
     */
    function getTransport() {
      if (params['rpctx'] == 'flash') return gadgets.rpctx.flash;
      if (params['rpctx'] == 'rmr') return gadgets.rpctx.rmr;
      return typeof window.postMessage === 'function' ? gadgets.rpctx.wpm :
          typeof window.postMessage === 'object' ? gadgets.rpctx.wpm :
          window.ActiveXObject ? (gadgets.rpctx.flash ? gadgets.rpctx.flash : gadgets.rpctx.nix) :
          navigator.userAgent.indexOf('WebKit') > 0 ? gadgets.rpctx.rmr :
          navigator.product === 'Gecko' ? gadgets.rpctx.frameElement :
          gadgets.rpctx.ifpc;
    }

    /**
     * Function passed to, and called by, a transport indicating it's ready to
     * send and receive messages.
     */
    function transportReady(receiverId, readySuccess) {
      if (receiverTx[receiverId]) return;
      var tx = transport;
      if (!readySuccess) {
        tx = fallbackTransport;
      }
      receiverTx[receiverId] = tx;

      // If there are any early-queued messages, send them now directly through
      // the needed transport.
      var earlyQueue = earlyRpcQueue[receiverId] || [];
      for (var i = 0; i < earlyQueue.length; ++i) {
        var rpc = earlyQueue[i];
        // There was no auth/rpc token set before, so set it now.
        rpc['t'] = getAuthToken(receiverId);
        tx.call(receiverId, rpc['f'], rpc);
      }

      // Clear the queue so it won't be sent again.
      earlyRpcQueue[receiverId] = [];
    }

    //  Track when this main page is closed or navigated to a different location
    // ("unload" event).
    //  NOTE: The use of the "unload" handler here and for the relay iframe
    // prevents the use of the in-memory page cache in modern browsers.
    // See: https://developer.mozilla.org/en/using_firefox_1.5_caching
    // See: http://webkit.org/blog/516/webkit-page-cache-ii-the-unload-event/
    var mainPageUnloading = false,
        hookedUnload = false;

    function hookMainPageUnload() {
      if (hookedUnload) {
        return;
      }
      function onunload() {
        mainPageUnloading = true;
      }

      // TODO: use common helper
      if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('unload', onunload, false);
      } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onunload', onunload);
      }

      hookedUnload = true;
    }

    function relayOnload(targetId, sourceId, token, data, relayWindow) {
      // Validate auth token.
      if (!authToken[sourceId] || authToken[sourceId] !== token) {
        gadgets.error('Invalid auth token. ' + authToken[sourceId] + ' vs ' + token);
        securityCallback(sourceId, FORGED_MSG);
      }

      relayWindow.onunload = function() {
        if (setup[sourceId] && !mainPageUnloading) {
          securityCallback(sourceId, FRAME_PHISH);
          gadgets.rpc.removeReceiver(sourceId);
        }
      };
      hookMainPageUnload();

      data = gadgets.json.parse(decodeURIComponent(data));
    }

    /**
     * Helper function that performs actual processing of an RPC request.
     * Origin is passed in separately to ensure that it cannot be spoofed,
     * and guard code in the method ensures the same before dispatching
     * any service handler.
     * @param {Object} rpc RPC request object.
     * @param {String} opt_sender RPC sender, if available and with a verified origin piece.
     * @private
     */
    function process(rpc, opt_sender) {
      //
      // RPC object contents:
      //   s: Service Name
      //   f: From
      //   c: The callback ID or 0 if none.
      //   a: The arguments for this RPC call.
      //   t: The authentication token.
      //
      if (rpc && typeof rpc['s'] === 'string' && typeof rpc['f'] === 'string' &&
          rpc['a'] instanceof Array) {

        if (typeof arbitrate === 'function' && !arbitrate(rpc['s'], rpc['f'])) {
          return;
        }

        // Validate auth token.
        if (authToken[rpc['f']]) {
          // We don't do type coercion here because all entries in the authToken
          // object are strings, as are all url params. See setupReceiver(...).
          if (authToken[rpc['f']] !== rpc['t']) {
            gadgets.error('Invalid auth token. ' + authToken[rpc['f']] + ' vs ' + rpc['t']);
            securityCallback(rpc['f'], FORGED_MSG);
          }
        }

        if (rpc['s'] === ACK) {
          // Acknowledgement API, used to indicate a receiver is ready.
          window.setTimeout(function() { transportReady(rpc['f'], true); }, 0);
          return;
        }

        // If there is a callback for this service, attach a callback function
        // to the rpc context object for asynchronous rpc services.
        //
        // Synchronous rpc request handlers should simply ignore it and return a
        // value as usual.
        // Asynchronous rpc request handlers, on the other hand, should pass its
        // result to this callback function and not return a value on exit.
        //
        // For example, the following rpc handler passes the first parameter back
        // to its rpc client with a one-second delay.
        //
        // function asyncRpcHandler(param) {
        //   var me = this;
        //   setTimeout(function() {
        //     me.callback(param);
        //   }, 1000);
        // }
        if (rpc['c']) {
          rpc[RPC_KEY_CALLBACK] = function(result) {
            gadgets.rpc.call(rpc['f'], CALLBACK_NAME, null, rpc['c'], result);
          };
        }

        // Set the requestor origin.
        // If not passed by the transport, then this simply sets to undefined.
        if (opt_sender) {
          var origin = getOrigin(opt_sender);
          rpc[RPC_KEY_ORIGIN] = opt_sender;
          var referrer = rpc['r'];
          if (!referrer || getOrigin(referrer) != origin) {
            // Transports send along as much info as they can about the sender
            // of the message; 'origin' is the origin component alone, while
            // 'referrer' is a best-effort field set from available information.
            // The second clause simply verifies that referrer is valid.
            referrer = opt_sender;
          }
          rpc[RPC_KEY_REFERRER] = referrer;
        }

        // Call the requested RPC service.
        var result = (services[rpc['s']] ||
            services[DEFAULT_NAME]).apply(rpc, rpc['a']);

        // If the rpc request handler returns a value, immediately pass it back
        // to the callback. Otherwise, do nothing, assuming that the rpc handler
        // will make an asynchronous call later.
        if (rpc['c'] && typeof result !== 'undefined') {
          gadgets.rpc.call(rpc['f'], CALLBACK_NAME, null, rpc['c'], result);
        }
      }
    }

    /**
     * Helper method returning a canonicalized protocol://host[:port] for
     * a given input URL, provided as a string. Used to compute convenient
     * relay URLs and to determine whether a call is coming from the same
     * domain as its receiver (bypassing the try/catch capability detection
     * flow, thereby obviating Firebug and other tools reporting an exception).
     *
     * @param {string} url Base URL to canonicalize.
     * @memberOf gadgets.rpc
     */
    function getOrigin(url) {
      if (!url) {
        return '';
      }
      url = url.toLowerCase();
      if (url.indexOf('//') == 0) {
        url = window.location.protocol + url;
      }
      if (url.indexOf('://') == -1) {
        // Assumed to be schemaless. Default to current protocol.
        url = window.location.protocol + '//' + url;
      }
      // At this point we guarantee that "://" is in the URL and defines
      // current protocol. Skip past this to search for host:port.
      var host = url.substring(url.indexOf('://') + 3);

      // Find the first slash char, delimiting the host:port.
      var slashPos = host.indexOf('/');
      if (slashPos != -1) {
        host = host.substring(0, slashPos);
      }

      var protocol = url.substring(0, url.indexOf('://'));

      // Use port only if it's not default for the protocol.
      var portStr = '';
      var portPos = host.indexOf(':');
      if (portPos != -1) {
        var port = host.substring(portPos + 1);
        host = host.substring(0, portPos);
        if ((protocol === 'http' && port !== '80') ||
            (protocol === 'https' && port !== '443')) {
          portStr = ':' + port;
        }
      }

      // Return <protocol>://<host>[<port>]
      return protocol + '://' + host + portStr;
    }

    /*
     * Makes a sibling id in the format of "/<siblingFrameId>|<siblingOrigin>".
     */
    function makeSiblingId(id, opt_origin) {
      return '/' + id + (opt_origin ? ID_ORIGIN_DELIMITER + opt_origin : '');
    }

    /*
     * Parses an iframe id.  Returns null if not a sibling id or
     *   {id: <siblingId>, origin: <siblingOrigin>} otherwise.
     */
    function parseSiblingId(id) {
      if (id.charAt(0) == '/') {
        var delimiter = id.indexOf(ID_ORIGIN_DELIMITER);
        var siblingId = delimiter > 0 ? id.substring(1, delimiter) : id.substring(1);
        var origin = delimiter > 0 ? id.substring(delimiter + 1) : null;
        return {id: siblingId, origin: origin};
      } else {
        return null;
      }
    }

    function getTargetWin(id) {
      if (typeof id === 'undefined' ||
          id === '..') {
        return window.parent;
      }

      var siblingId = parseSiblingId(id);
      if (siblingId) {
        var currentWindow = window;
        while (!currentWindow.frames[siblingId.id]) {
          if (currentWindow === window.top) {
            break;
          }
          currentWindow = currentWindow.parent;
        }
        return currentWindow.frames[siblingId.id];
      }

      // Cast to a String to avoid an index lookup.
      id = String(id);
      
      // Try getElementById() first
      var target = document.getElementById(id);
      if (target && target.contentWindow) {
        return target.contentWindow;
      }

      // Fallback to window.frames
      target = window.frames[id];
      if (target && !target.closed) {
        return target;
      }

      return null;
    }

    function getTargetOrigin(id) {
      var targetRelay = null;
      var relayUrl = getRelayUrl(id);
      if (relayUrl) {
        targetRelay = relayUrl;
      } else {
        var siblingId = parseSiblingId(id);
        if (siblingId) {
          // sibling
          targetRelay = siblingId.origin;
        } else if (id == '..') {
          // parent
          targetRelay = params['parent'];
        } else {
          // child
          targetRelay = document.getElementById(id).src;
        }
      }

      return getOrigin(targetRelay);
    }

    // Pick the most efficient RPC relay mechanism.
    var transport = getTransport();

    // Create the Default RPC handler.
    services[DEFAULT_NAME] = function() {
      clog('Unknown RPC service: ' + this.s);
    };

    // Create a Special RPC handler for callbacks.
    services[CALLBACK_NAME] = function(callbackId, result) {
      var callback = callbacks[callbackId];
      if (callback) {
        delete callbacks[callbackId];
        callback.call(this, result);
      }
    };

    /**
     * Conducts any frame-specific work necessary to setup
     * the channel type chosen. This method is called when
     * the container page first registers the gadget in the
     * RPC mechanism. Gadgets, in turn, will complete the setup
     * of the channel once they send their first messages.
     */
    function setupFrame(frameId, token) {
      if (setup[frameId] === true) {
        return;
      }

      if (typeof setup[frameId] === 'undefined') {
        setup[frameId] = 0;
      }

      var tgtFrame = getTargetWin(frameId);
      if (frameId === '..' || tgtFrame != null) {
        if (transport.setup(frameId, token) === true) {
          setup[frameId] = true;
          return;
        }
      }

      if (setup[frameId] !== true && setup[frameId]++ < SETUP_FRAME_MAX_TRIES) {
        // Try again in a bit, assuming that frame will soon exist.
        window.setTimeout(function() { setupFrame(frameId, token); },
                        SETUP_FRAME_TIMEOUT);
      } else {
        // Fail: fall back for this gadget.
        receiverTx[frameId] = fallbackTransport;
        setup[frameId] = true;
      }
    }

    var _flagCrossOrigin = {};
    /**
     * Attempts to make an rpc by calling the target's receive method directly.
     * This works when gadgets are rendered on the same domain as their container,
     * a potentially useful optimization for trusted content which keeps
     * RPC behind a consistent interface.
     *
     * @param {string} target Module id of the rpc service provider.
     * @param {Object} rpc RPC data.
     * @return {boolean}
     */
    function callSameDomain(target, rpc) {
      var targetEl = getTargetWin(target);
      if (!sameDomain[target] || (sameDomain[target] !== _flagCrossOrigin &&
              targetEl.Function.prototype !== sameDomain[target].constructor.prototype)) {

        var targetRelay = getRelayUrl(target);
        if (getOrigin(targetRelay) !== getOrigin(window.location.href)) {
          // Not worth trying -- avoid the error and just return.
          sameDomain[target] = _flagCrossOrigin; // never try this again
          return false;
        }

        try {
          // If this succeeds, then same-domain policy applied
          var targetGadgets = targetEl['gadgets'];
          sameDomain[target] = targetGadgets.rpc.receiveSameDomain;
        } catch (e) {
          // Shouldn't happen due to origin check. Caught to emit more
          // meaningful error to the caller. Consider emitting in non-opt mode.
          // gadgets.log('Same domain call failed: parent= incorrectly set.');
          sameDomain[target] = _flagCrossOrigin; // never try this again
          return false;
        }
      }

      // Cross window functions in IE often look like objects in nearly every way
      // (typeof() will lie to you)
      if (sameDomain[target] && sameDomain[target] !== _flagCrossOrigin) {
        // Call target's receive method
        sameDomain[target](rpc);
        return true;
      }

      return false;
    }

    /**
     * Gets the relay URL of a target frame.
     * @param {string} targetId Name of the target frame.
     * @return {string|undefined} Relay URL of the target frame.
     *
     * @member gadgets.rpc
     */
    function getRelayUrl(targetId) {
      var url = relayUrl[targetId];
      // Some RPC methods (wpm, for one) are unhappy with schemeless URLs.
      if (url && url.substring(0, 1) === '/') {
        if (url.substring(1, 2) === '/') {    // starts with '//'
          url = document.location.protocol + url;
        } else {    // relative URL, starts with '/'
          url = document.location.protocol + '//' + document.location.host + url;
        }
      }
      return url;
    }

    /**
     * Sets the relay URL of a target frame.
     * @param {string} targetId Name of the target frame.
     * @param {string} url Full relay URL of the target frame.
     *
     * @member gadgets.rpc
     * @deprecated
     */
    function setRelayUrl(targetId, url, opt_useLegacy) {
      // Make URL absolute if necessary
      if (!/http(s)?:\/\/.+/.test(url)) {
        if (url.indexOf('//') == 0) {
          url = window.location.protocol + url;
        } else if (url.charAt(0) == '/') {
          url = window.location.protocol + '//' + window.location.host + url;
        } else if (url.indexOf('://') == -1) {
          // Assumed to be schemaless. Default to current protocol.
          url = window.location.protocol + '//' + url;
        }
      }
      relayUrl[targetId] = url;
      if (typeof opt_useLegacy !== 'undefined') {
        useLegacyProtocol[targetId] = !!opt_useLegacy;
      }
    }

    /**
     * Helper method to retrieve the authToken for a given gadget.
     * Not to be used directly.
     * @member gadgets.rpc
     * @return {string}
     */
    function getAuthToken(targetId) {
      return authToken[targetId];
    }

    /**
     * Sets the auth token of a target frame.
     * @param {string} targetId Name of the target frame.
     * @param {string} token The authentication token to use for all
     *     calls to or from this target id.
     *
     * @member gadgets.rpc
     * @deprecated
     */
    function setAuthToken(targetId, token) {
      token = token || '';

      // Coerce token to a String, ensuring that all authToken values
      // are strings. This ensures correct comparison with URL params
      // in the process(rpc) method.
      authToken[targetId] = String(token);

      setupFrame(targetId, token);
    }

    function setReferrerConfig(cfg) {
      var passReferrer = cfg['passReferrer'] || '';
      var prParts = passReferrer.split(':', 2);
      passReferrerDirection = prParts[0] || 'none';
      passReferrerContents = prParts[1] || 'origin';
    }

    function setLegacyProtocolConfig(cfg) {
      if (isLegacyProtocolConfig(cfg)) {
        transport = gadgets.rpctx.ifpc;
        transport.init(process, transportReady);
      }
    }

    function isLegacyProtocolConfig(cfg) {
      return String(cfg['useLegacyProtocol']) === 'true';
    }

    function setupContainedContext(rpctoken, opt_parent) {
      function init(config) {
        var cfg = config ? config['rpc'] : {};
        setReferrerConfig(cfg);

        // Parent-relative only.
        var parentRelayUrl = cfg['parentRelayUrl'] || '';
        parentRelayUrl = getOrigin(params['parent'] || opt_parent) + parentRelayUrl;
        setRelayUrl('..', parentRelayUrl, isLegacyProtocolConfig(cfg));

        setLegacyProtocolConfig(cfg);

        setAuthToken('..', rpctoken);
      }

      // Check to see if we know the parent yet.
      // In almost all cases we will, since the parent param is provided.
      // However, it's possible that the lib doesn't yet know, but is
      // initialized in forced fashion later.
      if (!params['parent'] && opt_parent) {
        // Handles the forced initialization case.
        init({});
        return;
      }

      // Handles the standard gadgets.config.init() case.
      gadgets.config.register('rpc', null, init);
    }

    function setupChildIframe(gadgetId, opt_frameurl, opt_authtoken) {
      var childIframe = null;
      if (gadgetId.charAt(0) != '/') {
        // only set up child (and not sibling) iframe
        if (!gadgets.util) {
          return;
        }
        childIframe = document.getElementById(gadgetId);
        if (!childIframe) {
          throw new Error('Cannot set up gadgets.rpc receiver with ID: ' + gadgetId +
              ', element not found.');
        }
      }

      // The "relay URL" can either be explicitly specified or is set as
      // the child IFRAME URL's origin
      var childSrc = childIframe && childIframe.src;
      var relayUrl = opt_frameurl || gadgets.rpc.getOrigin(childSrc);
      setRelayUrl(gadgetId, relayUrl);

      // The auth token is parsed from child params (rpctoken) or overridden.
      var childParams = gadgets.util.getUrlParameters(childSrc);
      var rpctoken = opt_authtoken || childParams['rpctoken'];
      setAuthToken(gadgetId, rpctoken);
    }

    /**
     * Sets up the gadgets.rpc library to communicate with the receiver.
     * <p>This method replaces setRelayUrl(...) and setAuthToken(...)
     *
     * <p>Simplified instructions - highly recommended:
     * <ol>
     * <li> Generate &lt;iframe id="&lt;ID&gt;" src="...#parent=&lt;PARENTURL&gt;&rpctoken=&lt;RANDOM&gt;"/&gt;
     *      and add to DOM.
     * <li> Call gadgets.rpc.setupReceiver("&lt;ID>");
     *      <p>All parent/child communication initializes automatically from here.
     *         Naturally, both sides need to include the library.
     * </ol>
     *
     * <p>Detailed container/parent instructions:
     * <ol>
     * <li> Create the target IFRAME (eg. gadget) with a given &lt;ID> and params
     *    rpctoken=<token> (eg. #rpctoken=1234), which is a random/unguessbable
     *    string, and parent=&lt;url>, where &lt;url> is the URL of the container.
     * <li> Append IFRAME to the document.
     * <li> Call gadgets.rpc.setupReceiver(&lt;ID>)
     * <p>[Optional]. Strictly speaking, you may omit rpctoken and parent. This
     *             practice earns little but is occasionally useful for testing.
     *             If you omit parent, you MUST pass your container URL as the 2nd
     *             parameter to this method.
     * </ol>
     *
     * <p>Detailed gadget/child IFRAME instructions:
     * <ol>
     * <li> If your container/parent passed parent and rpctoken params (query string
     *    or fragment are both OK), you needn't do anything. The library will self-
     *    initialize.
     * <li> If "parent" is omitted, you MUST call this method with targetId '..'
     *    and the second param set to the parent URL.
     * <li> If "rpctoken" is omitted, but the container set an authToken manually
     *    for this frame, you MUST pass that ID (however acquired) as the 3rd param
     *    to this method.
     * </ol>
     *
     * @member gadgets.rpc
     * @param {string} targetId
     * @param {string=} opt_receiverurl
     * @param {string=} opt_authtoken
     */
    function setupReceiver(targetId, opt_receiverurl, opt_authtoken) {
      if (targetId === '..') {
        // Gadget/IFRAME to container.
        var rpctoken = opt_authtoken || params['rpctoken'] || params['ifpctok'] || '';
        setupContainedContext(rpctoken, opt_receiverurl);
      } else {
        // Container to child.
        setupChildIframe(targetId, opt_receiverurl, opt_authtoken);
      }
    }

    function getReferrer(targetId) {
      if (passReferrerDirection === 'bidir' ||
          (passReferrerDirection === 'c2p' && targetId === '..') ||
          (passReferrerDirection === 'p2c' && targetId !== '..')) {
        var href = window.location.href;
        var lopOff = '?';  // default = origin
        if (passReferrerContents === 'query') {
          lopOff = '#';
        } else if (passReferrerContents === 'hash') {
          return href;
        }
        var lastIx = href.lastIndexOf(lopOff);
        lastIx = lastIx === -1 ? href.length : lastIx;
        return href.substring(0, lastIx);
      }
      return null;
    }

    return /** @scope gadgets.rpc */ {
      config: function(config) {
        if (typeof config.securityCallback === 'function') {
          securityCallback = config.securityCallback;
        }
        if (typeof config.arbitrator === 'function') {
          arbitrate = config.arbitrator;
        }
      },

      /**
       * Registers an RPC service.
       * @param {string} serviceName Service name to register.
       * @param {function(Object,Object)} handler Service handler.
       *
       * @return The old service handler for serviceName, if any.
       * @member gadgets.rpc
       */
      register: function(serviceName, handler) {
        if (serviceName === CALLBACK_NAME || serviceName === ACK) {
          throw new Error('Cannot overwrite callback/ack service');
        }

        if (serviceName === DEFAULT_NAME) {
          throw new Error('Cannot overwrite default service:'
                        + ' use registerDefault');
        }

        var old = services[serviceName];
        services[serviceName] = handler;
        return old;
      },

      /**
       * Unregisters an RPC service.
       * @param {string} serviceName Service name to unregister.
       *
       * @member gadgets.rpc
       */
      unregister: function(serviceName) {
        if (serviceName === CALLBACK_NAME || serviceName === ACK) {
          throw new Error('Cannot delete callback/ack service');
        }

        if (serviceName === DEFAULT_NAME) {
          throw new Error('Cannot delete default service:'
                        + ' use unregisterDefault');
        }

        delete services[serviceName];
      },

      /**
       * Registers a default service handler to processes all unknown
       * RPC calls which raise an exception by default.
       * @param {function(Object,Object)} handler Service handler.
       *
       * @member gadgets.rpc
       */
      registerDefault: function(handler) {
        services[DEFAULT_NAME] = handler;
      },

      /**
       * Unregisters the default service handler. Future unknown RPC
       * calls will fail silently.
       *
       * @member gadgets.rpc
       */
      unregisterDefault: function() {
        delete services[DEFAULT_NAME];
      },

      /**
       * Forces all subsequent calls to be made by a transport
       * method that allows the caller to verify the message receiver
       * (by way of the parent parameter, through getRelayUrl(...)).
       * At present this means IFPC or WPM.
       * @member gadgets.rpc
       */
      forceParentVerifiable: function() {
        if (!transport.isParentVerifiable()) {
          transport = gadgets.rpctx.ifpc;
        }
      },

      /**
       * Calls an RPC service.
       * @param {string} targetId Module Id of the RPC service provider.
       *                          Empty if calling the parent container.
       * @param {string} serviceName Service name to call.
       * @param {function()|null} callback Callback function (if any) to process
       *                                 the return value of the RPC request.
       * @param {*} var_args Parameters for the RPC request.
       *
       * @member gadgets.rpc
       */
      call: function(targetId, serviceName, callback, var_args) {
        targetId = targetId || '..';
        // Default to the container calling.
        var from = '..';

        if (targetId === '..') {
          from = rpcId;
        } else if (targetId.charAt(0) == '/') {
          // sending to sibling
          from = makeSiblingId(rpcId, gadgets.rpc.getOrigin(window.location.href));
        }

        ++callId;
        if (callback) {
          callbacks[callId] = callback;
        }

        var rpc = {
          's': serviceName,
          'f': from,
          'c': callback ? callId : 0,
          'a': Array.prototype.slice.call(arguments, 3),
          't': authToken[targetId],
          'l': !!useLegacyProtocol[targetId]
        };

        var referrer = getReferrer(targetId);
        if (referrer) {
          rpc['r'] = referrer;
        }

        if (targetId !== '..' &&
            parseSiblingId(targetId) == null &&  // sibling never in the document
            !document.getElementById(targetId)) {
          // The target has been removed from the DOM. Don't even try.
          return;
        }

        // If target is on the same domain, call method directly
        if (callSameDomain(targetId, rpc)) {
          return;
        }

        // Attempt to make call via a cross-domain transport.
        // Retrieve the transport for the given target - if one
        // target is misconfigured, it won't affect the others.
        // In the case of a sibling relay, channel is not found
        // in the receiverTx map but in the transport itself.
        var channel = receiverTx[targetId];
        if (!channel && parseSiblingId(targetId) !== null) {
          // Sibling-to-sibling communication; use default trasport
          // (in practice, wpm) despite not being ready()-indicated.
          channel = transport;
        }

        if (!channel) {
          // Not set up yet. Enqueue the rpc for such time as it is.
          if (!earlyRpcQueue[targetId]) {
            earlyRpcQueue[targetId] = [rpc];
          } else {
            earlyRpcQueue[targetId].push(rpc);
          }
          return;
        }

        // If we are told to use the legacy format, then we must
        // default to IFPC.
        if (useLegacyProtocol[targetId]) {
          channel = gadgets.rpctx.ifpc;
        }

        if (channel.call(targetId, from, rpc) === false) {
          // Fall back to IFPC. This behavior may be removed as IFPC is as well.
          receiverTx[targetId] = fallbackTransport;
          transport.call(targetId, from, rpc);
        }
      },

      getRelayUrl: getRelayUrl,
      setRelayUrl: setRelayUrl,
      setAuthToken: setAuthToken,
      setupReceiver: setupReceiver,
      getAuthToken: getAuthToken,

      // Note: Does not delete iframe
      removeReceiver: function(receiverId) {
        delete relayUrl[receiverId];
        delete useLegacyProtocol[receiverId];
        delete authToken[receiverId];
        delete setup[receiverId];
        delete sameDomain[receiverId];
        delete receiverTx[receiverId];
      },

      /**
       * Gets the RPC relay mechanism.
       * @return {string} RPC relay mechanism. See above for
       *   a list of supported types.
       *
       * @member gadgets.rpc
       */
      getRelayChannel: function() {
        return transport.getCode();
      },

      /**
       * Receives and processes an RPC request. (Not to be used directly.)
       * Only used by IFPC.
       * @param {Array.<string>} fragment An RPC request fragment encoded as
       *        an array. The first 4 elements are target id, source id & call id,
       *        total packet number, packet id. The last element stores the actual
       *        JSON-encoded and URI escaped packet data.
       *
       * @member gadgets.rpc
       * @deprecated
       */
      receive: function(fragment, otherWindow) {
        if (fragment.length > 4) {
          transport._receiveMessage(fragment, process);
        } else {
          relayOnload.apply(null, fragment.concat(otherWindow));
        }
      },

      /**
       * Receives and processes an RPC request sent via the same domain.
       * (Not to be used directly). Converts the inbound rpc object's
       * Array into a local Array to pass the process() Array test.
       * @param {Object} rpc RPC object containing all request params.
       * @member gadgets.rpc
       */
      receiveSameDomain: function(rpc) {
        // Pass through to local process method but converting to a local Array
        rpc['a'] = Array.prototype.slice.call(rpc['a']);
        window.setTimeout(function() { process(rpc); }, 0);
      },

      // Helper method to get the protocol://host:port of an input URL.
      // see docs above
      getOrigin: getOrigin,
      getTargetOrigin: getTargetOrigin,

      /**
       * Internal-only method used to initialize gadgets.rpc.
       * @member gadgets.rpc
       */
      init: function() {
        // Conduct any global setup necessary for the chosen transport.
        // Do so after gadgets.rpc definition to allow transport to access
        // gadgets.rpc methods.
        if (transport.init(process, transportReady) === false) {
          transport = fallbackTransport;
        }
        if (isChild) {
          setupReceiver('..');
        } else {
          gadgets.config.register('rpc', null, function(config) {
            var cfg = config['rpc'] || {};
            setReferrerConfig(cfg);
            setLegacyProtocolConfig(cfg);
          });
        }
      },

      /** Returns the window keyed by the ID. null/".." for parent, else child */
      _getTargetWin: getTargetWin,

      /** Parses a sibling id into {id: <siblingId>, origin: <siblingOrigin>} */
      _parseSiblingId: parseSiblingId,

      ACK: ACK,

      RPC_ID: rpcId || '..',

      SEC_ERROR_LOAD_TIMEOUT: LOAD_TIMEOUT,
      SEC_ERROR_FRAME_PHISH: FRAME_PHISH,
      SEC_ERROR_FORGED_MSG: FORGED_MSG
    };
  }();

  // Initialize library/transport.
  gadgets.rpc.init();

} // !end of double-inclusion guard




/* =============================== setprefs.js ============================= */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/*global gadgets */

/**
 * @fileoverview This library augments gadgets.Prefs with functionality
 * to store prefs dynamically.
 */

/**
 * Stores a preference.
 * @param {string | Object} key The pref to store.
 * @param {string} value The values to store.
 * @private This feature is documented in prefs.js
 */
gadgets.Prefs.prototype.set = function(key, value) {
  var needUpdate = false;
  if (arguments.length > 2) {
    // For backwards compatibility. This can take the form:
    // prefs.set(key0, value0, key1, value1, key2, value2);

    // prefs.set({key0: value0, key1: value1, key2: value2});
    var obj = {};
    for (var i = 0, j = arguments.length; i < j; i += 2) {
      obj[arguments[i]] = arguments[i + 1];
    }
    needUpdate = gadgets.Prefs.setInternal_(obj);
  } else {
    needUpdate = gadgets.Prefs.setInternal_(key, value);
  }
  if (!needUpdate) {
    return;
  }

  var args = [
    null, // go to parent
    'set_pref', // service name
    null, // no callback
    gadgets.util.getUrlParameters()['ifpctok'] ||
        gadgets.util.getUrlParameters()['rpctoken'] || 0 // Legacy IFPC "security".
  ].concat(Array.prototype.slice.call(arguments));

  gadgets.rpc.call.apply(gadgets.rpc, args);
};

/**
 * Stores a preference from the given list.
 * @param {string} key The pref to store.
 * @param {Array.<string | number>} val The values to store.
 * @private This feature is documented in prefs.js
 */
gadgets.Prefs.prototype.setArray = function(key, val) {
  // We must escape pipe (|) characters to ensure that decoding in
  // getArray actually works properly.
  for (var i = 0, j = val.length; i < j; ++i) {
    if (typeof val[i] !== 'number') {
      val[i] = val[i].replace(/\|/g, '%7C');
    }
  }
  this.set(key, val.join('|'));
};



