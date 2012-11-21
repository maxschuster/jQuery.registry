/*
 * Copyright 2012 Max Schuster 
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function($) {

    var registry = {};
    
    /**
     * Global registry for values
     * @param {String} app Name of the app
     * @param {String|Array|Object} key
     * If String:
     * Certain key to get or set
     * If Array:
     * List of keys to get from registry, like ['key1', 'key2']
     * If Object:
     * List of keys and values to set in the registry, like
     * {'key1':1, 'key2':2}
     * @param {*} value New value
     * If key is String value will be used as value for this key,
     * otherwise it must not be set
     * @returns {String|Object|undefined}
     */
    $.registry = function(app) {
        /**
         * Check jQuery Tiny Pub/Sub support
         */
        var pubsub = typeof $.publish === 'function';
        
        /**
         * Gets the value of a certain key from the registry
         * @param {String} app Name of the app
         * @param {String} key Certain key
         * @returns {*|undefined} Value of key
         */
        function getKey(app, key) {
            if (registry[app] && registry[app][key]) {
                return registry[app][key];
            }
            return undefined;
        }

        /**
         * Sets the value of a certain key in the registry
         * @param {String} app Name of the app
         * @param {String} key Certain key
         * @param {*} value New value
         */
        function setKey(app, key, value) {
            var reg;
            if (!registry[app]) {
                reg = registry[app] = {};
            } else {
                reg = registry[app];
            }
            if (reg[key] !== value) {
                if (pubsub) {
                    $.publish('/registry/' + app + '/' + key, {
                        app: app,
                        key: key,
                        value: value
                    });
                }
                reg[key] = value;
            }
        }
        
        var argCount = arguments.length;

        if (argCount === 2) {
            if (typeof arguments[1] === 'string') {
                return getKey(app, arguments[1]);
            } else if (Object.prototype.toString.call(arguments[1]) === '[object Array]') {
                var result = {};
                $.each(arguments[1], function(k,v) {
                    result[v] = getKey(app, v);
                });
                return result;
            } else if (typeof arguments[1] === 'object') {
                $.each(arguments[1], function(k, v) {
                    setKey(app, k, v);
                });
                return;
            }
        } else if (argCount === 3 && typeof arguments[1] === 'string') {
            setKey(app, arguments[1], arguments[2]);
            return;
        }
        throw new Error('Invalid arguments');
    };

})(jQuery);