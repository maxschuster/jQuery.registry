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

(function($){
    
    var registry = {},
        $reg = $({});
        
    $.registry = function () {
        function getKey(app, key) {
            if (registry[app] && registry[app][key]) {
                return registry[app][key];
            }
            return undefined;
        }
        function setKey(app, key, value) {
            var reg;
            if (!registry[app]) {
                reg = registry[app] = {};
            } else {
                reg = registry[app];
            }
            if (reg[key] !== value) {
                $reg.trigger(app + '/' + key + '.registry', {
                    key: key,
                    app: app,
                    value: value
                });
                reg[key] = value;
            }
            
        }
        var argCount = arguments.length,
                app;
        
        app = arguments[0];
        
        if (argCount === 2) {
            if (typeof arguments[1] === 'string') {
                return getKey(app, arguments[1]);
            } else if (Object.prototype.toString.call(arguments[1]) === '[object Array]') {
                var result = {};
                $.each(arguments[1], function(k,v){
                    result[v] = getKey(app, v);
                });
                return result;
            } else if (typeof arguments[1] === 'object') {
                $.each(arguments[1], function(k,v){
                    setKey(app, k, v);
                });
                return;
            }
        } else if (argCount === 3) {
            setKey(app, arguments[1], arguments[2]);
            return;
        } else if (arguments[0] === 'event') {
            return $reg;
        }
        throw new Error('Invalid arguments');
    };
    
})(jQuery);