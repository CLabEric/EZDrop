(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["register"],{"73cf":function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"register"}},[e._m(0),r("form",{on:{submit:function(t){return t.preventDefault(),e.handleForm.apply(null,arguments)}}},[r("label",[e._v("User Name")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"name"}],attrs:{type:"text",required:""},domProps:{value:e.name},on:{input:function(t){t.target.composing||(e.name=t.target.value)}}}),r("label",[e._v("Email")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.email,expression:"email"}],attrs:{type:"email",required:""},domProps:{value:e.email},on:{input:function(t){t.target.composing||(e.email=t.target.value)}}}),r("label",[e._v("Password")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.password,expression:"password"}],attrs:{type:"password",required:""},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value)}}}),e.passwordError?r("div",{staticClass:"error"},[e._v(e._s(e.passwordError))]):e._e(),e._m(1)])])},a=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"register"},[r("h1",[e._v("register page")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"submit"},[r("button",[e._v("Register")])])}],s=r("1da1"),o=(r("96cf"),r("d3b7"),r("e9c4"),r("bc3a")),i=r.n(o),c="https://easydrop.herokuapp.com/",u={data:function(){return{name:"",email:"",password:"",passwordError:"",fetchResults:[]}},created:function(){this.checkAuth()},mounted:function(){},methods:{handleForm:function(e){var t=this;this.passwordError=this.password.length>5?"":"Password must be at least 6 characters long",fetch("".concat(c,"register"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uname:e.target[0].value,email:e.target[1].value,pw:e.target[2].value})}).then(function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(r){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,r.text();case 2:if(n=e.sent,r.ok){e.next=7;break}throw n;case 7:t.$router.push("login");case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())["catch"]((function(e){console.error("throw error",e)}))},checkAuth:function(){i()({method:"get",url:"".concat(c,"register"),responseType:"text",withCredentials:!0}).then(function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(t){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.data;case 2:if(r=e.sent,"OK"!==!t.statusText){e.next=7;break}throw r;case 7:case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())["catch"]((function(e){console.error("throw error",e)}))}}},l=u,p=(r("d1c1"),r("2877")),d=Object(p["a"])(l,n,a,!1,null,"76d4c372",null);t["default"]=d.exports},"7cb8":function(e,t,r){},d1c1:function(e,t,r){"use strict";r("7cb8")}}]);
//# sourceMappingURL=register.4d1f119a.js.map