;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="bf26b1ce-41a4-2dbb-3aa2-ee8d9caa561d")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,223977,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return i}});let o=e.r(389959);function i(e,t){let r=(0,o.useRef)(null),i=(0,o.useRef)(null);return(0,o.useCallback)(o=>{if(null===o){let e=r.current;e&&(r.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(r.current=a(e,o)),t&&(i.current=a(t,o))},[e,t])}function a(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},349324,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useIntersection",{enumerable:!0,get:function(){return l}});let o=e.r(389959),i=e.r(33837),a="function"==typeof IntersectionObserver,n=new Map,s=[];function l({rootRef:e,rootMargin:t,disabled:r}){let l=r||!a,[d,u]=(0,o.useState)(!1),c=(0,o.useRef)(null),f=(0,o.useCallback)(e=>{c.current=e},[]);return(0,o.useEffect)(()=>{if(a){if(l||d)return;let r=c.current;if(r&&r.tagName)return function(e,t,r){let{id:o,observer:i,elements:a}=function(e){let t,r={root:e.root||null,margin:e.rootMargin||""},o=s.find(e=>e.root===r.root&&e.margin===r.margin);if(o&&(t=n.get(o)))return t;let i=new Map;return t={id:r,observer:new IntersectionObserver(e=>{e.forEach(e=>{let t=i.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e),elements:i},s.push(r),n.set(r,t),t}(r);return a.set(e,t),i.observe(e),function(){if(a.delete(e),i.unobserve(e),0===a.size){i.disconnect(),n.delete(o);let e=s.findIndex(e=>e.root===o.root&&e.margin===o.margin);e>-1&&s.splice(e,1)}}}(r,e=>e&&u(e),{root:e?.current,rootMargin:t})}else if(!d){let e=(0,i.requestIdleCallback)(()=>u(!0));return()=>(0,i.cancelIdleCallback)(e)}},[l,t,e,d,c.current]),[f,d,(0,o.useCallback)(()=>{u(!1)},[])]}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},135617,(e,t,r)=>{"use strict";function o(e,t,r,o){return!1}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getDomainLocale",{enumerable:!0,get:function(){return o}}),e.r(359481),("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},355174,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return o}});let o=e=>{}},599891,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o={default:function(){return z},useLinkStatus:function(){return C}};for(var i in o)Object.defineProperty(r,i,{enumerable:!0,get:o[i]});let a=e.r(887602),n=e.r(478902),s=a._(e.r(389959)),l=e.r(14928),d=e.r(222650),u=e.r(303344),c=e.r(142779),f=e.r(227035),p=e.r(206273),g=e.r(349324),b=e.r(135617),m=e.r(979260),h=e.r(223977);e.r(355174);let x=new Set;function v(e,t,r,o){if(!("u"<typeof window)&&(0,d.isLocalURL)(t)){if(!o.bypassPrefetchedCheck){let i=t+"%"+r+"%"+(void 0!==o.locale?o.locale:"locale"in e?e.locale:void 0);if(x.has(i))return;x.add(i)}e.prefetch(t,r,o).catch(e=>{})}}function y(e){return"string"==typeof e?e:(0,u.formatUrl)(e)}let w=s.default.forwardRef(function(e,t){let r,o,{href:i,as:a,children:u,prefetch:x=null,passHref:w,replace:_,shallow:C,scroll:z,locale:P,onClick:M,onNavigate:E,onMouseEnter:R,onTouchStart:S,legacyBehavior:O=!1,...T}=e;r=u,O&&("string"==typeof r||"number"==typeof r)&&(r=(0,n.jsx)("a",{children:r}));let j=s.default.useContext(p.RouterContext),k=!1!==x,{href:I,as:A}=s.default.useMemo(()=>{if(!j){let e=y(i);return{href:e,as:a?y(a):e}}let[e,t]=(0,l.resolveHref)(j,i,!0);return{href:e,as:a?(0,l.resolveHref)(j,a):t||e}},[j,i,a]),L=s.default.useRef(I),N=s.default.useRef(A);O&&(o=s.default.Children.only(r));let U=O?o&&"object"==typeof o&&o.ref:t,[$,K,D]=(0,g.useIntersection)({rootMargin:"200px"}),B=s.default.useCallback(e=>{(N.current!==A||L.current!==I)&&(D(),N.current=A,L.current=I),$(e)},[A,I,D,$]),G=(0,h.useMergedRef)(B,U);s.default.useEffect(()=>{!j||K&&k&&v(j,I,A,{locale:P})},[A,I,K,P,k,j?.locale,j]);let Q={ref:G,onClick(e){O||"function"!=typeof M||M(e),O&&o.props&&"function"==typeof o.props.onClick&&o.props.onClick(e),!j||e.defaultPrevented||function(e,t,r,o,i,a,n,s,l){let u,{nodeName:c}=e.currentTarget;if(!("A"===c.toUpperCase()&&((u=e.currentTarget.getAttribute("target"))&&"_self"!==u||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which)||e.currentTarget.hasAttribute("download"))){if(!(0,d.isLocalURL)(r)){i&&(e.preventDefault(),location.replace(r));return}e.preventDefault(),(()=>{if(l){let e=!1;if(l({preventDefault:()=>{e=!0}}),e)return}let e=n??!0;"beforePopState"in t?t[i?"replace":"push"](r,o,{shallow:a,locale:s,scroll:e}):t[i?"replace":"push"](o||r,{scroll:e})})()}}(e,j,I,A,_,C,z,P,E)},onMouseEnter(e){O||"function"!=typeof R||R(e),O&&o.props&&"function"==typeof o.props.onMouseEnter&&o.props.onMouseEnter(e),j&&v(j,I,A,{locale:P,priority:!0,bypassPrefetchedCheck:!0})},onTouchStart:function(e){O||"function"!=typeof S||S(e),O&&o.props&&"function"==typeof o.props.onTouchStart&&o.props.onTouchStart(e),j&&v(j,I,A,{locale:P,priority:!0,bypassPrefetchedCheck:!0})}};if((0,c.isAbsoluteUrl)(A))Q.href=A;else if(!O||w||"a"===o.type&&!("href"in o.props)){let e=void 0!==P?P:j?.locale;Q.href=j?.isLocaleDomain&&(0,b.getDomainLocale)(A,e,j?.locales,j?.domainLocales)||(0,m.addBasePath)((0,f.addLocale)(A,e,j?.defaultLocale))}return O?s.default.cloneElement(o,Q):(0,n.jsx)("a",{...T,...Q,children:r})}),_=(0,s.createContext)({pending:!1}),C=()=>(0,s.useContext)(_),z=w;("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},896088,(e,t,r)=>{t.exports=e.r(599891)},93558,e=>{"use strict";var t=e.i(478902),r=e.i(709520),o=e.i(389959),i=e.i(843778);let a=(0,r.cva)((0,i.cn)("relative w-full text-sm rounded-lg border p-4","[&>svg~*]:pl-10 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg]:w-[23px] [&>svg]:h-[23px] [&>svg]:p-1 [&>svg]:flex [&>svg]:rounded"),{variants:{variant:{default:"bg-surface-200/25 border-default text-foreground [&>svg]:text-background [&>svg]:bg-foreground",destructive:"bg-destructive-200 border-destructive-400 [&>svg]:text-destructive-200 [&>svg]:bg-destructive-600",warning:"bg-warning-200 border-warning-400 [&>svg]:text-warning-200 [&>svg]:bg-warning-600"}},defaultVariants:{variant:"default"}}),n=o.forwardRef(({className:e,variant:r,...o},n)=>(0,t.jsx)("div",{ref:n,role:"alert",className:(0,i.cn)(a({variant:r}),e),...o}));n.displayName="Alert";let s=o.forwardRef(({className:e,...r},o)=>(0,t.jsx)("h5",{ref:o,className:(0,i.cn)("mb-0.5",e),...r}));s.displayName="AlertTitle";let l=o.forwardRef(({className:e,children:r,...o},a)=>{let n="string"==typeof r||"number"==typeof r?(0,t.jsx)("p",{children:r}):r;return(0,t.jsx)("div",{ref:a,className:(0,i.cn)("text-sm text-foreground-light font-normal","mb-0.5","[&_p]:mb-0.5 [&_p:last-child]:mb-0",e),...o,children:n})});l.displayName="AlertDescription",e.s(["Alert",()=>n,"AlertDescription",()=>l,"AlertTitle",()=>s,"alertVariants",0,a])},206413,e=>{"use strict";var t=e.i(93558);e.s(["AlertDescription_Shadcn_",()=>t.AlertDescription])},592360,e=>{"use strict";var t=e.i(93558);e.s(["AlertTitle_Shadcn_",()=>t.AlertTitle])},178527,e=>{"use strict";var t=e.i(93558);e.s(["Alert_Shadcn_",()=>t.Alert])},710483,e=>{"use strict";var t=e.i(478902),r=e.i(709520),o=e.i(389959),i=e.i(178527),a=e.i(206413),n=e.i(592360),s=e.i(843778);let l={note:"default",tip:"default",caution:"warning",danger:"destructive",deprecation:"warning",default:"default",warning:"warning",destructive:"destructive"},d=()=>(0,t.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 21 20",className:"w-6 h-6",fill:"currentColor",children:(0,t.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M0.625 9.8252C0.625 4.44043 4.99023 0.0751953 10.375 0.0751953C15.7598 0.0751953 20.125 4.44043 20.125 9.8252C20.125 15.21 15.7598 19.5752 10.375 19.5752C4.99023 19.5752 0.625 15.21 0.625 9.8252ZM9.3584 4.38135C9.45117 4.28857 9.55518 4.20996 9.66699 4.14648C9.88086 4.02539 10.1245 3.96045 10.375 3.96045C10.5845 3.96045 10.7896 4.00586 10.9766 4.09229C11.1294 4.1626 11.2705 4.26025 11.3916 4.38135C11.6611 4.65088 11.8125 5.0166 11.8125 5.39795C11.8125 5.5249 11.7959 5.6499 11.7637 5.77002C11.6987 6.01172 11.5718 6.23438 11.3916 6.41455C11.1221 6.68408 10.7563 6.83545 10.375 6.83545C9.99365 6.83545 9.62793 6.68408 9.3584 6.41455C9.08887 6.14502 8.9375 5.7793 8.9375 5.39795C8.9375 5.29492 8.94873 5.19287 8.97021 5.09375C9.02783 4.82568 9.16162 4.57812 9.3584 4.38135ZM10.375 15.6899C10.0933 15.6899 9.82275 15.5781 9.62354 15.3789C9.42432 15.1797 9.3125 14.9092 9.3125 14.6274V9.31494C9.3125 9.0332 9.42432 8.7627 9.62354 8.56348C9.82275 8.36426 10.0933 8.25244 10.375 8.25244C10.6567 8.25244 10.9272 8.36426 11.1265 8.56348C11.3257 8.7627 11.4375 9.0332 11.4375 9.31494V14.6274C11.4375 14.7944 11.3979 14.9575 11.3242 15.104C11.2739 15.2046 11.2075 15.2979 11.1265 15.3789C10.9272 15.5781 10.6567 15.6899 10.375 15.6899Z"})}),u=()=>(0,t.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 22 20",className:"w-6 h-6",fill:"currentColor",children:(0,t.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M8.15137 1.95117C9.30615 -0.0488281 12.1943 -0.0488281 13.3481 1.95117L20.7031 14.6992C21.8574 16.6992 20.4131 19.1992 18.104 19.1992H3.39502C1.08594 19.1992 -0.356933 16.6992 0.797364 14.6992L8.15137 1.95117ZM11.7666 16.0083C11.4971 16.2778 11.1313 16.4292 10.75 16.4292C10.3687 16.4292 10.0029 16.2778 9.7334 16.0083C9.46387 15.7388 9.3125 15.373 9.3125 14.9917C9.3125 14.9307 9.31641 14.8706 9.32373 14.811C9.33545 14.7197 9.35547 14.6304 9.38379 14.5439L9.41406 14.4609C9.48584 14.2803 9.59375 14.1147 9.7334 13.9751C10.0029 13.7056 10.3687 13.5542 10.75 13.5542C11.1313 13.5542 11.4971 13.7056 11.7666 13.9751C12.0361 14.2446 12.1875 14.6104 12.1875 14.9917C12.1875 15.373 12.0361 15.7388 11.7666 16.0083ZM10.75 4.69971C11.0317 4.69971 11.3022 4.81152 11.5015 5.01074C11.7007 5.20996 11.8125 5.48047 11.8125 5.76221V11.0747C11.8125 11.3564 11.7007 11.627 11.5015 11.8262C11.3022 12.0254 11.0317 12.1372 10.75 12.1372C10.4683 12.1372 10.1978 12.0254 9.99854 11.8262C9.79932 11.627 9.6875 11.3564 9.6875 11.0747V5.76221C9.6875 5.48047 9.79932 5.20996 9.99854 5.01074C10.1978 4.81152 10.4683 4.69971 10.75 4.69971Z"})}),c=(0,r.cva)("",{variants:{type:{default:"[&>svg]:bg-foreground-muted",warning:"",destructive:""}}}),f=(0,o.forwardRef)(({type:e="note",variant:r,showIcon:o=!0,label:f,title:p,description:g,children:b,layout:m="vertical",actions:h,childProps:x={},icon:v,...y},w)=>{let _=r?l[r]:l[e];return(0,t.jsxs)(i.Alert_Shadcn_,{ref:w,variant:_,...y,className:(0,s.cn)("overflow-hidden","responsive"===m&&"@container",c({type:_}),y.className),children:[v||(o&&"warning"===_||"destructive"===_?(0,t.jsx)(u,{}):o?(0,t.jsx)(d,{}):null),(0,t.jsxs)("div",{className:(0,s.cn)("flex","vertical"===m&&"flex-col","horizontal"===m&&"flex-row items-center justify-between gap-x-6 lg:gap-x-8","responsive"===m&&"flex-col @md:flex-row @md:items-center @md:justify-between @md:gap-x-6 @lg:gap-x-8"),children:[f||p?(0,t.jsxs)("div",{children:[(0,t.jsx)(n.AlertTitle_Shadcn_,{...x.title,className:(0,s.cn)("text mt-0.5 flex gap-3 text-sm",!f&&"flex-col",x.title?.className),children:f||p}),g&&(0,t.jsx)(a.AlertDescription_Shadcn_,{className:x.description?.className,children:g}),b&&(0,t.jsx)(a.AlertDescription_Shadcn_,{...x.description,className:(0,s.cn)("",x?.description?.className),children:b})]}):(0,t.jsx)("div",{className:"text my-0.5 [&_p]:mt-0 [&_p]:mb-1.5 [&_p:last-child]:mb-0",children:b}),h&&(0,t.jsx)("div",{className:(0,s.cn)("flex flex-row gap-3","vertical"===m&&"mt-3 items-start","horizontal"===m&&"items-center","responsive"===m&&"mt-3 items-start @md:mt-0 @md:items-center"),children:h})]})]})});e.s(["Admonition",0,f])},66863,e=>{"use strict";var t=e.i(551390),r=e.i(518516),o=e.i(554532),i=class extends r.Removable{#e;#t;#r;constructor(e){super(),this.mutationId=e.mutationId,this.#t=e.mutationCache,this.#e=[],this.state=e.state||a(),this.setOptions(e.options),this.scheduleGc()}setOptions(e){this.options=e,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(e){this.#e.includes(e)||(this.#e.push(e),this.clearGcTimeout(),this.#t.notify({type:"observerAdded",mutation:this,observer:e}))}removeObserver(e){this.#e=this.#e.filter(t=>t!==e),this.scheduleGc(),this.#t.notify({type:"observerRemoved",mutation:this,observer:e})}optionalRemove(){this.#e.length||("pending"===this.state.status?this.scheduleGc():this.#t.remove(this))}continue(){return this.#r?.continue()??this.execute(this.state.variables)}async execute(e){let t=()=>{this.#o({type:"continue"})};this.#r=(0,o.createRetryer)({fn:()=>this.options.mutationFn?this.options.mutationFn(e):Promise.reject(Error("No mutationFn found")),onFail:(e,t)=>{this.#o({type:"failed",failureCount:e,error:t})},onPause:()=>{this.#o({type:"pause"})},onContinue:t,retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>this.#t.canRun(this)});let r="pending"===this.state.status,i=!this.#r.canStart();try{if(r)t();else{this.#o({type:"pending",variables:e,isPaused:i}),await this.#t.config.onMutate?.(e,this);let t=await this.options.onMutate?.(e);t!==this.state.context&&this.#o({type:"pending",context:t,variables:e,isPaused:i})}let o=await this.#r.start();return await this.#t.config.onSuccess?.(o,e,this.state.context,this),await this.options.onSuccess?.(o,e,this.state.context),await this.#t.config.onSettled?.(o,null,this.state.variables,this.state.context,this),await this.options.onSettled?.(o,null,e,this.state.context),this.#o({type:"success",data:o}),o}catch(t){try{throw await this.#t.config.onError?.(t,e,this.state.context,this),await this.options.onError?.(t,e,this.state.context),await this.#t.config.onSettled?.(void 0,t,this.state.variables,this.state.context,this),await this.options.onSettled?.(void 0,t,e,this.state.context),t}finally{this.#o({type:"error",error:t})}}finally{this.#t.runNext(this)}}#o(e){this.state=(t=>{switch(e.type){case"failed":return{...t,failureCount:e.failureCount,failureReason:e.error};case"pause":return{...t,isPaused:!0};case"continue":return{...t,isPaused:!1};case"pending":return{...t,context:e.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:e.isPaused,status:"pending",variables:e.variables,submittedAt:Date.now()};case"success":return{...t,data:e.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...t,data:void 0,error:e.error,failureCount:t.failureCount+1,failureReason:e.error,isPaused:!1,status:"error"}}})(this.state),t.notifyManager.batch(()=>{this.#e.forEach(t=>{t.onMutationUpdate(e)}),this.#t.notify({mutation:this,type:"updated",action:e})})}};function a(){return{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0}}e.s(["Mutation",()=>i,"getDefaultState",()=>a])},38429,e=>{"use strict";var t=e.i(389959),r=e.i(66863),o=e.i(551390),i=e.i(976149),a=e.i(201844),n=class extends i.Subscribable{#i;#a=void 0;#n;#s;constructor(e,t){super(),this.#i=e,this.setOptions(t),this.bindMethods(),this.#l()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){let t=this.options;this.options=this.#i.defaultMutationOptions(e),(0,a.shallowEqualObjects)(this.options,t)||this.#i.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#n,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,a.hashKey)(t.mutationKey)!==(0,a.hashKey)(this.options.mutationKey)?this.reset():this.#n?.state.status==="pending"&&this.#n.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#n?.removeObserver(this)}onMutationUpdate(e){this.#l(),this.#d(e)}getCurrentResult(){return this.#a}reset(){this.#n?.removeObserver(this),this.#n=void 0,this.#l(),this.#d()}mutate(e,t){return this.#s=t,this.#n?.removeObserver(this),this.#n=this.#i.getMutationCache().build(this.#i,this.options),this.#n.addObserver(this),this.#n.execute(e)}#l(){let e=this.#n?.state??(0,r.getDefaultState)();this.#a={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#d(e){o.notifyManager.batch(()=>{if(this.#s&&this.hasListeners()){let t=this.#a.variables,r=this.#a.context;e?.type==="success"?(this.#s.onSuccess?.(e.data,t,r),this.#s.onSettled?.(e.data,null,t,r)):e?.type==="error"&&(this.#s.onError?.(e.error,t,r),this.#s.onSettled?.(void 0,e.error,t,r))}this.listeners.forEach(e=>{e(this.#a)})})}},s=e.i(356003);function l(e,r){let i=(0,s.useQueryClient)(r),[l]=t.useState(()=>new n(i,e));t.useEffect(()=>{l.setOptions(e)},[l,e]);let d=t.useSyncExternalStore(t.useCallback(e=>l.subscribe(o.notifyManager.batchCalls(e)),[l]),()=>l.getCurrentResult(),()=>l.getCurrentResult()),u=t.useCallback((e,t)=>{l.mutate(e,t).catch(a.noop)},[l]);if(d.error&&(0,a.shouldThrowError)(l.options.throwOnError,[d.error]))throw d.error;return{...d,mutate:u,mutateAsync:d.mutate}}e.s(["useMutation",()=>l],38429)},892354,e=>{"use strict";let t=e.i(109294).gotrueClient,r="/organizations",o=async e=>{try{let{data:r,error:o}=await t.getClaims(e.replace(/bearer /i,""));if(o)throw o;return{claims:r?.claims??null,error:null}}catch(e){return console.error(e),{claims:null,error:e}}};e.s(["auth",0,t,"buildPathWithParams",0,e=>{let[t,r]=e.split("?",2),o=new URLSearchParams(r||""),i=new URLSearchParams(location.search);for(let[e,t]of o.entries())i.set(e,t);let a=i.toString();return a?`${t}?${a}`:t},"getReturnToPath",0,(e=r)=>{if("u"<typeof location)return e;let t=new URLSearchParams(location.search),o=t.get("returnTo")??e;o=o.replace("/dashboard",""),t.delete("returnTo");let i=t.toString(),[a,n]=((e,t=r)=>e.startsWith("//")||e.includes("://")?t:/^\/[a-zA-Z0-9/\-_]*(?:\?[a-zA-Z0-9\-_=&]*)?$/.test(e)?e:t)(o,e).split("?"),s=new URLSearchParams(n||"");i&&new URLSearchParams(i).forEach((e,t)=>{s.append(t,e)});let l=s.toString();return a+(l?`?${l}`:"")},"getUserClaims",0,o])},154985,783104,e=>{"use strict";var t=e.i(242882);e.i(128328);var r=e.i(704206),o=e.i(234745),i=e.i(10429);let a={list:()=>["permissions"]};async function n(e){let{data:t,error:r}=await (0,o.get)("/platform/profile/permissions",{signal:e});return r&&(0,o.handleError)(r,{sentryContext:{tags:{permissionsQuery:!0},contexts:{rawError:r}}}),t}e.s(["permissionKeys",0,a],783104),e.s(["usePermissionsQuery",0,({enabled:e=!0,...o}={})=>{let s=(0,r.useIsLoggedIn)();return(0,t.useQuery)({queryKey:a.list(),queryFn:({signal:e})=>n(e),...o,enabled:i.IS_PLATFORM&&e&&s,staleTime:3e5})}],154985)},61837,e=>{"use strict";e.s(["profileKeys",0,{profile:()=>["profile"],mfaFactors:()=>["mfa","factors"],identities:()=>["profile","identities"],aaLevel:()=>["mfa","aaLevel"],auditLogs:({date_start:e,date_end:t})=>["profile","audit-logs",{date_start:e,date_end:t}]}])},611223,711950,268546,486144,e=>{"use strict";var t=e.i(38429),r=e.i(356003),o=e.i(355901),i=e.i(234745);let a={list:()=>["organizations"],detail:e=>["organizations",e],members:e=>["organizations",e,"members"],mfa:e=>["organizations",e,"mfa"],paymentMethods:e=>["organizations",e,"payment-methods"],entitlements:e=>["entitlements",e],roles:e=>["organizations",e,"roles"],freeProjectLimitCheck:e=>["organizations",e,"free-project-limit-check"],customerProfile:e=>["organizations",e,"customer-profile"],auditLogs:(e,{date_start:t,date_end:r})=>["organizations",e,"audit-logs",{date_start:t,date_end:r}],subscriptionPreview:(e,t)=>["organizations",e,"subscription","preview",t],taxId:e=>["organizations",e,"tax-ids"],tokenValidation:(e,t)=>["organizations",e,"validate-token",t],projectClaim:(e,t)=>["organizations",e,"project-claim",t],availableRegions:(e,t,r)=>["organizations",e,"available-regions",t,r],previewCreditCode:(e,t)=>["organizations",e,"preview-credit-code",t]};e.s(["organizationKeys",0,a],711950);var n=e.i(783104),s=e.i(61837);async function l(){let{data:e,error:t}=await (0,i.post)("/platform/profile");return t&&(0,i.handleError)(t),e}e.s(["useProfileCreateMutation",0,({onSuccess:e,onError:i,...d}={})=>{let u=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:()=>l(),async onSuccess(t,r,o){await Promise.all([u.invalidateQueries({queryKey:s.profileKeys.profile()}),u.invalidateQueries({queryKey:a.list()}),u.invalidateQueries({queryKey:n.permissionKeys.list()})]),await e?.(t,r,o)},async onError(e,t,r){void 0===i?o.toast.error(`Failed to create profile: ${e.message}`):i(e,t,r)},...d})}],611223);var d=e.i(242882),u=e.i(892354);async function c(){let{error:e,data:t}=await u.auth.getSession();if(e)throw e;if(!t.session)throw Error("Session not found with getSession()");let{identities:r=[],new_email:o,email_change_sent_at:i}=t.session.user;return{identities:r,new_email:o,email_change_sent_at:i}}e.s(["useProfileIdentitiesQuery",0,({enabled:e=!0,...t}={})=>(0,d.useQuery)({queryKey:s.profileKeys.identities(),queryFn:()=>c(),...t})],268546);var f=e.i(224563),p=e.i(10429);async function g(e){let{data:t,error:r}=await (0,i.get)("/platform/profile",{signal:e,headers:{Version:"2"}});return(r&&(0,i.handleError)(r),p.IS_PLATFORM)?t:{...t,disabled_features:f.default.env.NEXT_PUBLIC_DISABLED_FEATURES?.split(",")??[]}}e.s(["useProfileQuery",0,({enabled:e=!0,...t}={})=>(0,d.useQuery)({queryKey:s.profileKeys.profile(),queryFn:({signal:e})=>g(e),staleTime:18e5,...t,enabled:e})],486144)},162082,e=>{"use strict";var t=e.i(38429);e.i(128328);var r=e.i(277948),o=e.i(234745),i=e.i(10429),a=e.i(435798);async function n({event:e,pathname:t}){try{await (0,r.sendTelemetryEvent)(i.API_URL,e,t)}catch(e){(0,o.handleError)(e)}}e.s(["sendEvent",()=>n,"useSendEventMutation",0,({onSuccess:e,onError:r,...o}={})=>{let i=(0,a.useRouter)();return(0,t.useMutation)({mutationFn:e=>n({event:e,pathname:i.pathname}),async onSuccess(t,r,o){await e?.(t,r,o)},async onError(e,t,o){void 0===r?console.error(`Failed to send Telemetry event: ${e.message}`):r(e,t,o)},...o})}])},519835,e=>{"use strict";var t=e.i(224563);e.i(128328);var r=e.i(947748),o=e.i(48189);let i=t.default.env.NEXT_PUBLIC_GITHUB_INTEGRATION_APP_NAME||(void 0!==t.default.env.NEXT_PUBLIC_IS_NIMBUS?"supabase-snap":"supabase"),a=t.default.env.NEXT_PUBLIC_GITHUB_INTEGRATION_CLIENT_ID||(void 0!==t.default.env.NEXT_PUBLIC_IS_NIMBUS?"Iv23li2pAiqDGgaSrP8q":"Iv1.b91a6d8eaa272168"),n=`https://github.com/login/oauth/authorize?client_id=${a}`,s=`https://github.com/apps/${i}/installations/new`,l=`https://github.com/settings/connections/applications/${a}`;function d(e,t){let i,a=void 0!==window.screenLeft?window.screenLeft:window.screenX,l=void 0!==window.screenTop?window.screenTop:window.screenY,d=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width,u=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height;if("install"===e)i=s;else{let e=(0,o.makeRandomString)(32);localStorage.setItem(r.LOCAL_STORAGE_KEYS.GITHUB_AUTHORIZATION_STATE,e),i=`${n}&state=${e}&prompt=select_account`}let c=d/window.screen.availWidth,f=window.open(i,"GitHub",`scrollbars=yes,resizable=no,status=no,location=no,toolbar=no,menubar=no,
     width=${600/c}, 
     height=${800/c}, 
     top=${(u-800)/2/c+l}, 
     left=${(d-600)/2/c+a}
     `);if(f){if(t){let e=setInterval(()=>{f.closed&&(clearInterval(e),t())},500);setTimeout(()=>{clearInterval(e)},3e5)}f.focus()}}e.s(["GITHUB_INTEGRATION_INSTALLATION_URL",0,s,"GITHUB_INTEGRATION_REVOKE_AUTHORIZATION_URL",0,l,"getGitHubProfileImgUrl",0,e=>`https://github.com/${e}.png?size=96`,"openInstallGitHubIntegrationWindow",()=>d])},432478,e=>{"use strict";var t=e.i(478902),r=e.i(817729),o=e.i(435798),i=e.i(389959),a=e.i(355901);e.i(128328);var n=e.i(704206),s=e.i(154985),l=e.i(611223),d=e.i(268546),u=e.i(486144),c=e.i(162082),f=e.i(601116),p=e.i(519835);let g=(0,i.createContext)({profile:void 0,error:null,isLoading:!0,isError:!1,isSuccess:!1}),b=()=>(0,i.useContext)(g);function m(){let{profile:e,isLoading:t}=b(),{data:r,isPending:o}=(0,d.useProfileIdentitiesQuery)();e?.username;let i=e?.auth0_id?.startsWith("github"),a=i?r?.identities.find(e=>"github"===e.provider)?.identity_data?.user_name:void 0,n=i?(0,p.getGitHubProfileImgUrl)(a):void 0;return{username:e?.username,primaryEmail:e?.primary_email,avatarUrl:n,isLoading:t||o}}e.s(["ProfileProvider",0,({children:e})=>{let d=(0,n.useUser)(),p=(0,n.useIsLoggedIn)(),b=(0,o.useRouter)(),m=(0,f.useSignOut)(),{mutate:h}=(0,c.useSendEventMutation)(),{mutate:x,isPending:v}=(0,l.useProfileCreateMutation)({onSuccess:()=>{if(h({action:"sign_up",properties:{category:"conversion"}}),d){let e=window;e.dataLayer=e.dataLayer||[],e.dataLayer.push({event:"sign_up",email:d.email})}},onError:e=>{409===e.code?r.captureMessage("Profile already exists: "+e.message):(r.captureMessage("Failed to create users profile: "+e.message),a.toast.error("Failed to create your profile. Please refresh to try again."))}}),{error:y,data:w,isPending:_,isError:C,isSuccess:z}=(0,u.useProfileQuery)({enabled:p});(0,i.useEffect)(()=>{C&&(y?.message==="User's profile not found"&&x(),y?.code===401&&m().then(()=>b.push("/sign-in")))},[y,m,b,x,C]);let{isInitialLoading:P}=(0,s.usePermissionsQuery)({enabled:p}),M=(0,i.useMemo)(()=>({error:y,profile:w,isLoading:_||v||P,isError:C,isSuccess:z}),[_,v,P,w,y,C,z]);return(0,t.jsx)(g.Provider,{value:M,children:e})},"useProfile",0,b,"useProfileNameAndPicture",()=>m])},811025,e=>{"use strict";var t=e.i(242882),r=e.i(234745),o=e.i(837508),i=e.i(432478),a=e.i(711950);function n(e){return{...e,billing_email:e.billing_email??"Unknown",managed_by:function(e){switch(e.billing_partner){case"vercel_marketplace":return o.MANAGED_BY.VERCEL_MARKETPLACE;case"aws_marketplace":return o.MANAGED_BY.AWS_MARKETPLACE;default:return o.MANAGED_BY.SUPABASE}}(e),partner_id:e.slug.startsWith("vercel_")?e.slug.replace("vercel_",""):void 0}}async function s({signal:e,headers:t}){let{data:o,error:i}=await (0,r.get)("/platform/organizations",{signal:e,headers:t});return(i&&(0,r.handleError)(i),Array.isArray(o))?o.map(n).sort((e,t)=>e.name.localeCompare(t.name)):[]}function l(e){return e.invalidateQueries({queryKey:a.organizationKeys.list()})}e.s(["castOrganizationResponseToOrganization",()=>n,"invalidateOrganizationsQuery",()=>l,"useOrganizationsQuery",0,({enabled:e=!0,...r}={})=>{let{profile:o}=(0,i.useProfile)();return(0,t.useQuery)({queryKey:a.organizationKeys.list(),queryFn:({signal:e})=>s({signal:e}),enabled:e&&void 0!==o,...r,staleTime:18e5})}])},265735,e=>{"use strict";e.i(128328);var t=e.i(704206),r=e.i(158639),o=e.i(811025),i=e.i(164045);function a({enabled:e=!0}={}){let n=(0,t.useIsLoggedIn)(),{ref:s,slug:l}=(0,r.useParams)(),{data:d}=(0,i.useProjectDetailQuery)({ref:s});return(0,o.useOrganizationsQuery)({enabled:n&&e,select:e=>e.find(e=>void 0!==l?e.slug===l:void 0!==d?e.id===d.organization_id:void 0)})}e.s(["useSelectedOrganizationQuery",()=>a])},370410,885441,e=>{"use strict";let t=(0,e.i(388019).default)("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);e.s(["default",()=>t],885441),e.s(["Check",()=>t],370410)},375761,e=>{"use strict";var t=e.i(964727),r=e.i(355901);let o=async(e,o=t.default)=>{if(window.document.hasFocus())if(!navigator.clipboard?.write)return Promise.resolve(e).then(e=>navigator.clipboard?.writeText(e)).then(o);else{let t=new ClipboardItem({"text/plain":Promise.resolve(e).then(e=>new Blob([e],{type:"text/plain"}))}),r=()=>{},i=()=>{},a=new Promise((e,t)=>{r=e,i=t});return setTimeout(()=>{navigator.clipboard.write([t]).then(o).then(r).catch(i)},0),a}r.toast.error("Unable to copy to clipboard")};e.s(["copyToClipboard",0,o])},816467,e=>{"use strict";let t=(0,e.i(388019).default)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);e.s(["Copy",()=>t],816467)},938933,305551,e=>{"use strict";var t=e.i(389959);let r={bg:{brand:{primary:"bg-purple-600",secondary:"bg-purple-200"}},text:{brand:"text-purple-600",body:"text-foreground-light",title:"text-foreground"},border:{brand:"border-brand-600",primary:"border-default",secondary:"border-secondary",alternative:"border-alternative"},placeholder:"placeholder-foreground-muted",focus:`
    outline-none
    focus:ring-current focus:ring-2
  `,"focus-visible":`
    outline-none
    transition-all
    outline-0
    focus-visible:outline-4
    focus-visible:outline-offset-1
  `,size:{text:{tiny:"text-xs",small:"text-sm leading-4",medium:"text-sm",large:"text-base",xlarge:"text-base"},padding:{tiny:"px-2.5 py-1",small:"px-3 py-2",medium:"px-4 py-2",large:"px-4 py-2",xlarge:"px-6 py-3"}},overlay:{base:"absolute inset-0 bg-background opacity-50",container:"fixed inset-0 transition-opacity"}},o={tiny:`${r.size.text.tiny} ${r.size.padding.tiny}`,small:`${r.size.text.small} ${r.size.padding.small}`,medium:`${r.size.text.medium} ${r.size.padding.medium}`,large:`${r.size.text.large} ${r.size.padding.large}`,xlarge:`${r.size.text.xlarge} ${r.size.padding.xlarge}`},i={tiny:"pl-7",small:"pl-8",medium:"pl-8",large:"pl-10",xlarge:"pl-11"},a={accordion:{variants:{default:{base:`
          flex flex-col
          space-y-3
        `,container:`
          group
          first:rounded-tl-md first:rounded-tr-md
          last:rounded-bl-md last:rounded-br-md
          overflow-hidden
          will-change-transform
        `,trigger:`
          flex flex-row
          gap-3
          items-center
          w-full
          text-left
          cursor-pointer

          outline-none
          focus-visible:ring-1
          focus-visible:z-10
          ring-foreground-light
        `,content:`
          data-open:animate-slide-down
          data-closed:animate-slide-up
        `,panel:`
          py-3
        `},bordered:{base:`
          flex flex-col
          -space-y-px
        `,container:`
          group
          border
          border-default

          first:rounded-tl-md first:rounded-tr-md
          last:rounded-bl-md last:rounded-br-md
        `,trigger:`
          flex flex-row
          items-center
          px-6 py-4
          w-full
          text-left
          cursor-pointer

          font-medium
          text-base
          bg-transparent

          outline-none
          focus-visible:ring-1
          focus-visible:z-10
          ring-foreground-light

          transition-colors
          hover:bg-background

          overflow-hidden

          group-first:rounded-tl-md group-first:rounded-tr-md
          group-last:rounded-bl-md group-last:rounded-br-md
        `,content:`
          data-open:animate-slide-down
          data-closed:animate-slide-up
        `,panel:`
          px-6 py-3
          border-t border-strong
          bg-background
        `}},justified:"justify-between",chevron:{base:`
        text-foreground-lighter
        rotate-0
        group-state-open:rotate-180
        group-data-[state=open]:rotate-180
        ease-&lsqb;cubic-bezier(0.87,_0,_0.13,_1)&rsqb;
        transition-transform duration-300
        duration-200
      `,align:{left:"order-first",right:"order-last"}},animate:{enter:"transition-max-height ease-in-out duration-700 overflow-hidden",enterFrom:"max-h-0",enterTo:"max-h-screen",leave:"transition-max-height ease-in-out duration-300 overflow-hidden",leaveFrom:"max-h-screen",leaveTo:"max-h-0"}},badge:{base:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-opacity-10",size:{large:"px-3 py-0.5 rounded-full text-sm"},dot:"-ml-0.5 mr-1.5 h-2 w-2 rounded-full",color:{brand:"bg-brand-500 text-brand-600 border border-brand-500",brandAlt:"bg-brand bg-opacity-100 text-background border border-brand",scale:"bg-background text-foreground-light border border-strong",tomato:"bg-tomato-200 text-tomato-1100 border border-tomato-700",red:"bg-red-200 text-red-1100 border border-red-700",crimson:"bg-crimson-200 text-crimson-1100 border border-crimson-700",pink:"bg-pink-200 text-pink-1100 border border-pink-700",purple:"bg-purple-200 text-purple-1100 border border-purple-700",violet:"bg-violet-200 text-violet-1100 border border-violet-700",indigo:"bg-indigo-200 text-indigo-1100 border border-indigo-700",blue:"bg-blue-200 text-blue-1100 border border-blue-700",green:"bg-opacity-10 bg-brand-500 text-brand-600 border border-brand-500",grass:"bg-grass-200 text-grass-1100 border border-grass-700",orange:"bg-orange-200 text-orange-1100 border border-orange-700",yellow:"bg-yellow-200 text-yellow-1100 border border-yellow-700",amber:"bg-amber-200 text-amber-1100 border border-amber-700",gold:"bg-gold-200 text-gold-1100 border border-gold-700",gray:"bg-200 text-gray-1100 border border-gray-700",slate:"bg-slate-200 text-slate-1100 border border-slate-700"}},alert:{base:`
      relative rounded-md border py-4 px-6
      flex space-x-4 items-start
    `,header:"block text-sm font-normal mb-1",description:"text-xs",variant:{danger:{base:"bg-red-200 text-red-1200 border-red-700",icon:"text-red-900",header:"text-red-1200",description:"text-red-1100"},warning:{base:"bg-amber-200 border-amber-700",icon:"text-amber-900",header:"text-amber-1200",description:"text-amber-1100"},info:{base:"bg-alternative border",icon:"text-foreground-lighter",header:"text-foreground",description:"text-foreground-light"},success:{base:"bg-brand-300 border-brand-400",icon:"text-brand",header:"text-brand-600",description:"text-brand-600"},neutral:{base:"bg-surface-100 border-default",icon:"text-foreground-muted",header:"text-foreground",description:"text-foreground-light"}},close:`
      absolute
      right-6 top-4
      p-0 m-0
      text-foreground-muted
      cursor-pointer transition ease-in-out
      bg-transparent border-transparent focus:outline-none
      opacity-50 hover:opacity-100`},card:{base:`
      bg-surface-100

      border
      ${r.border.primary}

      flex flex-col
      rounded-md shadow-lg overflow-hidden relative
    `,hoverable:"transition hover:-translate-y-1 hover:shadow-2xl",head:`px-8 py-6 flex justify-between
    border-b
      ${r.border.primary} `,content:"p-8"},tabs:{base:"w-full justify-between space-y-4",underlined:{list:`
        flex items-center border-b
        ${r.border.secondary}
        `,base:`
        relative
        cursor-pointer
        text-foreground-lighter
        flex
        items-center
        space-x-2
        text-center
        transition
        focus:outline-none
        focus-visible:ring
        focus-visible:ring-foreground-muted
        focus-visible:border-foreground-muted
      `,inactive:`
        hover:text-foreground
      `,active:`
        !text-foreground
        border-b-2 border-foreground
      `},pills:{list:"flex space-x-1",base:`
        relative
        cursor-pointer
        flex
        items-center
        space-x-2
        text-center
        transition
        shadow-sm
        rounded
        border
        focus:outline-none
        focus-visible:ring
        focus-visible:ring-foreground-muted
        focus-visible:border-foreground-muted
        `,inactive:`
        bg-background
        border-strong hover:border-foreground-muted
        text-foreground-muted hover:text-foreground
      `,active:`
        bg-selection
        text-foreground
        border-stronger
      `},"rounded-pills":{list:"flex flex-wrap gap-2",base:`
        relative
        cursor-pointer
        flex
        items-center
        space-x-2
        text-center
        transition
        shadow-sm
        rounded-full
        focus:outline-none
        focus-visible:ring
        focus-visible:ring-foreground-muted
        focus-visible:border-foreground-muted
        `,inactive:`
        bg-surface-200 hover:bg-surface-300
        hover:border-foreground-lighter
        text-foreground-lighter hover:text-foreground
      `,active:`
        bg-foreground
        text-background
        border-foreground
      `},block:"w-full flex items-center justify-center",size:{...o},scrollable:"overflow-auto whitespace-nowrap no-scrollbar mask-fadeout-right",wrappable:"flex-wrap",content:"focus:outline-none transition-height"},input:{base:`
      block
      box-border
      w-full
      rounded-md
      shadow-sm
      transition-all
      text-foreground
      border
      focus-visible:shadow-md
      ${r.focus}
      focus-visible:border-foreground-muted
      focus-visible:ring-background-control
      ${r.placeholder}
      group
    `,variants:{standard:`
        bg-foreground/[.026]
        border border-control
        `,error:`
        bg-destructive-200
        border border-destructive-500
        focus:ring-destructive-400
        placeholder:text-destructive-400
       `},container:"relative",with_icon:i,size:{...o},disabled:"opacity-50",actions_container:"absolute inset-y-0 right-0 pl-3 pr-1 flex space-x-1 items-center",textarea_actions_container:"absolute inset-y-1.5 right-0 pl-3 pr-1 flex space-x-1 items-start",textarea_actions_container_items:"flex items-center"},select:{base:`
      block
      box-border
      w-full
      rounded-md
      shadow-sm
      transition-all
      text-foreground
      border
      focus-visible:shadow-md
      ${r.focus}
      focus-visible:border-foreground-muted
      focus-visible:ring-background-control
      ${r.placeholder}

      appearance-none
      bg-none
    `,variants:{standard:`
        bg-background
        border border-strong
        `,error:`
        bg-destructive-200
        border border-destructive-500
        focus:ring-destructive-400
        placeholder:text-destructive-400
       `},container:"relative",with_icon:i,size:{...o},disabled:"opacity-50",actions_container:"absolute inset-y-0 right-0 pl-3 pr-1 mr-5 flex items-center",chevron_container:"absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none",chevron:"h-5 w-5 text-foreground-lighter"},inputNumber:{base:`
      block
      box-border
      w-full
      rounded-md
      shadow-sm
      transition-all
      text-foreground
      border
      focus-visible:shadow-md
      ${r.focus}
      focus-visible:border-foreground-muted
      focus-visible:ring-background-control
      ${r.placeholder}

      appearance-none
      bg-none
    `,variants:{standard:`
        bg-control
        border border-strong
      `,error:`
        bg-destructive-200
        border border-destructive-500
        focus:ring-destructive-400
        placeholder:text-destructive-400
       `},disabled:"opacity-50",container:"relative",with_icon:i,size:{...o},actions_container:"absolute inset-y-0 right-0 pl-3 pr-1 flex space-x-1 items-center"},checkbox:{base:`
      bg-transparent
      ${r.focus}
      focus:ring-border-muted
      text-brand
      border-strong
      shadow-sm
      rounded
      cursor-pointer
    `,container:"flex cursor-pointer leading-none",size:{tiny:"h-3 w-3 mt-1 mr-3",small:"h-3.5 w-3.5 mt-0.5 mr-3.5",medium:"h-4 w-4 mt-0.5 mr-3.5",large:"h-5 w-5 mt-0.5 mr-4",xlarge:"h-5 w-5 mt-0.5 mr-4"},disabled:"opacity-50",label:{base:"text-foreground-light cursor-pointer",...r.size.text},label_before:{base:"text-border",...r.size.text},label_after:{base:"text-border",...r.size.text},description:{base:"text-foreground-lighter",...r.size.text},group:"space-y-3"},radio:{base:`
      absolute
      ${r.focus}
      focus:ring-brand-400
      border-strong

      text-brand
      shadow-sm
      cursor-pointer
      peer

      bg-surface-100
    `,hidden:"absolute opacity-0",size:{tiny:"h-3 w-3",small:"h-3.5 w-3.5",medium:"h-4 w-4",large:"h-5 w-5",xlarge:"h-5 w-5"},variants:{cards:{container:{base:"relative cursor-pointer flex",align:{vertical:"flex flex-col space-y-1",horizontal:"flex flex-row space-x-2"}},group:"-space-y-px shadow-sm",base:`
          transition
          border
          first:rounded-tl-md first:rounded-tr-md
          last:rounded-bl-md last:rounded-br-md
        `,size:{tiny:"px-5 py-3",small:"px-6 py-4",medium:"px-6 py-4",large:"px-8 p-4",xlarge:"px-8 p-4"},inactive:`
          bg-surface-200
          border-alternative
          hover:border-strong
          hover:bg-surface-300
        `,active:`
          bg-selection z-10
          border-stronger
          border-1
        `,radio_offset:"left-4"},"stacked-cards":{container:{base:"relative cursor-pointer flex items-center justify-between",align:{vertical:"flex flex-col space-y-1",horizontal:"flex flex-row space-x-2"}},group:"space-y-3",base:`
          transition
          rounded-md
          border
          shadow-sm
        `,size:{tiny:"px-5 py-3",small:"px-6 py-4",medium:"px-6 py-4",large:"px-8 p-4",xlarge:"px-8 p-4"},inactive:`
          bg-surface-200
          border-alternative
          hover:border-strong
          hover:bg-surface-300
        `,active:`
          bg-selection z-10
          border-stronger
          border-1
        `,radio_offset:"left-4"},"small-cards":{container:{base:"relative cursor-pointer flex",align:{vertical:"flex flex-col space-y-1 items-center justify-center",horizontal:"flex flex-row space-x-2"}},group:"flex flex-row gap-3",base:`
          transition
          border
          rounded-lg
          grow
          items-center
          flex-wrap
          justify-center
          shadow-sm
        `,size:{tiny:"px-5 py-3",small:"px-6 py-4",medium:"px-6 py-4",large:"px-8 p-4",xlarge:"px-8 p-4"},inactive:`
          bg-surface-200
          border-alternative
          hover:border-strong
          hover:bg-surface-300
        `,active:`
          bg-selection z-10
          border-stronger border-1
        `,radio_offset:"left-4"},"large-cards":{container:{base:"relative cursor-pointer flex",align:{vertical:"flex flex-col space-y-1",horizontal:"flex flex-row space-x-2"}},group:"grid grid-cols-12 gap-3",base:`
          transition
          border border-stronger
          shadow-sm
          rounded-lg
          grow
        `,size:{tiny:"px-5 py-3",small:"px-6 py-4",medium:"px-6 py-4",large:"px-8 p-4",xlarge:"px-8 p-4"},inactive:`
          bg-surface-200
          border-alternative
          hover:border-strong
          hover:bg-surface-300
        `,active:`
          bg-selection z-10
          border-strong
          border-1
        `,radio_offset:"left-4"},list:{container:{base:"relative cursor-pointer flex",size:{tiny:"pl-6",small:"pl-6",medium:"pl-7",large:"pl-7",xlarge:"pl-7"},align:{vertical:"flex flex-col space-y-1",horizontal:"flex flex-row space-x-2"}},group:"space-y-4",base:"",size:{tiny:"0",small:"0",medium:"0",large:"0",xlarge:"0"},active:"",radio_offset:"left-0"}},label:{base:"text-foreground-light cursor-pointer",...r.size.text},label_before:{base:"text-border",...r.size.text},label_after:{base:"text-border",...r.size.text},description:{base:"text-foreground-lighter",...r.size.text},optionalLabel:{base:"text-foreground-lighter",...r.size.text},disabled:"opacity-50 cursor-auto border-dashed"},sidepanel:{base:`
      z-50
      bg-dash-sidebar
      flex flex-col
      fixed
      inset-y-0
      h-full lg:h-screen
      border-l
      shadow-xl
    `,header:`
      flex items-center
      space-y-1 py-4 px-4 bg-dash-sidebar sm:px-6
      border-b h-[var(--header-height)]
    `,contents:`
      relative
      flex-1
      overflow-y-auto
    `,content:`
      px-4 sm:px-6
    `,footer:`
      flex justify-end gap-2
      p-4 bg-overlay
      border-t
    `,size:{medium:"w-screen max-w-md h-full",large:"w-screen max-w-2xl h-full",xlarge:"w-screen max-w-3xl h-full",xxlarge:"w-screen max-w-4xl h-full",xxxlarge:"w-screen max-w-5xl h-full",xxxxlarge:"w-screen max-w-6xl h-full"},align:{left:`
        left-0
        data-open:animate-panel-slide-left-out
        data-closed:animate-panel-slide-left-in
      `,right:`
        right-0
        data-open:animate-panel-slide-right-out
        data-closed:animate-panel-slide-right-in
      `},separator:`
      w-full
      h-px
      my-2
      bg-border
    `,overlay:`
      z-50
      fixed
      bg-alternative
      h-full w-full
      left-0
      top-0
      opacity-75
      data-closed:animate-fade-out-overlay-bg
      data-open:animate-fade-in-overlay-bg
    `,trigger:`
      border-none bg-transparent p-0 focus:ring-0
    `},toggle:{base:`
      p-0 relative
      inline-flex flex-shrink-0
      border-2 border-transparent
      rounded-full
      cursor-pointer
      transition-colors ease-in-out duration-200
      ${r.focus}
      focus:!ring-border
      bg-foreground-muted/40

      hover:bg-foreground-muted/60
    `,active:`
      !bg-brand
      !hover:bg-brand
    `,handle_container:{tiny:"h-4 w-7",small:"h-6 w-11",medium:"h-6 w-11",large:"h-7 w-12",xlarge:"h-7 w-12"},handle:{base:`
        inline-block h-5 w-5
        rounded-full
        bg-white
        shadow ring-0
        transition
        ease-in-out duration-200
      `,tiny:"!h-3 !w-3",small:"!h-5 !w-5",medium:"!h-5 !w-5",large:"!h-6 !w-6",xlarge:"!h-6 !w-6"},handle_active:{tiny:" translate-x-3 dark:bg-white",small:"translate-x-5 dark:bg-white",medium:"translate-x-5 dark:bg-white",large:"translate-x-5 dark:bg-white",xlarge:"translate-x-5 dark:bg-white"},disabled:"opacity-75 cursor-not-allowed"},form_layout:{container:"grid gap-2",flex:{left:{base:"flex flex-row gap-6",content:"",labels:"order-2",data_input:"order-1"},right:{base:"flex flex-row gap-6 justify-between",content:"order-last",labels:"",data_input:"text-right"}},responsive:"md:grid md:grid-cols-12",non_responsive:"grid grid-cols-12 gap-2",labels_horizontal_layout:"flex flex-row space-x-2 justify-between col-span-12",labels_vertical_layout:"flex flex-col space-y-2 col-span-4",data_input_horizontal_layout:"col-span-12",non_box_data_input_spacing_vertical:"my-3",non_box_data_input_spacing_horizontal:"my-3 md:mt-0 mb-3",data_input_vertical_layout:"col-span-8",data_input_vertical_layout__align_right:"text-right",label:{base:"block text-foreground-light",size:{...r.size.text}},label_optional:{base:"text-foreground-lighter",size:{...r.size.text}},description:{base:"mt-2 text-foreground-lighter leading-normal",size:{...r.size.text}},label_before:{base:"text-foreground-lighter ",size:{...r.size.text}},label_after:{base:"text-foreground-lighter",size:{...r.size.text}},error:{base:`
        text-red-900
        transition-all
        data-show:mt-2
        data-show:animate-slide-down-normal
        data-hide:animate-slide-up-normal
      `,size:{...r.size.text}},size:{tiny:"text-xs",small:"text-sm leading-4",medium:"text-sm",large:"text-base",xlarge:"text-base"}},popover:{trigger:`
      flex
      border-none
      rounded
      bg-transparent
      p-0
      outline-none
      outline-offset-1
      transition-all
      focus:outline-4
      focus:outline-border-control
    `,content:`
      z-40
      bg-overlay
      border border-overlay
      rounded
      shadow-lg
      data-open:animate-dropdown-content-show
      data-closed:animate-dropdown-content-hide
      min-w-fit

      origin-popover
      data-open:animate-dropdown-content-show
      data-closed:animate-dropdown-content-hide
    `,size:{tiny:"w-40",small:"w-48",medium:"w-64",large:"w-80",xlarge:"w-96",content:"w-auto"},header:`
      bg-surface-200
      space-y-1 py-1.5 px-3
      border-b border-overlay
    `,footer:`
      bg-surface-200
      py-1.5 px-3
      border-t border-overlay
    `,close:`
      transition
      text-foreground-lighter
    `,separator:`
      w-full
      h-px
      my-2
      bg-border-overlay
    `},menu:{item:{base:`
        cursor-pointer
        flex space-x-3 items-center
        outline-none
        focus-visible:ring-1 ring-foreground-muted focus-visible:z-10
        group
      `,content:{base:"transition truncate text-sm w-full",normal:"text-foreground-light group-hover:text-foreground",active:"text-foreground font-semibold"},icon:{base:"transition truncate text-sm",normal:"text-foreground-lighter group-hover:text-foreground-light",active:"text-foreground"},variants:{text:{base:`
            py-1
          `,normal:`
            font-normal
            border-default
            group-hover:border-foreground-muted`,active:`
            font-semibold
            text-foreground-muted
            z-10
          `},border:{base:`
            px-4 py-1
          `,normal:`
            border-l
            font-normal
            border-default
            group-hover:border-foreground-muted`,active:`
            font-semibold

            text-foreground-muted
            z-10

            border-l
            border-brand
            group-hover:border-brand
          `,rounded:"rounded-md"},pills:{base:"px-3 py-1",normal:`
            font-normal
            border-default
            group-hover:border-foreground-muted`,active:`
            font-semibold
            bg-sidebar-accent
            text-foreground-lighter
            z-10 rounded-md
          `}}},group:{base:`
        flex space-x-3
        mb-2
        font-normal
      `,icon:"text-foreground-lighter",content:"text-sm text-foreground-lighter w-full",variants:{text:"",pills:"px-3",border:""}}},modal:{base:`
      relative
      bg-dash-sidebar
      my-4 max-w-screen
      border border-overlay
      rounded-md
      shadow-xl
      data-open:animate-overlay-show
      data-closed:animate-overlay-hide

    `,header:`
      bg-surface-200
      space-y-1 py-3 px-4 sm:px-5
      border-b border-overlay
      flex items-center justify-between
    `,footer:`
      flex justify-end gap-2
      py-3 px-5
      border-t border-overlay
    `,size:{tiny:"sm:align-middle sm:w-full sm:max-w-xs",small:"sm:align-middle sm:w-full sm:max-w-sm",medium:"sm:align-middle sm:w-full sm:max-w-lg",large:"sm:align-middle sm:w-full md:max-w-xl",xlarge:"sm:align-middle sm:w-full md:max-w-3xl",xxlarge:"sm:align-middle sm:w-full max-w-screen md:max-w-6xl",xxxlarge:"sm:align-middle sm:w-full md:max-w-7xl"},overlay:`
      z-40
      fixed
      bg-alternative
      h-full w-full
      left-0
      top-0
      opacity-75
      data-closed:animate-fade-out-overlay-bg
      data-open:animate-fade-in-overlay-bg
    `,scroll_overlay:`
      z-40
      fixed
      inset-0
      grid
      place-items-center
      overflow-y-auto
      data-open:animate-overlay-show data-closed:animate-overlay-hide
    `,separator:`
      w-full
      h-px
      my-2
      bg-border-overlay
    `,content:"px-5"},listbox:{base:`
      block
      box-border
      w-full
      rounded-md
      shadow-sm
      text-foreground
      border
      focus-visible:shadow-md
      ${r.focus}
      focus-visible:border-foreground-muted
      focus-visible:ring-background-control
      ${r.placeholder}
      indent-px
      transition-all
      bg-none
    `,container:"relative",label:"truncate",variants:{standard:`
        bg-control
        border border-control

        aria-expanded:border-foreground-muted
        aria-expanded:ring-border-muted
        aria-expanded:ring-2
        `,error:`
        bg-destructive-200
        border border-destructive-500
        focus:ring-destructive-400
        placeholder:text-destructive-400
       `},options_container_animate:`
      transition
      data-open:animate-slide-down
      data-open:opacity-1
      data-closed:animate-slide-up
      data-closed:opacity-0
    `,options_container:`
      bg-overlay
      shadow-lg
      border border-solid
      border-overlay max-h-60
      rounded-md py-1 text-base
      sm:text-sm z-10 overflow-hidden overflow-y-scroll

      origin-dropdown
      data-open:animate-dropdown-content-show
      data-closed:animate-dropdown-content-hide
    `,with_icon:"pl-2",addOnBefore:`
      w-full flex flex-row items-center space-x-3
    `,size:{...o},disabled:"opacity-50",actions_container:"absolute inset-y-0 right-0 pl-3 pr-1 flex space-x-1 items-center",chevron_container:"absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none",chevron:"h-5 w-5 text-foreground-muted",option:`
      w-listbox
      transition cursor-pointer select-none relative py-2 pl-3 pr-9
      text-foreground-light
      text-sm
      hover:bg-border-overlay
      focus:bg-border-overlay
      focus:text-foreground
      border-none
      focus:outline-none
    `,option_active:"text-foreground bg-selection",option_disabled:"cursor-not-allowed opacity-60",option_inner:"flex items-center space-x-3",option_check:"absolute inset-y-0 right-0 flex items-center pr-3 text-brand",option_check_active:"text-brand",option_check_icon:"h-5 w-5"},collapsible:{content:`
      data-open:animate-slide-down-normal
      data-closed:animate-slide-up-normal
    `},inputErrorIcon:{base:`
      flex items-center
      right-3 pr-2 pl-2
      inset-y-0
      pointer-events-none
      text-red-900
    `},inputIconContainer:{base:`
    absolute inset-y-0
    left-0 pl-2 flex
    items-center pointer-events-none
    text-foreground-light
    [&_svg]:stroke-[1.5]
    `,size:{tiny:"[&_svg]:h-[14px] [&_svg]:w-[14px]",small:"[&_svg]:h-[18px] [&_svg]:w-[18px]",medium:"[&_svg]:h-[20px] [&_svg]:w-[20px]",large:"[&_svg]:h-[20px] [&_svg]:w-[20px] pl-3",xlarge:"[&_svg]:h-[24px] [&_svg]:w-[24px] pl-3",xxlarge:"[&_svg]:h-[30px] [&_svg]:w-[30px] pl-3",xxxlarge:"[&_svg]:h-[42px] [&_svg]:w-[42px] pl-3"}},icon:{container:"flex-shrink-0 flex items-center justify-center rounded-full p-3"},loading:{base:"relative",content:{base:"transition-opacity duration-300",active:"opacity-40"},spinner:`
      absolute
      text-foreground-lighter animate-spin
      inset-0
      size-5
      m-auto
    `}};e.s(["default",0,a],305551);let n=(0,t.createContext)({theme:a});function s(e){let{theme:{[e]:r}}=(0,t.useContext)(n);return r||(r=a.accordion),r=JSON.parse(r=JSON.stringify(r).replace(/\\n/g,"").replace(/\s\s+/g," "))}e.s(["default",()=>s],938933)}]);

//# debugId=bf26b1ce-41a4-2dbb-3aa2-ee8d9caa561d
//# sourceMappingURL=380c53812df23f4d.js.map