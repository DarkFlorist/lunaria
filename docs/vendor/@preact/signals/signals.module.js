import{Component as n,options as i}from"preact";import{useMemo as r,useRef as t,useEffect as f}from"preact/hooks";import{Signal as o,computed as e,signal as u,effect as a}from"@preact/signals-core";export{Signal,batch,computed,effect,signal}from"@preact/signals-core";var c,v;function s(n,r){i[n]=r.bind(null,i[n]||function(){})}function l(n){if(v)v();v=n&&n.S()}function p(n){var i=this,t=n.data,f=_(t);f.value=t;var o=r(function(){var n=i.__v;while(n=n.__)if(n.__c){n.__c.__$f|=4;break}i.__$u.c=function(){i.base.data=o.peek()};return e(function(){var n=f.value.value;return 0===n?0:!0===n?"":n||""})},[]);return o.value}p.displayName="_st";Object.defineProperties(o.prototype,{constructor:{configurable:!0},type:{configurable:!0,value:p},props:{configurable:!0,get:function(){return{data:this}}},__b:{configurable:!0,value:1}});s("__b",function(n,i){if("string"==typeof i.type){var r,t=i.props;for(var f in t)if("children"!==f){var e=t[f];if(e instanceof o){if(!r)i.__np=r={};r[f]=e;t[f]=e.peek()}}}n(i)});s("__r",function(n,i){l();var r,t=i.__c;if(t){t.__$f&=-2;if(void 0===(r=t.__$u))t.__$u=r=function(n){var i;a(function(){i=this});i.c=function(){t.__$f|=1;t.setState({})};return i}()}c=t;l(r);n(i)});s("__e",function(n,i,r,t){l();c=void 0;n(i,r,t)});s("diffed",function(n,i){l();c=void 0;var r;if("string"==typeof i.type&&(r=i.__e)){var t=i.__np,f=i.props;if(t){var o=r.U;if(o)for(var e in o){var u=o[e];if(void 0!==u&&!(e in t)){u.d();o[e]=void 0}}else r.U=o={};for(var a in t){var v=o[a],s=t[a];if(void 0===v){v=d(r,a,s,f);o[a]=v}else v.o(s,f)}}}n(i)});function d(n,i,r,t){var f=i in n&&void 0===n.ownerSVGElement,o=u(r);return{o:function(n,i){o.value=n;t=i},d:a(function(){var r=o.value.value;if(t[i]!==r){t[i]=r;if(f)n[i]=r;else if(r)n.setAttribute(i,r);else n.removeAttribute(i)}})}}s("unmount",function(n,i){if("string"==typeof i.type){var r=i.__e;if(r){var t=r.U;if(t){r.U=void 0;for(var f in t){var o=t[f];if(o)o.d()}}}}else{var e=i.__c;if(e){var u=e.__$u;if(u){e.__$u=void 0;u.d()}}}n(i)});s("__h",function(n,i,r,t){if(t<3)i.__$f|=2;n(i,r,t)});n.prototype.shouldComponentUpdate=function(n,i){var r=this.__$u;if(!(r&&void 0!==r.s||4&this.__$f))return!0;if(3&this.__$f)return!0;for(var t in i)return!0;for(var f in n)if("__source"!==f&&n[f]!==this.props[f])return!0;for(var o in this.props)if(!(o in n))return!0;return!1};function _(n){return r(function(){return u(n)},[])}function h(n){var i=t(n);i.current=n;c.__$f|=4;return r(function(){return e(function(){return i.current()})},[])}function g(n){var i=t(n);i.current=n;f(function(){return a(function(){i.current()})},[])}export{h as useComputed,_ as useSignal,g as useSignalEffect};//# sourceMappingURL=signals.module.js.map