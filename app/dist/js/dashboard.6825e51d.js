(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["dashboard"],{"0cb2":function(e,t,r){var n=r("e330"),a=r("7b0b"),i=Math.floor,o=n("".charAt),c=n("".replace),s=n("".slice),u=/\$([$&'`]|\d{1,2}|<[^>]*>)/g,d=/\$([$&'`]|\d{1,2})/g;e.exports=function(e,t,r,n,l,p){var f=r+e.length,v=n.length,m=d;return void 0!==l&&(l=a(l),m=u),c(p,m,(function(a,c){var u;switch(o(c,0)){case"$":return"$";case"&":return e;case"`":return s(t,0,r);case"'":return s(t,f);case"<":u=l[s(c,1,-1)];break;default:var d=+c;if(0===d)return a;if(d>v){var p=i(d/10);return 0===p?a:p<=v?void 0===n[p-1]?o(c,1):n[p-1]+o(c,1):a}u=n[d-1]}return void 0===u?"":u}))}},"107c":function(e,t,r){var n=r("d039"),a=r("da84"),i=a.RegExp;e.exports=n((function(){var e=i("(?<a>b)","g");return"b"!==e.exec("b").groups.a||"bc"!=="b".replace(e,"$<a>c")}))},"14c3":function(e,t,r){var n=r("da84"),a=r("c65b"),i=r("825a"),o=r("1626"),c=r("c6b6"),s=r("9263"),u=n.TypeError;e.exports=function(e,t){var r=e.exec;if(o(r)){var n=a(r,e,t);return null!==n&&i(n),n}if("RegExp"===c(e))return a(s,e,t);throw u("RegExp#exec called on incompatible receiver")}},"26e9":function(e,t,r){"use strict";var n=r("23e7"),a=r("e330"),i=r("e8b5"),o=a([].reverse),c=[1,2];n({target:"Array",proto:!0,forced:String(c)===String(c.reverse())},{reverse:function(){return i(this)&&(this.length=this.length),o(this)}})},5319:function(e,t,r){"use strict";var n=r("2ba4"),a=r("c65b"),i=r("e330"),o=r("d784"),c=r("d039"),s=r("825a"),u=r("1626"),d=r("5926"),l=r("50c4"),p=r("577e"),f=r("1d80"),v=r("8aa5"),m=r("dc4a"),g=r("0cb2"),h=r("14c3"),x=r("b622"),b=x("replace"),w=Math.max,I=Math.min,_=i([].concat),y=i([].push),$=i("".indexOf),E=i("".slice),R=function(e){return void 0===e?e:String(e)},C=function(){return"$0"==="a".replace(/./,"$0")}(),N=function(){return!!/./[b]&&""===/./[b]("a","$0")}(),k=!c((function(){var e=/./;return e.exec=function(){var e=[];return e.groups={a:"7"},e},"7"!=="".replace(e,"$<a>")}));o("replace",(function(e,t,r){var i=N?"$":"$0";return[function(e,r){var n=f(this),i=void 0==e?void 0:m(e,b);return i?a(i,e,n,r):a(t,p(n),e,r)},function(e,a){var o=s(this),c=p(e);if("string"==typeof a&&-1===$(a,i)&&-1===$(a,"$<")){var f=r(t,o,c,a);if(f.done)return f.value}var m=u(a);m||(a=p(a));var x=o.global;if(x){var b=o.unicode;o.lastIndex=0}var C=[];while(1){var N=h(o,c);if(null===N)break;if(y(C,N),!x)break;var k=p(N[0]);""===k&&(o.lastIndex=v(c,l(o.lastIndex),b))}for(var D="",A=0,P=0;P<C.length;P++){N=C[P];for(var O=p(N[0]),S=w(I(d(N.index),c.length),0),F=[],T=1;T<N.length;T++)y(F,R(N[T]));var U=N.groups;if(m){var q=_([O],F,S,c);void 0!==U&&y(q,U);var M=p(n(a,void 0,q))}else M=g(O,c,S,F,U,a);S>=A&&(D+=E(c,A,S)+M,A=S+O.length)}return D+E(c,A)}]}),!k||!C||N)},7277:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"dashboard"}},[r("h1",[e._v(e._s(e.dropName)+" dashboard")]),r("section",{attrs:{id:"content"}},[r("div",[e.dropId?r("div",[r("form",{on:{submit:function(t){return t.preventDefault(),e.addPiece.apply(null,arguments)}}},[r("div",{staticClass:"imagePreviewWrapper",style:{"background-image":"url("+e.previewImage+")"},on:{click:e.selectImage}}),r("input",{ref:"fileInput",attrs:{type:"file"},on:{input:e.pickFile}}),r("label",[e._v("Name")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"name"}],attrs:{type:"text",required:""},domProps:{value:e.name},on:{input:function(t){t.target.composing||(e.name=t.target.value)}}}),r("label",[e._v("Description")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.description,expression:"description"}],attrs:{type:"text",required:""},domProps:{value:e.description},on:{input:function(t){t.target.composing||(e.description=t.target.value)}}}),r("label",[e._v("Price in Eth")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.price,expression:"price"}],attrs:{type:"number",step:"any",required:""},domProps:{value:e.price},on:{input:function(t){t.target.composing||(e.price=t.target.value)}}}),e._m(0)])]):e._e(),e.dropId?r("div",{staticClass:"withdraw"},[r("button",{on:{click:e.withdrawFunds}},[e._v("withdraw funds")])]):e._e(),e.dropId?e._e():r("div",[e._m(1),r("form",{on:{submit:function(t){return t.preventDefault(),e.createDrop.apply(null,arguments)}}},[r("label",[e._v("Name")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.dropName,expression:"dropName"}],attrs:{type:"text",required:""},domProps:{value:e.dropName},on:{input:function(t){t.target.composing||(e.dropName=t.target.value)}}}),e._m(2)])])]),r("div",{staticClass:"images"},e._l(e.metaData,(function(t){return r("div",{key:t.itemData.name,staticClass:"image"},[r("img",{attrs:{src:"data:image/png;base64,"+t.itemData.image}}),r("div",{staticClass:"name"},[e._v(" "+e._s(t.itemData.name)+" ")])])})),0)])])},a=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"submit"},[r("button",[e._v("Submit")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"drop"},[r("h1",[e._v("Create your Drop")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"submit"},[r("button",[e._v("Submit")])])}],i=r("1da1"),o=(r("96cf"),r("b0c0"),r("a4d3"),r("e01a"),r("ac1f"),r("5319"),r("26e9"),r("d3b7"),r("bc3a")),c=r.n(o),s=r("99e5"),u=r.n(s),d=r("218b"),l=r("7384"),p="https://easydrop.herokuapp.com/";c.a.defaults.withCredentials=!0;var f={data:function(){return{dropId:null,dropName:null,currentImage:null,previewImage:null,name:null,description:null,price:null,web3:null,contract:null,account:null}},created:function(){if(this.getMetadata(),window.ethereum){var e=new u.a(window.ethereum);this.web3=e,this.web3stuff()}else console.warn("No web3 detected.")},computed:{metaData:function(){return this.$store.state.metaData}},methods:{selectImage:function(){this.$refs.fileInput.click()},pickFile:function(e){var t=this;this.currentImage=e.target.files[0];var r=this.$refs.fileInput,n=r.files;if(n&&n[0]){var a=new FileReader;a.onload=function(e){t.previewImage=e.target.result},a.readAsDataURL(n[0]),this.$emit("input",n[0])}},addPiece:function(e){var t=this,r=new FormData;r.append("file",this.currentImage),r.append("name",this.name),r.append("description",this.description),r.append("price",this.price),r.append("dropId",this.dropId),c.a.post("".concat(p,"upload"),r,{headers:{"Content-Type":"multipart/form-data"}}).then((function(e){t.getMetadata(),t.previewImage=null}))["catch"]((function(e){console.error("FAILURE!!",e)}))},createDrop:function(e){var t=this,r=this.dropName,n=r.replace(/'/g,"").replace(/\s/g,"-").toLowerCase();c.a.post("".concat(p,"create-drop"),{name:r,urlParam:n}).then((function(e){t.dropId=e.data._id}))["catch"]((function(e){return console.error("FAILURE!!",e)}))},getMetadata:function(){var e=this;c()({method:"get",url:"".concat(p,"dashboard"),responseType:"text",withCredentials:!0}).then((function(t){console.log(t),"empty"===t.data?console.log("no drops for this user yet"):(e.$store.state.metaData=t.data.nfts.reverse(),e.dropId=t.data.drop.id,e.dropName=t.data.drop.name,e.$store.state.loggedIn=!0)}))["catch"]((function(t){e.$router.push("/")}))},web3stuff:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var r,n,a,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=e.web3,t.next=3,r.eth.net.getId();case 3:return n=t.sent,a=d.networks[n],t.next=7,window.ethereum.request({method:"eth_requestAccounts"});case 7:i=t.sent,e.contract=4==n?new r.eth.Contract(l,"0x253307D78eA869f60C32d1d2eeb6753aB6fb7643"):new r.eth.Contract(d.abi,a.address),e.account=i[0];case 10:case"end":return t.stop()}}),t)})))()},withdrawFunds:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return console.log("withdrawing"),r=e.contract.methods.withdraw,t.next=4,r().send({from:e.account}).on("receipt",(function(e){console.log(e)}));case 4:case"end":return t.stop()}}),t)})))()}}},v=f,m=(r("e459"),r("2877")),g=Object(m["a"])(v,n,a,!1,null,"5152454e",null);t["default"]=g.exports},"8aa5":function(e,t,r){"use strict";var n=r("6547").charAt;e.exports=function(e,t,r){return t+(r?n(e,t).length:1)}},9263:function(e,t,r){"use strict";var n=r("c65b"),a=r("e330"),i=r("577e"),o=r("ad6d"),c=r("9f7f"),s=r("5692"),u=r("7c73"),d=r("69f3").get,l=r("fce3"),p=r("107c"),f=s("native-string-replace",String.prototype.replace),v=RegExp.prototype.exec,m=v,g=a("".charAt),h=a("".indexOf),x=a("".replace),b=a("".slice),w=function(){var e=/a/,t=/b*/g;return n(v,e,"a"),n(v,t,"a"),0!==e.lastIndex||0!==t.lastIndex}(),I=c.UNSUPPORTED_Y||c.BROKEN_CARET,_=void 0!==/()??/.exec("")[1],y=w||_||I||l||p;y&&(m=function(e){var t,r,a,c,s,l,p,y=this,$=d(y),E=i(e),R=$.raw;if(R)return R.lastIndex=y.lastIndex,t=n(m,R,E),y.lastIndex=R.lastIndex,t;var C=$.groups,N=I&&y.sticky,k=n(o,y),D=y.source,A=0,P=E;if(N&&(k=x(k,"y",""),-1===h(k,"g")&&(k+="g"),P=b(E,y.lastIndex),y.lastIndex>0&&(!y.multiline||y.multiline&&"\n"!==g(E,y.lastIndex-1))&&(D="(?: "+D+")",P=" "+P,A++),r=new RegExp("^(?:"+D+")",k)),_&&(r=new RegExp("^"+D+"$(?!\\s)",k)),w&&(a=y.lastIndex),c=n(v,N?r:y,P),N?c?(c.input=b(c.input,A),c[0]=b(c[0],A),c.index=y.lastIndex,y.lastIndex+=c[0].length):y.lastIndex=0:w&&c&&(y.lastIndex=y.global?c.index+c[0].length:a),_&&c&&c.length>1&&n(f,c[0],r,(function(){for(s=1;s<arguments.length-2;s++)void 0===arguments[s]&&(c[s]=void 0)})),c&&C)for(c.groups=l=u(null),s=0;s<C.length;s++)p=C[s],l[p[0]]=c[p[1]];return c}),e.exports=m},"9e78":function(e,t,r){},"9f7f":function(e,t,r){var n=r("d039"),a=r("da84"),i=a.RegExp;t.UNSUPPORTED_Y=n((function(){var e=i("a","y");return e.lastIndex=2,null!=e.exec("abcd")})),t.BROKEN_CARET=n((function(){var e=i("^r","gy");return e.lastIndex=2,null!=e.exec("str")}))},ac1f:function(e,t,r){"use strict";var n=r("23e7"),a=r("9263");n({target:"RegExp",proto:!0,forced:/./.exec!==a},{exec:a})},ad6d:function(e,t,r){"use strict";var n=r("825a");e.exports=function(){var e=n(this),t="";return e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e.unicode&&(t+="u"),e.sticky&&(t+="y"),t}},d784:function(e,t,r){"use strict";r("ac1f");var n=r("e330"),a=r("6eeb"),i=r("9263"),o=r("d039"),c=r("b622"),s=r("9112"),u=c("species"),d=RegExp.prototype;e.exports=function(e,t,r,l){var p=c(e),f=!o((function(){var t={};return t[p]=function(){return 7},7!=""[e](t)})),v=f&&!o((function(){var t=!1,r=/a/;return"split"===e&&(r={},r.constructor={},r.constructor[u]=function(){return r},r.flags="",r[p]=/./[p]),r.exec=function(){return t=!0,null},r[p](""),!t}));if(!f||!v||r){var m=n(/./[p]),g=t(p,""[e],(function(e,t,r,a,o){var c=n(e),s=t.exec;return s===i||s===d.exec?f&&!o?{done:!0,value:m(t,r,a)}:{done:!0,value:c(r,t,a)}:{done:!1}}));a(String.prototype,e,g[0]),a(d,p,g[1])}l&&s(d[p],"sham",!0)}},e459:function(e,t,r){"use strict";r("9e78")},fce3:function(e,t,r){var n=r("d039"),a=r("da84"),i=a.RegExp;e.exports=n((function(){var e=i(".","s");return!(e.dotAll&&e.exec("\n")&&"s"===e.flags)}))}}]);
//# sourceMappingURL=dashboard.6825e51d.js.map