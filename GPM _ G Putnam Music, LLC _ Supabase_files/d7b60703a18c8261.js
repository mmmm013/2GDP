;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="a46b48be-9148-bd44-2175-3a7f63358d52")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,479084,e=>{"use strict";let r=new Set(["AES128","AES256","ALL","ALLOWOVERWRITE","ANALYSE","ANALYZE","AND","ANY","ARRAY","AS","ASC","ASYMMETRIC","AUTHORIZATION","BACKUP","BETWEEN","BIGINT","BINARY","BIT","BLANKSASNULL","BOOLEAN","BOTH","BYTEDICT","CASE","CAST","CHAR","CHARACTER","CHECK","COALESCE","COLLATE","COLLATION","COLUMN","CONCURRENTLY","CONSTRAINT","CREATE","CREDENTIALS","CROSS","CURRENT_CATALOG","CURRENT_DATE","CURRENT_ROLE","CURRENT_SCHEMA","CURRENT_TIME","CURRENT_TIMESTAMP","CURRENT_USER_ID","CURRENT_USER","DEC","DECIMAL","DEFAULT","DEFERRABLE","DEFLATE","DEFRAG","DELETE","DELTA","DELTA32K","DESC","DISABLE","DISTINCT","DO","ELSE","EMPTYASNULL","ENABLE","ENCODE","ENCRYPT","ENCRYPTION","END","EXCEPT","EXISTS","EXPLICIT","EXTRACT","FALSE","FETCH","FLOAT","FOR","FOREIGN","FREEZE","FROM","FULL","GLOBALDICT256","GLOBALDICT64K","GRANT","GREATEST","GROUP","GROUPING","GZIP","HAVING","IDENTITY","IGNORE","ILIKE","IN","INITIALLY","INNER","INOUT","INSERT","INT","INTEGER","INTERSECT","INTERVAL","INTO","IS","ISNULL","JOIN","JSON_ARRAY","JSON_ARRAYAGG","JSON_EXISTS","JSON_OBJECT","JSON_OBJECTAGG","JSON_QUERY","JSON_SCALAR","JSON_SERIALIZE","JSON_TABLE","JSON_VALUE","JSON","LATERAL","LEADING","LEAST","LEFT","LIKE","LIMIT","LOCALTIME","LOCALTIMESTAMP","LUN","LUNS","LZO","LZOP","MERGE_ACTION","MINUS","MOSTLY13","MOSTLY32","MOSTLY8","NATIONAL","NATURAL","NCHAR","NEW","NONE","NORMALIZE","NOT","NOTNULL","NULL","NULLIF","NULLS","NUMERIC","OFF","OFFLINE","OFFSET","OLD","ON","ONLY","OPEN","OR","ORDER","OUT","OUTER","OVERLAPS","OVERLAY","PARALLEL","PARTITION","PERCENT","PLACING","POSITION","PRECISION","PRIMARY","RAW","READRATIO","REAL","RECOVER","REFERENCES","REJECTLOG","RESORT","RESTORE","RETURNING","RIGHT","ROW","SELECT","SESSION_USER","SETOF","SIMILAR","SMALLINT","SOME","SUBSTRING","SYMMETRIC","SYSDATE","SYSTEM_USER","SYSTEM","TABLE","TABLESAMPLE","TAG","TDES","TEXT255","TEXT32K","THEN","TIME","TIMESTAMP","TO","TOP","TRAILING","TREAT","TRIM","TRUE","TRUNCATECOLUMNS","UNION","UNIQUE","UPDATE","USER","USING","VALUES","VARCHAR","VARIADIC","VERBOSE","WALLET","WHEN","WHERE","WINDOW","WITH","WITHOUT","XMLATTRIBUTES","XMLCONCAT","XMLELEMENT","XMLEXISTS","XMLFOREST","XMLNAMESPACES","XMLPARSE","XMLPI","XMLROOT","XMLSERIALIZE","XMLTABLE"]);function t(e){return e.replace("T"," ").replace("Z","+00")}function o(e,r,t){let o="";for(let[n,a]of(o+=e?" (":"(",r.entries()))o+=(0===n?"":", ")+t(a);return o+")"}function n(e){if(null==e)throw Error("SQL identifier cannot be null or undefined");if(!1===e)return'"f"';if(!0===e)return'"t"';if(e instanceof Date)return`"${t(e.toISOString())}"`;if(Array.isArray(e)){let r=[];for(let t of e)if(!0===Array.isArray(t))throw TypeError("Nested array to grouped list conversion is not supported for SQL identifier");else r.push(n(t));return r.toString()}else if(e===Object(e))throw Error("SQL identifier cannot be an object");let o=String(e).slice(0);if(!0===/^[_a-z][\d$_a-z]*$/.test(o)&&!1==!!r.has(o.toUpperCase()))return o;let a='"';for(let e of o)a+='"'===e?e+e:e;return a+'"'}function a(e){let r,n="";if(null==e)return"NULL";if("bigint"==typeof e)return BigInt(e).toString();if(e===1/0)return"'Infinity'";if(e===-1/0)return"'-Infinity'";if(Number.isNaN(e))return"'NaN'";if("number"==typeof e)return Number(e).toString();if(!1===e)return"'f'";if(!0===e)return"'t'";if(e instanceof Date)return`'${t(e.toISOString())}'`;if(Array.isArray(e)){let r=[];for(let[t,n]of e.entries())!0===Array.isArray(n)?r.push(o(0!==t,n,a)):r.push(a(n));return r.toString()}e===Object(e)?(r="jsonb",n=JSON.stringify(e)):n=String(e).slice(0);let i=!1,l="'";for(let e of n)"'"===e?l+=e+e:"\\"===e?(l+=e+e,i=!0):l+=e;return l+="'",!0===i&&(l=`E${l}`),r&&(l+=`::${r}`),l}function i(e,...r){let l,s;return l=0,s=RegExp("%(%|(\\d+\\$)?[ILs])","g"),e.replace(s,(e,i)=>{if("%"===i)return"%";let s=l,d=i.split("$");if(d.length>1&&(s=Number.parseInt(d[0],10)-1,i=d[1]),s<0)throw Error("specified argument 0 but arguments start at 1");if(s>r.length-1)throw Error("too few arguments");return(l=s+1,"I"===i)?n(r[s]):"L"===i?a(r[s]):"s"===i?function e(r){if(null==r)return"";if(!1===r)return"f";if(!0===r)return"t";if(r instanceof Date)return t(r.toISOString());if(Array.isArray(r)){let t=[];for(let[n,a]of r.entries())null!=a&&(!0===Array.isArray(a)?t.push(o(0!==n,a,e)):t.push(e(a)));return t.toString()}return r===Object(r)?JSON.stringify(r):String(r).toString().slice(0)}(r[s]):void 0})}e.s(["format",()=>i,"ident",()=>n,"literal",()=>a],479084)},21150,e=>{"use strict";e.s(["sqlKeys",0,{query:(e,r)=>["projects",e,"query",...r],ongoingQueries:e=>["projects",e,"ongoing-queries"]}])},908937,e=>{"use strict";var r=e.i(479084),t=e.i(48189);function o(){return Math.floor((Date.now()+36e5)/1e3)}function n(e,r){let n=o(),a=Math.floor(Date.now()/1e3);if("authenticated"===r.role){if("native"===r.userType&&r.user){let o=r.user;return{aal:r.aal??"aal1",amr:[{method:"password",timestamp:a}],app_metadata:o.raw_app_meta_data,aud:"authenticated",email:o.email,exp:n,iat:a,iss:`https://${e}.supabase.co/auth/v1`,phone:o.phone,role:o.role??r.role,session_id:(0,t.uuidv4)(),sub:o.id,user_metadata:o.raw_user_meta_data,is_anonymous:o.is_anonymous}}if("external"===r.userType&&r.externalAuth)return{aal:r.aal??"aal1",aud:"authenticated",exp:n,iat:a,role:"authenticated",session_id:(0,t.uuidv4)(),sub:r.externalAuth.sub,...r.externalAuth.additionalClaims}}return{iss:"supabase",ref:e,role:r.role,iat:a,exp:n}}let a="ROLE_IMPERSONATION_NO_RESULTS";function i(e,t){var n;let i,{role:l,claims:s}=t??{role:void 0,claims:void 0};if(void 0===l)return e;let d="postgrest"===l.type?void 0!==s?(i={...s,exp:o()},`
select set_config('role', ${(0,r.literal)(l.role)}, true),
set_config('request.jwt.claims', ${(0,r.literal)(JSON.stringify(i))}, true),
set_config('request.method', 'POST', true),
set_config('request.path', '/impersonation-example-request-path', true),
set_config('request.headers', '{"accept": "*/*"}', true);
  `.trim()):"":(n=l.role,`
    set local role ${(0,r.literal)(n)};
  `.trim());return`
    ${d}

    -- If the users sql returns no rows, pg-meta will
    -- fallback to returning the result of the impersonation sql.
    select 1 as "${a}";

    ${e}
  `.trim()}function l(e){return new TextEncoder().encode(e)}function s(e){return btoa(String.fromCharCode(...new Uint8Array("string"==typeof e?l(e):e))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function d(e,r){let t=s(l(JSON.stringify({alg:"HS256",typ:"JWT"})))+"."+s(l(JSON.stringify(e))),o=s(new Uint8Array(await window.crypto.subtle.sign({name:"HMAC"},await window.crypto.subtle.importKey("raw",l(r),{name:"HMAC",hash:"SHA-256"},!1,["sign","verify"]),l(t))));return`${t}.${o}`}function u(e,r,t){return d({...n(e,t),exp:o()},r)}e.s(["ROLE_IMPERSONATION_NO_RESULTS",0,a,"ROLE_IMPERSONATION_SQL_LINE_COUNT",0,11,"getPostgrestClaims",()=>n,"getRoleImpersonationJWT",()=>u,"wrapWithRoleImpersonation",()=>i])},714403,591052,e=>{"use strict";var r=e.i(248593);e.i(242882);var t=e.i(234745);e.i(635494);var o=e.i(10429);e.i(837508);var n=e.i(908937);function a(e){let r=parseFloat(e);return Number.isFinite(r)?r:void 0}function i(e){let r=parseInt(e,10);return Number.isNaN(r)?void 0:r}function l(e){if(e.details){let r=e.details.match(/Rows Removed by Filter:\s*(\d+)/);r&&(e.rowsRemovedByFilter=i(r[1]))}e.children.forEach(l)}function s(e){return e.reduce((e,r)=>Math.max(e,function e(r){return Math.max(r.actualTime?r.actualTime.end-r.actualTime.start:0,r.children.reduce((r,t)=>Math.max(r,e(t)),0))}(r)),0)}function d(e){let r={totalTime:0,totalCost:0,maxCost:0,hasSeqScan:!1,seqScanTables:[],hasIndexScan:!1},t=e=>{e.actualTime&&(r.totalTime=Math.max(r.totalTime,e.actualTime.end)),e.cost&&(r.maxCost=Math.max(r.maxCost,e.cost.end));let o=e.operation.toLowerCase();if(o.includes("seq scan")){r.hasSeqScan=!0;let t=e.details.match(/on\s+((?:"[^"]+"|[\w]+)(?:\.(?:"[^"]+"|[\w]+))*)/);t&&r.seqScanTables.push(t[1])}o.includes("index")&&(r.hasIndexScan=!0),e.children.forEach(t)};return e.forEach(t),r.totalCost=e[0]?.cost?.end??0,r}function u(e){let r=function(e){let r=e.map(e=>e["QUERY PLAN"]||"").filter(Boolean),t=[],o=[],n=/^(Filter|Sort Key|Group Key|Hash Cond|Join Filter|Index Cond|Recheck Cond|Rows Removed by Filter|Rows Removed by Index Recheck|Output|Merge Cond|Sort Method|Worker \d+|Buffers|Planning Time|Execution Time|One-Time Filter|InitPlan|SubPlan):/;for(let e=0;e<r.length;e++){let l=r[e];if(!l.trim())continue;let s=l.match(/^(\s*)/),d=s?s[1].length:0,u=l.includes("->"),c=l,f=d;if(u){let e=l.indexOf("->");f=e,c=l.substring(e+2).trim()}else c=l.trim();if(c.startsWith("Planning Time:")||c.startsWith("Execution Time:")||c.startsWith("Planning:")||c.startsWith("Execution:"))continue;if(n.test(c)&&o.length>0){let e=o[o.length-1].node;e.details+=(e.details?"\n":"")+c;continue}if(!u&&o.length>0&&d>0){let e=o[o.length-1];if(d>e.indent&&!c.match(/^\w+.*\(cost=/)){e.node.details+=(e.node.details?"\n":"")+c;continue}}let p=c.match(/^(.+?)\s*(\([^)]*cost=[^)]+\)(?:\s*\([^)]+\))*)?\s*$/);if(!p)continue;let[,g,b]=p,m=b?b.replace(/^\(|\)$/g,"").replace(/\)\s*\(/g," "):void 0,x=g.trim(),h="",y=g.match(/^(.+?)\s+on\s+(.+)$/i),v=g.match(/^(.+?)\s+using\s+(.+)$/i);y?(x=y[1].trim(),h="on "+y[2].trim()):v&&(x=v[1].trim(),h="using "+v[2].trim()),function(e,r,t,o){for(;o.length>0&&o[o.length-1].indent>=r;)o.pop();0===o.length?t.push(e):o[o.length-1].node.children.push(e),o.push({node:e,indent:r})}(function(e,r,t,o,n){let l={operation:e.trim(),details:r?.trim()||"",level:o,children:[],raw:n};if(t){let e=t.match(/cost=([\d.]+)\.\.([\d.]+)/);if(e){let r=a(e[1]),t=a(e[2]);void 0!==r&&void 0!==t&&(l.cost={start:r,end:t})}let r=t.match(/rows=(\d+)/);r&&(l.rows=i(r[1]));let o=t.match(/width=(\d+)/);o&&(l.width=i(o[1]));let n=t.match(/actual time=([\d.]+)\.\.([\d.]+)/);if(n){let e=a(n[1]),r=a(n[2]);void 0!==e&&void 0!==r&&(l.actualTime={start:e,end:r});let o=t.substring(t.indexOf("actual time=")).match(/rows=(\d+)/);o&&(l.actualRows=i(o[1]))}}return l}(x,h,m,u?Math.floor(f/6)+1:0,l),f,t,o)}return t}(e);return r.forEach(l),r}function c(e){if(!e)return[];let r=e.split("\n").filter(Boolean),t=[];for(let e of r){let r=e.indexOf(":");r>0?t.push({label:e.substring(0,r+1),value:e.substring(r+1).trim()}):e.trim()&&t.push({label:"",value:e.trim()})}return t}e.i(21150),e.s(["calculateMaxDuration",()=>s,"calculateSummary",()=>d,"createNodeTree",()=>u,"parseDetailLines",()=>c],591052);let f="Query cost exceeds threshold";async function p({projectRef:e,connectionString:a,sql:i,queryKey:l,handleError:s,isRoleImpersonationEnabled:c=!1,isStatementTimeoutDisabled:p=!1,preflightCheck:g=!1},b,m,x){let h,y;if(!e)throw Error("projectRef is required");if(new Blob([i]).size>.98*o.MB)throw Error("Query is too large to be run via the SQL Editor");let v=new Headers(m);if(a&&v.set("x-connection-encrypted",a),x){let e=await x({query:i,headers:v});"data"in e?h=e.data:y=e.error}else{let o={signal:b,headers:v,params:{path:{ref:e},header:{"x-connection-encrypted":a??"","x-pg-application-name":p?"supabase/dashboard-query-editor":r.DEFAULT_PLATFORM_APPLICATION_NAME}}};if(g){let{data:e}=await (0,t.post)("/platform/pg-meta/{ref}/query",{...o,body:{query:`explain ${i}`,disable_statement_timeout:p},params:{...o.params,query:{key:"preflight-check"}}}),r=e?u(e):void 0,n=r?d(r):void 0,a=n?.totalCost??0;if(a>=2e5)return(0,t.handleError)({message:f,code:a,metadata:{cost:a,sql:i}})}let n=l?.filter(e=>"string"==typeof e||"number"==typeof e).join("-")??"",s=await (0,t.post)("/platform/pg-meta/{ref}/query",{...o,body:{query:i,disable_statement_timeout:p},params:{...o.params,query:{key:n}}});h=s.data,y=s.error}if(y){if(c&&"object"==typeof y&&null!==y&&"error"in y&&"formattedError"in y){let e=y,r=/LINE (\d+):/im,[,t]=r.exec(e.error)??[],o=Number(t);isNaN(o)||(e={...e,error:e.error.replace(r,`LINE ${o-n.ROLE_IMPERSONATION_SQL_LINE_COUNT}:`),formattedError:e.formattedError.replace(r,`LINE ${o-n.ROLE_IMPERSONATION_SQL_LINE_COUNT}:`)}),y=e}if(void 0!==s)return s(y);(0,t.handleError)(y)}return c&&Array.isArray(h)&&h?.[0]?.[n.ROLE_IMPERSONATION_NO_RESULTS]===1?{result:[]}:{result:h}}e.s(["COST_THRESHOLD_ERROR",0,f,"executeSql",()=>p],714403)},793365,(e,r,t)=>{!function(o,n){if("function"==typeof define&&define.amd){let o;void 0!==(o=n(e.r,t,r))&&e.v(o)}else r.exports=n()}(e.e,function(){"use strict";Array.isArray||(Array.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)});var e={},r={"==":function(e,r){return e==r},"===":function(e,r){return e===r},"!=":function(e,r){return e!=r},"!==":function(e,r){return e!==r},">":function(e,r){return e>r},">=":function(e,r){return e>=r},"<":function(e,r,t){return void 0===t?e<r:e<r&&r<t},"<=":function(e,r,t){return void 0===t?e<=r:e<=r&&r<=t},"!!":function(r){return e.truthy(r)},"!":function(r){return!e.truthy(r)},"%":function(e,r){return e%r},log:function(e){return console.log(e),e},in:function(e,r){return!!r&&void 0!==r.indexOf&&-1!==r.indexOf(e)},cat:function(){return Array.prototype.join.call(arguments,"")},substr:function(e,r,t){if(t<0){var o=String(e).substr(r);return o.substr(0,o.length+t)}return String(e).substr(r,t)},"+":function(){return Array.prototype.reduce.call(arguments,function(e,r){return parseFloat(e,10)+parseFloat(r,10)},0)},"*":function(){return Array.prototype.reduce.call(arguments,function(e,r){return parseFloat(e,10)*parseFloat(r,10)})},"-":function(e,r){return void 0===r?-e:e-r},"/":function(e,r){return e/r},min:function(){return Math.min.apply(this,arguments)},max:function(){return Math.max.apply(this,arguments)},merge:function(){return Array.prototype.reduce.call(arguments,function(e,r){return e.concat(r)},[])},var:function(e,r){var t=void 0===r?null:r,o=this;if(void 0===e||""===e||null===e)return o;for(var n=String(e).split("."),a=0;a<n.length;a++)if(null==o||void 0===(o=o[n[a]]))return t;return o},missing:function(){for(var r=[],t=Array.isArray(arguments[0])?arguments[0]:arguments,o=0;o<t.length;o++){var n=t[o],a=e.apply({var:n},this);(null===a||""===a)&&r.push(n)}return r},missing_some:function(r,t){var o=e.apply({missing:t},this);return t.length-o.length>=r?[]:o}};return e.is_logic=function(e){return"object"==typeof e&&null!==e&&!Array.isArray(e)&&1===Object.keys(e).length},e.truthy=function(e){return(!Array.isArray(e)||0!==e.length)&&!!e},e.get_operator=function(e){return Object.keys(e)[0]},e.get_values=function(r){return r[e.get_operator(r)]},e.apply=function(t,o){if(Array.isArray(t))return t.map(function(r){return e.apply(r,o)});if(!e.is_logic(t))return t;var n,a,i,l,s,d=e.get_operator(t),u=t[d];if(Array.isArray(u)||(u=[u]),"if"===d||"?:"==d){for(n=0;n<u.length-1;n+=2)if(e.truthy(e.apply(u[n],o)))return e.apply(u[n+1],o);return u.length===n+1?e.apply(u[n],o):null}if("and"===d){for(n=0;n<u.length&&(a=e.apply(u[n],o),e.truthy(a));n+=1);return a}if("or"===d){for(n=0;n<u.length&&(a=e.apply(u[n],o),!e.truthy(a));n+=1);return a}if("filter"===d)return(l=e.apply(u[0],o),i=u[1],Array.isArray(l))?l.filter(function(r){return e.truthy(e.apply(i,r))}):[];if("map"===d)return(l=e.apply(u[0],o),i=u[1],Array.isArray(l))?l.map(function(r){return e.apply(i,r)}):[];else if("reduce"===d)return(l=e.apply(u[0],o),i=u[1],s=void 0!==u[2]?u[2]:null,Array.isArray(l))?l.reduce(function(r,t){return e.apply(i,{current:t,accumulator:r})},s):s;else if("all"===d){if(l=e.apply(u[0],o),i=u[1],!Array.isArray(l)||!l.length)return!1;for(n=0;n<l.length;n+=1)if(!e.truthy(e.apply(i,l[n])))return!1;return!0}else if("none"===d){if(l=e.apply(u[0],o),i=u[1],!Array.isArray(l)||!l.length)return!0;for(n=0;n<l.length;n+=1)if(e.truthy(e.apply(i,l[n])))return!1;return!0}else if("some"===d){if(l=e.apply(u[0],o),i=u[1],!Array.isArray(l)||!l.length)return!1;for(n=0;n<l.length;n+=1)if(e.truthy(e.apply(i,l[n])))return!0;return!1}if(u=u.map(function(r){return e.apply(r,o)}),r.hasOwnProperty(d)&&"function"==typeof r[d])return r[d].apply(o,u);if(d.indexOf(".")>0){var c=String(d).split("."),f=r;for(n=0;n<c.length;n++){if(!f.hasOwnProperty(c[n]))throw Error("Unrecognized operation "+d+" (failed at "+c.slice(0,n+1).join(".")+")");f=f[c[n]]}return f.apply(o,u)}throw Error("Unrecognized operation "+d)},e.uses_data=function(r){var t=[];if(e.is_logic(r)){var o=e.get_operator(r),n=r[o];Array.isArray(n)||(n=[n]),"var"===o?t.push(n[0]):n.forEach(function(r){t.push.apply(t,e.uses_data(r))})}for(var a=[],i=0,l=t.length;i<l;i++)-1===a.indexOf(t[i])&&a.push(t[i]);return a},e.add_operation=function(e,t){r[e]=t},e.rm_operation=function(e){delete r[e]},e.rule_like=function(r,t){if(t===r||"@"===t)return!0;if("number"===t)return"number"==typeof r;if("string"===t)return"string"==typeof r;if("array"===t)return Array.isArray(r)&&!e.is_logic(r);if(e.is_logic(t)){if(e.is_logic(r)){var o=e.get_operator(t),n=e.get_operator(r);if("@"===o||o===n)return e.rule_like(e.get_values(r,!1),e.get_values(t,!1))}return!1}if(Array.isArray(t)&&Array.isArray(r)){if(t.length!==r.length)return!1;for(var a=0;a<t.length;a+=1)if(!e.rule_like(r[a],t[a]))return!1;return!0}return!1},e})},2579,e=>{"use strict";var r=e.i(793365),t=e.i(389959);e.i(128328);var o=e.i(704206),n=e.i(158639),a=e.i(154985),i=e.i(10429),l=e.i(265735),s=e.i(635494);let d=e=>`^${e.replace(".","\\.").replace("%",".*")}$`;function u(e,t){return!e.filter(e=>e.restrictive).some(({condition:e})=>null===e||r.default.apply(e,t))&&e.filter(e=>!e.restrictive).some(({condition:e})=>null===e||r.default.apply(e,t))}function c(e,r,t,o,n,a){if(!e||!Array.isArray(e))return!1;if(a){let i=e.filter(e=>e.organization_slug===n&&e.actions.some(e=>r?r.match(d(e)):null)&&e.resources.some(e=>t.match(d(e)))&&e.project_refs?.includes(a));if(i.length>0)return u(i,{resource_name:t,...o})}return u(e.filter(e=>!e.project_refs||0===e.project_refs.length).filter(e=>e.organization_slug===n&&e.actions.some(e=>r?r.match(d(e)):null)&&e.resources.some(e=>t.match(d(e)))),{resource_name:t,...o})}function f(e,r,t=!0){return p(e,r,void 0,t)}function p(e,r,t,o=!0){let{data:i,isPending:d,isSuccess:u}=(0,a.usePermissionsQuery)({enabled:void 0===e&&o}),c=void 0===r&&o,{data:f,isPending:g,isSuccess:b}=(0,l.useSelectedOrganizationQuery)({enabled:c}),m=(void 0===r?f:{slug:r})?.slug,{ref:x}=(0,n.useParams)(),h=!!x&&void 0===t&&o,{data:y,isPending:v,isSuccess:w}=(0,s.useSelectedProjectQuery)({enabled:h}),E=void 0===t||y?.parent_project_ref?y:{ref:t,parent_project_ref:void 0},A=E?.parent_project_ref?E.parent_project_ref:E?.ref;return{permissions:void 0===e?i:e,organizationSlug:m,projectRef:A,isLoading:d||c&&g||h&&v,isSuccess:u&&(!c||b)&&(!h||w)}}function g(e,r,n,a){let l=(0,o.useIsLoggedIn)(),{organizationSlug:s,projectRef:d,permissions:u}=a??{},{permissions:f,organizationSlug:g,projectRef:b,isLoading:m,isSuccess:x}=p(u,s,d,l),h=(0,t.useMemo)(()=>!i.IS_PLATFORM||!!l&&!!x&&!!f&&c(f,e,r,n,g,b),[l,x,f,e,r,n,g,b]);return{isLoading:!!i.IS_PLATFORM&&(!l||m),isSuccess:!i.IS_PLATFORM||!!l&&x,can:h}}e.s(["doPermissionsCheck",()=>c,"useAsyncCheckPermissions",()=>g,"useGetPermissions",()=>f])},938933,305551,e=>{"use strict";var r=e.i(389959);let t={bg:{brand:{primary:"bg-purple-600",secondary:"bg-purple-200"}},text:{brand:"text-purple-600",body:"text-foreground-light",title:"text-foreground"},border:{brand:"border-brand-600",primary:"border-default",secondary:"border-secondary",alternative:"border-alternative"},placeholder:"placeholder-foreground-muted",focus:`
    outline-none
    focus:ring-current focus:ring-2
  `,"focus-visible":`
    outline-none
    transition-all
    outline-0
    focus-visible:outline-4
    focus-visible:outline-offset-1
  `,size:{text:{tiny:"text-xs",small:"text-sm leading-4",medium:"text-sm",large:"text-base",xlarge:"text-base"},padding:{tiny:"px-2.5 py-1",small:"px-3 py-2",medium:"px-4 py-2",large:"px-4 py-2",xlarge:"px-6 py-3"}},overlay:{base:"absolute inset-0 bg-background opacity-50",container:"fixed inset-0 transition-opacity"}},o={tiny:`${t.size.text.tiny} ${t.size.padding.tiny}`,small:`${t.size.text.small} ${t.size.padding.small}`,medium:`${t.size.text.medium} ${t.size.padding.medium}`,large:`${t.size.text.large} ${t.size.padding.large}`,xlarge:`${t.size.text.xlarge} ${t.size.padding.xlarge}`},n={tiny:"pl-7",small:"pl-8",medium:"pl-8",large:"pl-10",xlarge:"pl-11"},a={accordion:{variants:{default:{base:`
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
      ${t.border.primary}

      flex flex-col
      rounded-md shadow-lg overflow-hidden relative
    `,hoverable:"transition hover:-translate-y-1 hover:shadow-2xl",head:`px-8 py-6 flex justify-between
    border-b
      ${t.border.primary} `,content:"p-8"},tabs:{base:"w-full justify-between space-y-4",underlined:{list:`
        flex items-center border-b
        ${t.border.secondary}
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
      ${t.focus}
      focus-visible:border-foreground-muted
      focus-visible:ring-background-control
      ${t.placeholder}
      group
    `,variants:{standard:`
        bg-foreground/[.026]
        border border-control
        `,error:`
        bg-destructive-200
        border border-destructive-500
        focus:ring-destructive-400
        placeholder:text-destructive-400
       `},container:"relative",with_icon:n,size:{...o},disabled:"opacity-50",actions_container:"absolute inset-y-0 right-0 pl-3 pr-1 flex space-x-1 items-center",textarea_actions_container:"absolute inset-y-1.5 right-0 pl-3 pr-1 flex space-x-1 items-start",textarea_actions_container_items:"flex items-center"},select:{base:`
      block
      box-border
      w-full
      rounded-md
      shadow-sm
      transition-all
      text-foreground
      border
      focus-visible:shadow-md
      ${t.focus}
      focus-visible:border-foreground-muted
      focus-visible:ring-background-control
      ${t.placeholder}

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
       `},container:"relative",with_icon:n,size:{...o},disabled:"opacity-50",actions_container:"absolute inset-y-0 right-0 pl-3 pr-1 mr-5 flex items-center",chevron_container:"absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none",chevron:"h-5 w-5 text-foreground-lighter"},inputNumber:{base:`
      block
      box-border
      w-full
      rounded-md
      shadow-sm
      transition-all
      text-foreground
      border
      focus-visible:shadow-md
      ${t.focus}
      focus-visible:border-foreground-muted
      focus-visible:ring-background-control
      ${t.placeholder}

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
       `},disabled:"opacity-50",container:"relative",with_icon:n,size:{...o},actions_container:"absolute inset-y-0 right-0 pl-3 pr-1 flex space-x-1 items-center"},checkbox:{base:`
      bg-transparent
      ${t.focus}
      focus:ring-border-muted
      text-brand
      border-strong
      shadow-sm
      rounded
      cursor-pointer
    `,container:"flex cursor-pointer leading-none",size:{tiny:"h-3 w-3 mt-1 mr-3",small:"h-3.5 w-3.5 mt-0.5 mr-3.5",medium:"h-4 w-4 mt-0.5 mr-3.5",large:"h-5 w-5 mt-0.5 mr-4",xlarge:"h-5 w-5 mt-0.5 mr-4"},disabled:"opacity-50",label:{base:"text-foreground-light cursor-pointer",...t.size.text},label_before:{base:"text-border",...t.size.text},label_after:{base:"text-border",...t.size.text},description:{base:"text-foreground-lighter",...t.size.text},group:"space-y-3"},radio:{base:`
      absolute
      ${t.focus}
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
        `,radio_offset:"left-4"},list:{container:{base:"relative cursor-pointer flex",size:{tiny:"pl-6",small:"pl-6",medium:"pl-7",large:"pl-7",xlarge:"pl-7"},align:{vertical:"flex flex-col space-y-1",horizontal:"flex flex-row space-x-2"}},group:"space-y-4",base:"",size:{tiny:"0",small:"0",medium:"0",large:"0",xlarge:"0"},active:"",radio_offset:"left-0"}},label:{base:"text-foreground-light cursor-pointer",...t.size.text},label_before:{base:"text-border",...t.size.text},label_after:{base:"text-border",...t.size.text},description:{base:"text-foreground-lighter",...t.size.text},optionalLabel:{base:"text-foreground-lighter",...t.size.text},disabled:"opacity-50 cursor-auto border-dashed"},sidepanel:{base:`
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
      ${t.focus}
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
      `,tiny:"!h-3 !w-3",small:"!h-5 !w-5",medium:"!h-5 !w-5",large:"!h-6 !w-6",xlarge:"!h-6 !w-6"},handle_active:{tiny:" translate-x-3 dark:bg-white",small:"translate-x-5 dark:bg-white",medium:"translate-x-5 dark:bg-white",large:"translate-x-5 dark:bg-white",xlarge:"translate-x-5 dark:bg-white"},disabled:"opacity-75 cursor-not-allowed"},form_layout:{container:"grid gap-2",flex:{left:{base:"flex flex-row gap-6",content:"",labels:"order-2",data_input:"order-1"},right:{base:"flex flex-row gap-6 justify-between",content:"order-last",labels:"",data_input:"text-right"}},responsive:"md:grid md:grid-cols-12",non_responsive:"grid grid-cols-12 gap-2",labels_horizontal_layout:"flex flex-row space-x-2 justify-between col-span-12",labels_vertical_layout:"flex flex-col space-y-2 col-span-4",data_input_horizontal_layout:"col-span-12",non_box_data_input_spacing_vertical:"my-3",non_box_data_input_spacing_horizontal:"my-3 md:mt-0 mb-3",data_input_vertical_layout:"col-span-8",data_input_vertical_layout__align_right:"text-right",label:{base:"block text-foreground-light",size:{...t.size.text}},label_optional:{base:"text-foreground-lighter",size:{...t.size.text}},description:{base:"mt-2 text-foreground-lighter leading-normal",size:{...t.size.text}},label_before:{base:"text-foreground-lighter ",size:{...t.size.text}},label_after:{base:"text-foreground-lighter",size:{...t.size.text}},error:{base:`
        text-red-900
        transition-all
        data-show:mt-2
        data-show:animate-slide-down-normal
        data-hide:animate-slide-up-normal
      `,size:{...t.size.text}},size:{tiny:"text-xs",small:"text-sm leading-4",medium:"text-sm",large:"text-base",xlarge:"text-base"}},popover:{trigger:`
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
      ${t.focus}
      focus-visible:border-foreground-muted
      focus-visible:ring-background-control
      ${t.placeholder}
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
    `}};e.s(["default",0,a],305551);let i=(0,r.createContext)({theme:a});function l(e){let{theme:{[e]:t}}=(0,r.useContext)(i);return t||(t=a.accordion),t=JSON.parse(t=JSON.stringify(t).replace(/\\n/g,"").replace(/\s\s+/g," "))}e.s(["default",()=>l],938933)},867637,704598,e=>{"use strict";let r=(0,e.i(388019).default)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);e.s(["default",()=>r],704598),e.s(["AlertCircle",()=>r],867637)}]);

//# debugId=a46b48be-9148-bd44-2175-3a7f63358d52
//# sourceMappingURL=a4c22fc4f26c2e5b.js.map